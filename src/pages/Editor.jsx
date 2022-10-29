import React, { useEffect, useState } from "react";
import { useRef } from "react";
import toast from "react-hot-toast";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ACTIONS from "../Action";
import Client from "../components/Client";
import EditorPage from "../components/EditorPage";
import { initSocket } from "../socket";

function Editor() {
  const socketRef = useRef(null);
  const codeRef=useRef(null);
  const location = useLocation();
  const { roomID } = useParams();
  const reactNavigater = useNavigate();
  const [clients, setClients] = useState([]);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      //   if(!socketRef.current) return;
      // console.log("rendered");

      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      // const handleErrors = (err) => {
      //   console.log("socket error", err);
      //   toast.error("socket connection failed,try again later!");
      //   reactNavigator("/");
      // };
      const handleErrors = (err) => {
        console.log("Socket error", err);
        toast.error("Socket connection failed, try again later.");

        reactNavigater("/");
      };

      console.log(socketRef.current || socketRef.current.children[0]);
      socketRef.current.emit(ACTIONS.JOIN, {
        roomID,
        username: location.state?.username,
      });

      // listening to joined clients
      // clientID=socketID
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, clientID }) => {
          console.log("clients", clients);

          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
            console.log(`joined user: ${username}`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE,{
            code:codeRef.current,
            clientID,
          });
        }
      );

      //listening for disconnected clients
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ clientID, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) =>client.clientID !== clientID);
        });
      });

      
    };

    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
  };
    // return () => controller.abort();
  }, []);


  // copy id function 
  const copyRoomID=async()=>{
    try {
      await navigator.clipboard.writeText(roomID);
      toast.success("Room ID copied to your clipboard");
    } catch (error) {
      toast.error('could not copy room ID');
      console.log(error);
    }
  }


  /////////////// function to leave room///////////////
  
  const leaveRoom=()=>{
    reactNavigater("/");
  }




  if (!location.state) {
    return <Navigate to="/" />;
  }
  return (
    <div className="editorWrapper">
      <div className="leftWrapper">
        <div className="leftInner">
          <div className="title">
            <h1 className="title">Code Editor++ </h1>
          </div>
          <h3>Connected Clients</h3>
          <div className="connectClientList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomID}>Copy RoomID</button>
        <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>
      </div>
      <div className="rightWrapper">
        <EditorPage socketRef={socketRef} roomID={roomID} onCodeChange={(code)=>{codeRef.current=code;}}/>
        
      </div>
      
    </div>
  );
}

export default Editor;
