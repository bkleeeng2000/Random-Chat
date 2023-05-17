const socket = io('/');
const getElementById = (id) => document.getElementById(id) || null;

const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

const drawHelloStranger = (userName) => {
  helloStrangerElement.innerHTML = `Hello ${userName} Stranger`;
};

const drawNewChat = (message, isMe = false) => {
  const wrapperChatBox = document.createElement('div');
  wrapperChatBox.className = 'clearfix';
  let chatBox;
  if (!isMe)
    chatBox = `
    <div class='bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  else
    chatBox = `
    <div class='bg-white w-3/4 ml-auto mr-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

// GlobalSocket Event
socket.on('user_connected', (userName) => drawNewChat(`${userName} connected`));
socket.on('new_chat', (data) => {
  const { chat, username } = data;
  drawNewChat(`${username} : ${chat}`);
});

socket.on('disconnect_user', (username) =>
  drawNewChat(`${username} disconnected`)
);

// event callback function
const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  if (inputValue === '') return;

  socket.emit('submit_chat', inputValue);
  drawNewChat(`me : ${inputValue}`, true);
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
