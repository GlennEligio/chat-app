const joinForm = document.querySelector("#join-form");
const nameInputEl = document.querySelector("#name");
const roomInputEl = document.querySelector("#room");

joinForm.addEventListener("submit", function (e) {
  if (nameInputEl.value.trim() === "" || roomInputEl.value.trim() === "") {
    e.preventDefault();
    alert("Display name and Room name must have values");
    return;
  }
});
