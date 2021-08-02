const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketio(server);

//utils
const formatmsg = require("./utils/formatMsg");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getUserRoom,
} = require("./utils/users");

//add static files
app.use(express.static(path.join(__dirname, "public")));

//run when client connects
io.on("connection", (socket) => {
  socket.on("joinroom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    ///join specific room
    socket.join(user.room);

    //welcome the user
    socket.emit(
      "messageBot",
      formatmsg("ChatBot", `Welcome to ChatApp ${user.username}!`)
    );

    //broadcast msg when another user joins
    socket.broadcast
      .to(user.room)
      .emit(
        "messageBot",
        formatmsg("ChatBot", `${user.username} has joined the chat`)
      );

    //send room info to client(no event->io, else->socket)
    io.to(user.room).emit("roomInfo", {
      room: user.room,
      userList: getUserRoom(user.room),
    });
  });

  //get user msg from client and emit it back to client
  socket.on("userMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatmsg(user.username, msg));
  });

  //broadcast if another user disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "messageBot",
        formatmsg("ChatBot", `${user.username} has left the chat`)
      );

      //send room info to client(no event->io, else->socket)
      io.to(user.room).emit("roomInfo", {
        room: user.room,
        userList: getUserRoom(user.room),
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
