import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { app } from "./firebase-config.js"; // file firebase-config.js của bạn đã khai báo initializeApp

const db = getDatabase(app);
const auth = getAuth(app);

// Xác định user
let currentUser = null;
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    window.location.href = "index.html"; // Nếu chưa đăng nhập, về lại trang login
  }
});

// Gửi tin nhắn
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');
const messagesDiv = document.getElementById('messages');
const loading = document.getElementById('loading');

sendBtn.addEventListener('click', () => {
  const text = messageInput.value.trim();
  if (text === "" || !currentUser) return;

  loading.style.display = "block";

  push(ref(db, "messages"), {
    uid: currentUser.uid,
    name: currentUser.displayName || "Anonymous",
    text: text,
    timestamp: Date.now()
  }).then(() => {
    messageInput.value = "";
    loading.style.display = "none";
  }).catch((error) => {
    console.error(error);
    loading.style.display = "none";
  });
});

// Lắng nghe tin nhắn mới
onChildAdded(ref(db, "messages"), (snapshot) => {
  const message = snapshot.val();
  displayMessage(message);
});

function displayMessage(message) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');

  const isCurrentUser = message.uid === (currentUser && currentUser.uid);
  msgDiv.classList.add(isCurrentUser ? 'right' : 'left');

  const sender = document.createElement('div');
  sender.className = "sender";
  sender.textContent = message.name;

  const content = document.createElement('div');
  content.textContent = message.text;

  const time = document.createElement('div');
  time.className = "time";
  const date = new Date(message.timestamp);
  time.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  msgDiv.appendChild(sender);
  msgDiv.appendChild(content);
  msgDiv.appendChild(time);

  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
