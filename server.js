const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const { createRoutesFromChildren } = require("react-router-dom");
const { Server } = require("socket.io");
const ACTIONS = require("./src/Action");
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static("build"));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const userSocketMapping = {};
userSocketMapping.arr = Array();

const getAllConnectedClients = (roomID) => {
  return Array.from(io.sockets.adapter.rooms.get(roomID) || []).map(
    (clientID) => {
      return {
        clientID,
        username: userSocketMapping[clientID],
      };
    }
  );
};

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomID, username }) => {
    console.log(roomID, username);
    userSocketMapping[socket.id] = username;

    socket.join(roomID);
    console.log(socket.id, username);
    const clients = getAllConnectedClients(roomID);
    console.log("clients:", clients);

    clients.forEach(({ clientID }) => {
      console.log("1", clientID);
      // console.log(clients)
      io.to(clientID).emit(ACTIONS.JOINED, {
        clients,
        username,
        clientID: socket.id,
      });
      console.log(clients);
    });
    // return ()=>{
    // socket.off("connection");
    // };
  });

  // io.to(roomID).emit(ACTIONS.CODE_CHANGE, { code });
  // ya mule code ulta right hot aahe cause jo edite krt aahe tyachya editor vr pn te chnage houn reright hot aahe

  socket.on(ACTIONS.CODE_CHANGE, ({ roomID, code }) => {
    console.log("getting", code);
    socket.in(roomID).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ clientID, code }) => {
    console.log("syncing", code);
    io.to(clientID).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        clientID: socket.id,
        username: userSocketMapping[socket.id],
      });
    });
    delete userSocketMapping[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("listening to post: " + PORT);
});
