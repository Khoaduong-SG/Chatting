
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

const authSection = document.getElementById("auth-section");
const chatSection = document.getElementById("chat-section");
const chatBox = document.getElementById("chat-box");

auth.onAuthStateChanged(user => {
  if (user) {
    authSection.style.display = "none";
    chatSection.style.display = "block";
    listenForMessages();
  } else {
    authSection.style.display = "block";
    chatSection.style.display = "none";
  }
});

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
}

function logout() {
  auth.signOut();
}

function sendMessage() {
  const message = document.getElementById("message").value;
  if (message.trim() === "") return;
  const user = auth.currentUser;
  db.ref("messages").push({
    user: user.email,
    text: message,
    time: Date.now()
  });
  document.getElementById("message").value = "";
}

function listenForMessages() {
  db.ref("messages").on("child_added", snapshot => {
    const msg = snapshot.val();
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");
    msgDiv.innerText = `${msg.user}: ${msg.text}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}
