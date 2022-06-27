// import necessary dependencies
const express = require("express");
const path = require("path");
const socketIO = require("socket.io");
const http = require("http");

const port = process.env.PORT;
const app = express();
const publicPath = path.join(__dirname, "/../public");

// setup the Express server
app.use(express.json());
app.use(express.static(publicPath));

// create a Server instance using http.createServer() with Express Application
const server = http.createServer(app);
// add WebSocket support to the Server instance
const io = new socketIO.Server(server);

// define eventListener handlers of Server and sockets
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", (reason) => {
    console.log(reason);
  });

  // message sent to new User
  socket.emit("newMessage", {
    from: "Admin",
    text: "Welcome to the chat app",
    createdAt: new Date().getTime(),
  });

  // meesage sent to all User except the new User
  socket.broadcast.emit("newMessage", {
    from: "Admin",
    text: "New user joined the chat",
    createdAt: new Date().getTime(),
  });

  // listens to createMessage event and then broadcast the message to all
  socket.on("createMessage", (message) => {
    console.log("Message: ", message);
    io.emit("newMessage", {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });
});

// make the Server instance listen to specific port
server.listen(port, () => {
  console.log("Server listening to " + port);
});
