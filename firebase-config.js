import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCe6ZDW_1dUn9WCnrls_9Y5ookztnf_0Zs",
  authDomain: "chathub-25042025.firebaseapp.com",
  databaseURL: "https://chathub-25042025-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chathub-25042025",
  storageBucket: "chathub-25042025.firebasestorage.app",
  messagingSenderId: "616104747114",
  appId: "1:616104747114:web:6f981f3cdc93199126aa13",
  measurementId: "G-GFPB602T33"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
