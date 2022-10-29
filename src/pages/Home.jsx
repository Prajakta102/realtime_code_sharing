import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const [roomID, setRoomID] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();


  const createNewRoomID = (e) => {
    e.preventDefault();
    const id = uuid();
    setRoomID(id);
    toast.success(' New Room Created Successfully');
    console.log(id);
  };

  const joinRoom=(e)=>{
    if(!roomID || !username)
    {
      toast.error('Room id and username are required');
      return ;
    }

    navigate(`/editor/${roomID}`,{
      state:{
        username,
      }
    })
  }

  const enterKeyAction=(e)=>{
    // console.log("event",e.code);
    if(e.code==='Enter')
    {
      joinRoom();
    }
  }


  return (
    <div className="wrapper">
      <div className="formWrapper">
        <h1 className="title">Code Editor++ </h1>
        <h4 className="mainLabel">Paste Invitation ROOM ID</h4>
        <div className="inputGroups">
          <input
            type="text"
            className="inputBox"
            placeholder="Enter Valid Room ID: "
            onChange={(e)=>setRoomID(e.target.value)}
            value={roomID}
            onKeyUp={enterKeyAction}
          />
          <input type="text" className="inputBox" placeholder="Username:" 
           onChange={(e)=>setUsername(e.target.value)}
           value={username}
           onKeyUp={enterKeyAction}
           />
          <button className="btn joinBtn" onClick={joinRoom}>Join</button>
          <a onClick={createNewRoomID} href="" className="createRoom">
            Create new room
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
