const socket = io();

socket.on("message", (message) => {
  console.log(message); //message is the one we got from server
  addMessage(message);

  //scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

socket.on("messageBot", (message) => {
  addMessageBot(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

//using qs to get query from window.location.search i.e the url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("joinroom", { username, room });

//updating room info
socket.on("roomInfo", ({ room, userList }) => {
  updateUsers(userList);
  updateRoom(room);
  // console.log(room);
  // userList.forEach((i) => {
  //   console.log(i.username);
  // });
});

//DOM MANIPULATION
const chatForm = document.getElementById("chat-form");
const chatContainer = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const listOfUsers = document.getElementById("users");

//on sending a msg
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userMsg = e.target.elements.msg.value;
  socket.emit("userMessage", userMsg);

  //clear input box
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//add msg to dom
const addMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.msg}
  </p>`;
  chatContainer.appendChild(div);
};

const addMessageBot = (message) => {
  const div = document.createElement("div");
  div.classList.add("message-bot");
  div.innerHTML = ` 
  <p class="text">
    ${message.msg}
  </p>`;
  chatContainer.appendChild(div);
};

//user room info updation in dom
const updateRoom = (room) => {
  roomName.innerText = room;
};

const updateUsers = (userList) => {
  listOfUsers.innerHTML = "";
  userList.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    listOfUsers.appendChild(li);
  });
};
