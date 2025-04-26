import { auth, database } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

const messagesRef = ref(database, "messages");

window.sendMessage = function() {
  const messageInput = document.getElementById("messageInput");
  if (messageInput.value.trim() !== "") {
    push(messagesRef, {
      text: messageInput.value,
      timestamp: Date.now()
    });
    messageInput.value = "";
  }
};

onChildAdded(messagesRef, (data) => {
  const message = data.val();
  const messageElement = document.createElement("div");
  messageElement.innerText = message.text;
  document.getElementById("messages").appendChild(messageElement);
});

window.logout = function() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};