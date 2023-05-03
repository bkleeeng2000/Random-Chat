const socket = io('/');
const getElementById = (id) => document.getElementById(id) || null;

const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

function helloUser() {
  const userName = prompt('What is your name?');
  // helloStrangerElement.innerHTML = `Hello ${userName}`;
}

function init() {
  helloUser();
}

init();
