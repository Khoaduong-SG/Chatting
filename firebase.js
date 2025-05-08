// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCe6ZDW_1dUn9WCnrls_9Y5ookztnf_0zS",
  authDomain: "chathub-25042025.firebaseapp.com",
  databaseURL: "https://chathub-25042025-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chathub-25042025",
  storageBucket: "chathub-25042025.appspot.com",
  messagingSenderId: "616104747114",
  appId: "1:616104747114:web:6f981f3cdc93199126aa13",
  measurementId: "G-GFPB6Q2T33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

// Signup function
export async function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const avatar = document.getElementById('avatar').files[0];

  if (!email || !password || !avatar) {
    alert("Vui lòng nhập đủ thông tin và chọn ảnh!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const avatarRef = storageRef(storage, 'avatars/' + user.uid);
    await uploadBytes(avatarRef, avatar);
    const avatarURL = await getDownloadURL(avatarRef);

    localStorage.setItem('user', JSON.stringify({ uid: user.uid, email: user.email, avatar: avatarURL }));
    window.location.href = 'chat.html';
  } catch (error) {
    alert("Đăng ký thất bại: " + error.message);
  }
}

// Login function
export async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const avatarURL = await getDownloadURL(storageRef(storage, 'avatars/' + user.uid));

    localStorage.setItem('user', JSON.stringify({ uid: user.uid, email: user.email, avatar: avatarURL }));
    window.location.href = 'chat.html';
  } catch (error) {
    alert("Đăng nhập thất bại: " + error.message);
  }
}

// Chat initialization
export async function initChat() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

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

    set(ref(db, 'typing/' + user.uid), null);
    messageInput.value = '';
  };

  messageInput.oninput = () => {
    set(ref(db, 'typing/' + user.uid), user.email);
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
    const val = snapshot.val() || {};
    const names = Object.values(val);
    typingDiv.innerText = names.length ? `${names.join(', ')} đang nhập...` : '';
  });
}

// Logout function
export async function logout() {
  await signOut(auth);
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}
