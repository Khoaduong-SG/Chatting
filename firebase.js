// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getDatabase, ref, push, onChildAdded, set, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export async function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const avatar = document.getElementById('avatar').files[0];
  if (!email || !password || !avatar) {
    alert("Vui lòng nhập đủ thông tin và chọn ảnh!");
    return;
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const avatarRef = storageRef(storage, 'avatars/' + user.uid);
  await uploadBytes(avatarRef, avatar);
  const avatarURL = await getDownloadURL(avatarRef);
  localStorage.setItem('user', JSON.stringify({ uid: user.uid, email: email, avatar: avatarURL }));
  window.location.href = 'chat.html';
}

export async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const avatarURL = await getDownloadURL(storageRef(storage, 'avatars/' + user.uid));
  localStorage.setItem('user', JSON.stringify({ uid: user.uid, email: email, avatar: avatarURL }));
  window.location.href = 'chat.html';
}

export async function initChat() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) window.location.href = 'login.html';
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const messagesDiv = document.getElementById('messages');
  const typingDiv = document.getElementById('typing');

  sendBtn.onclick = () => {
    const msg = messageInput.value;
    if (!msg.trim()) return;
    push(ref(db, 'messages'), {
      text: msg,
      sender: user.email,
      avatar: user.avatar,
      timestamp: Date.now()
    });
    set(ref(db, 'typing'), '');
    messageInput.value = '';
  };

  messageInput.oninput = () => {
    set(ref(db, 'typing'), user.email + " đang nhập...");
  };

  onChildAdded(ref(db, 'messages'), (snapshot) => {
    const data = snapshot.val();
    const div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `<img src="${data.avatar}" width="20" style="border-radius:50%;"> <b>${data.sender}:</b> ${data.text}`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  onValue(ref(db, 'typing'), (snapshot) => {
    typingDiv.innerText = snapshot.val() || '';
  });
}

export function logout() {
  signOut(auth);
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}