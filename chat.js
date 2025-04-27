// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCe6ZDW_1dUn9WCnrls_9Y5ookztnf_0Zs",
    authDomain: "chathub-25042025.firebaseapp.com",
    databaseURL: "https://chathub-25042025-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chathub-25042025",
    storageBucket: "chathub-25042025.appspot.com",
    messagingSenderId: "616104747114",
    appId: "1:616104747114:web:6f981f3cdc93199126aa13",
    measurementId: "G-GFPB602T33"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let username = '';

function promptUsername() {
    username = prompt('Nhập tên của bạn:');
    if (!username || username.trim() === '') {
        username = 'Người dùng ẩn danh';
    }
}

promptUsername();

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messagesContainer = document.getElementById('messages');
const typingIndicator = document.getElementById('typingIndicator');

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    } else {
        sendTypingStatus();
    }
});

// Gửi tin nhắn
function sendMessage() {
    const text = messageInput.value.trim();
    if (text !== '') {
        const newMessageRef = db.ref('messages').push();
        newMessageRef.set({
            username: username,
            text: text,
            timestamp: Date.now()
        });
        messageInput.value = '';
        db.ref('typing').remove();
    }
}

// Hiển thị tin nhắn
db.ref('messages').on('child_added', (snapshot) => {
    const message = snapshot.val();
    displayMessage(message);
});

// Hiển thị typing
db.ref('typing').on('value', (snapshot) => {
    const typingUser = snapshot.val();
    if (typingUser && typingUser !== username) {
        typingIndicator.innerText = `${typingUser} đang nhập...`;
    } else {
        typingIndicator.innerText = '';
    }
});

// Gửi trạng thái typing
let typingTimeout;
function sendTypingStatus() {
    db.ref('typing').set(username);

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        db.ref('typing').remove();
    }, 2000);
}

// Render tin nhắn ra giao diện
function displayMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(message.username === username ? 'right' : 'left');

    messageDiv.innerHTML = `
        ${message.username !== username ? `<img src="https://i.pravatar.cc/150?u=${message.username}" class="avatar">` : ''}
        <div>
            <div class="message-content">
                <strong>${message.username}</strong><br>${message.text}
            </div>
            <div class="message-info">${new Date(message.timestamp).toLocaleTimeString()}</div>
        </div>
        ${message.username === username ? `<img src="https://i.pravatar.cc/150?u=${message.username}" class="avatar">` : ''}
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
