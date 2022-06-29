// fetching display and room name
const params = new URLSearchParams(location.search);

// fetch elements in chat.html
const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message-input");
const messageList = document.querySelector("#message-list");
const peopleList = document.querySelector("#people-list");
const sendLocationBtn = document.querySelector("#send-location");
const messageTemplate = document.querySelector("#message-template");
const messageLocationTemplate = document.querySelector(
  "#message-location-template"
);
const peopleItemTemplate = document.querySelector("#people-template");

const scrollToBottom = () => {
  const latestMessageEl = messageList.lastElementChild;
  latestMessageEl.scrollIntoView();
};

const createMessage = (from, createdAt, text) => {
  const messageTemp = messageTemplate.content.querySelector("li");
  const messageEl = document.importNode(messageTemp, true);
  messageEl.querySelector("h4").innerText = from;
  messageEl.querySelector("span").innerText = createdAt;
  messageEl.querySelector("p").innerText = text;
  messageList.appendChild(messageEl);
};

const createLocationMessage = (from, createdAt, url) => {
  const messageTemp = messageLocationTemplate.content.querySelector("li");
  const messageEl = document.importNode(messageTemp, true);
  messageEl.querySelector("h4").innerText = from;
  messageEl.querySelector("span").innerText = createdAt;
  messageEl.querySelector("a").setAttribute("href", url);
  messageList.appendChild(messageEl);
};

const createPeopleItems = (names) => {
  peopleList.innerHTML = "";
  names.forEach((name) => {
    const peopleTemp = peopleItemTemplate.content.querySelector("li");
    const peopleEl = document.importNode(peopleTemp, true);
    peopleEl.querySelector("h4").innerText = name;
    peopleList.appendChild(peopleEl);
  });
};

const socket = io({ transports: ["websocket"], upgrade: false });

socket.on("connect", () => {
  console.log("Connected");
  socket.emit("join", {
    name: params.get("name"),
    room: params.get("room"),
  });
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});

// newLocationMessage listener
socket.on("newLocationMessage", (message) => {
  console.log("New location received");
  const { from, createdAt, url } = message;
  createLocationMessage(from, createdAt, url);
  scrollToBottom();
});

// listens to newMessage
socket.on("newMessage", function (message) {
  console.log("New message: ", message);
  const { from, createdAt, text } = message;
  createMessage(from, createdAt, text);
  scrollToBottom();
});

// listens to updateUserList
socket.on("updateUsersList", function (payload) {
  console.log("Users", payload.users);
  createPeopleItems(payload.users);
});

messageForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const enteredMessage = messageInput.value;

  if (enteredMessage.trim().length === 0) {
    return;
  }

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
