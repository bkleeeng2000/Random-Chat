const socket = io('/');
const getElementById = (id) => document.getElementById(id) || null;

const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

const drawHelloStranger = (userName) => {
  helloStrangerElement.innerHTML = `Hello ${userName} Stranger`;
};

const drawNewChat = (message) => {
  const wrapperChatBox = document.createElement('div');
  wrapperChatBox.innerHTML = `<div>${message}</div>`;
  chattingBoxElement.append(wrapperChatBox);
};

// GlobalSocket Event
socket.on('user_connected', (userName) => drawNewChat(`${userName} connected`));
socket.on('new_chat', (data) => {
  const { chat, username } = data;
  drawNewChat(`${username} : ${chat}`);
});
// event callback function
const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  if (inputValue === '') return;

  socket.emit('submit_chat', inputValue);
  drawNewChat(`me : ${inputValue}`);
};

function helloUser() {
  const userName = prompt('What is your name?');
  socket.emit('new_user', userName, (data) => drawHelloStranger(data));
}

function init() {
  helloUser();
  formElement.addEventListener('submit', handleSubmit);
}

init();
