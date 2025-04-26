import { db, auth } from './firebase-config.js';
import { ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesDiv = document.getElementById('messages');
const loading = document.getElementById('loading');

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const messagesRef = ref(db, 'messages');

  sendBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (!text) return;

    loading.style.display = 'block';
    push(messagesRef, {
      text,
      sender: user.email,
      timestamp: Date.now()
    }).then(() => {
      messageInput.value = '';
      loading.style.display = 'none';
    });
  });

  onChildAdded(messagesRef, snapshot => {
    const msg = snapshot.val();
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ' + (msg.sender === user.email ? 'right' : 'left');
    msgDiv.innerHTML = \`
      <div class="sender">\${msg.sender}</div>
      <div class="text">\${msg.text}</div>
      <div class="time">\${new Date(msg.timestamp).toLocaleTimeString()}</div>
    \`;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
});
