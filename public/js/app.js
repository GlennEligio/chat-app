const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message-input");
const messageList = document.querySelector("#message-list");
const sendLocationBtn = document.querySelector("#send-location");

const socket = io();

socket.on("connect", () => {
  console.log("Connected");
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});

// newLocationMessage listener
socket.on("newLocationMessage", (message) => {
  console.log("New location received");
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.setAttribute("target", "_blank");
  a.setAttribute("href", message.url);
  a.innerText = "Location";
  li.appendChild(a);
  messageList.appendChild(li);
});

// listens to newMessage
socket.on("newMessage", function (message) {
  console.log("New message: ", message);
  const li = document.createElement("li");
  li.innerText = `${message.from}: ${message.text}`;
  messageList.appendChild(li);
});

// // emits the createMessage
// socket.emit(
//   "createMessage",
//   {
//     from: "Mean",
//     text: "Created message",
//   },
//   () => {
//     console.log("Server got the message");
//   }
// );

messageForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const enteredMessage = messageInput.value;

  socket.emit("createMessage", {
    from: "User",
    text: enteredMessage,
  });

  console.log("Message sent");
});

sendLocationBtn.addEventListener("click", (e) => {
  console.log("Location btn clicked");
  e.preventDefault();
  if (!navigator.geolocation) {
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      socket.emit("newLocationMessage", {
        from: "User",
        lat: pos.coords.latitude,
        long: pos.coords.longitude,
      });
    },
    (e) => {
      console.log(e);
    }
  );
});
