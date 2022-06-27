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
  socket.on("disconnect", () => {
    console.log("The user was disconnected");
  });
});

// make the Server instance listen to specific port
server.listen(port, () => {
  console.log("Server listening to " + port);
});
