// import necessary dependencies
const express = require("express");
const path = require("path");
const socketIO = require("socket.io");
const http = require("http");
const { generateMessage, generateGeolocation } = require("./utils/utils");
const { Users } = require("./utils/users");

// initialize necessary variables
const port = process.env.PORT;
const app = express();
const publicPath = path.join(__dirname, "/../public");
const users = new Users();

// setup the Express server
app.use(express.json());
app.use(express.static(publicPath));

// create a Server instance using http.createServer() with Express Application
const server = http.createServer(app);
// add WebSocket support to the Server instance
const io = new socketIO.Server(server);

// define eventListener handlers of Server and sockets
io.on("connection", (socket) => {
  console.log(`Socket id ${socket.id} connected`);

  // listens to Client's newLocationMessage, and broadcast it
  socket.on("newLocationMessage", (message) => {
    const { name, room } = users.getUser(socket.id);
    const { lat, long } = message;
    io.to(room).emit(
      "newLocationMessage",
      generateGeolocation(name, lat, long)
    );
    console.log("newLocationMessage", name, lat, long);
  });

  // socket join eventListener
  socket.on("join", (payload) => {
    const { name, room } = payload;
    users.removeUser(socket.id);
    users.addUser(socket.id, name, room);
    socket.join(room);

    // newMessage emit to the Client Socket
    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat app")
    );

    socket.broadcast
      .to(room)
      .emit("newMessage", generateMessage("Admin", `${name} joined the chat`));

    console.log("User " + name + " has joined the room " + room);

    io.to(room).emit("updateUsersList", {
      users: users.getUserList(room),
    });
  });

  // listens to createMessage event and then broadcast the message to all
  socket.on("createMessage", (message) => {
    const user = users.getUser(socket.id);
    if (user) {
      console.log("createMessage ", message);
      io.to(user.room).emit(
        "newMessage",
        generateMessage(user.name, message.text)
      );
    }
  });

  // socket disconnect eventListener
  socket.on("disconnect", () => {
    const removedUser = users.removeUser(socket.id);
    if (removedUser) {
      io.to(removedUser.room).emit(
        "newMessage",
        generateMessage("Admin", `User ${removedUser.name} has disconnected`)
      );
      io.to(removedUser.room).emit("updateUsersList", {
        users: users.getUserList(removedUser.room),
      });
      console.log(`User ${removedUser.name} has disconnected`);
    }
  });
});

// make the Server instance listen to specific port
server.listen(port, () => {
  console.log("Server listening to " + port);
});
