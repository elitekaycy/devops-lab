"use strict";

const chatMessageFormBtn = document.getElementById("send-btn");
const registerBtn = document.getElementById("register-btn");
const chatForm = document.getElementById("chat-form");
const messageHistory = document.getElementById("message-history");
const chatMessageInput = document.getElementById("chat-message");
const sendBtn = document.getElementById("send-btn");
const userForm = document.getElementById("user-form");
const chatErrorText = document.getElementById("chat-error");

var stompClient = null;
var username = null;

function connect(event) {
  username = document.getElementById("username").value.trim();

  if (username) {
    userForm.classList.add("hidden");
    chatForm.classList.remove("hidden");

    var socket = new SockJS("/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnect, onError);
  }

  event.preventDefault();
}

function onConnect() {
  stompClient.subscribe("/topic/public", onMessageRecieved);
  stompClient.send(
    "/app/chat.addUser",
    {},
    JSON.stringify({ sender: username, type: "JOIN" }),
  );
}

function onMessageRecieved(payload) {
  var message = JSON.parse(payload.body);
  console.log("message", message);

  const bubbleElement = document.createElement("div");
  bubbleElement.classList.add(
    "flex",
    "rounded-lg",
    "shadow-md",
    "p-4",
    "bg-blue-100",
    "text-gray-700",
  );

  if (message.type === "JOIN") {
    message.sender = username;
    message.content = message.sender + "joined";
  } else {
    const senderNameElement = document.createElement("span");
    senderNameElement.classList.add("font-bold", "mr-2");
    senderNameElement.textContent = message.sender;
    bubbleElement.appendChild(senderNameElement);

    const messageTextElement = document.createElement("p");
    messageTextElement.textContent = message.content;
    bubbleElement.appendChild(messageTextElement);

    messageHistory.appendChild(bubbleElement);
    messageHistory.scrollTop = messageHistory.scrollHeight;
  }
}

function onError() {
  chatErrorText.classList.remove("hidden");
  chatErrorText.textContent =
    "error occured connection or getting messages and channel";
}

function sendMessage(event) {
  event.preventDefault();
  var message = chatMessageInput.value.trim();
  console.log("msg", message);

  if (message && stompClient) {
    var chatMessage = {
      sender: username,
      content: message,
      type: "CHAT",
    };

    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    chatMessageInput.textContent = "";
  }
}

registerBtn.addEventListener("click", connect, true);
chatMessageFormBtn.addEventListener("click", sendMessage, true);
