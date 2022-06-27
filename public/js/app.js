const socket = io();
socket.on("connect", () => {
  console.log("Connected");
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});

// listens to newMessage
socket.on("newMessage", function (message) {
  console.log("New message: ", message);
});

// emits the createMessage
socket.emit("createMessage", {
  from: "Mean",
  text: "Created message",
});
