// Import các hàm cần thiết từ Firebase SDK
import { initializeApp } from "firebase/app";
// Import các hàm cần thiết cho Realtime Database
import { getDatabase, ref, push, onChildAdded, serverTimestamp } from "firebase/database";
// Lưu ý: getAnalytics không cần thiết cho chức năng chat cốt lõi, bạn có thể bỏ qua nếu không dùng

// Cấu hình Firebase của bạn (sử dụng cấu hình đã cung cấp)
const firebaseConfig = {
    apiKey: "AIzaSyCe6ZDW_1dUn9WCnrls_9Y5ookztnf_0Zs",
    authDomain: "chathub-25042025.firebaseapp.com",
    databaseURL: "https://chathub-25042025-default-rtdb.asia-southeast1.firebasedatabase.app", // Đảm bảo đây là URL Realtime Database của bạn
    projectId: "chathub-25042025",
    storageBucket: "chathub-25042025.firebasestorage.app",
    messagingSenderId: "616104747114",
    appId: "1:616104747114:web:6f981f3cdc93199126aa13",
    // measurementId: "G-GFPB602T33" // Không cần thiết cho chat
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Lấy tham chiếu đến dịch vụ Realtime Database
const database = getDatabase(app);

// Lấy tham chiếu đến node 'messages' trong database
// Đây sẽ là nơi lưu trữ tất cả các tin nhắn
const messagesRef = ref(database, 'messages');

// --- Lấy tham chiếu đến các phần tử HTML ---
const chatbox = document.getElementById('chatbox');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');

// --- Hàm xử lý tin nhắn ---

// Hàm gửi tin nhắn
function sendMessage() {
    const messageText = messageInput.value.trim(); // Lấy nội dung tin nhắn và xóa khoảng trắng thừa

    // Chỉ gửi tin nhắn nếu nội dung không rỗng
    if (messageText !== "") {
        // Tạo một đối tượng tin nhắn mới
        // Trong ví dụ đơn giản này, chúng ta chỉ lưu nội dung và timestamp
        // Trong ứng dụng thực tế, bạn có thể thêm userId, username, avatar, v.v.
        const newMessage = {
            text: messageText,
            // serverTimestamp() tốt hơn Date.now() vì nó sử dụng thời gian của server Firebase
            timestamp: serverTimestamp()
        };

        // Dùng push() để thêm tin nhắn mới vào node 'messages'
        // push() sẽ tự động tạo một khóa (key) duy nhất cho mỗi tin nhắn
        push(messagesRef, newMessage)
            .then(() => {
                console.log("Tin nhắn đã được gửi thành công!");
                messageInput.value = ""; // Xóa nội dung trong ô nhập sau khi gửi
                // Tự động cuộn xuống cuối hộp chat
                chatbox.scrollTop = chatbox.scrollHeight;
            })
            .catch((error) => {
                console.error("Lỗi khi gửi tin nhắn:", error);
                alert("Không thể gửi tin nhắn: " + error.message); // Thông báo lỗi cho người dùng
            });
    }
}

// Hàm hiển thị một tin nhắn trong hộp chat
function displayMessage(snapshot) {
    // snapshot chứa dữ liệu của tin nhắn (bao gồm key và value)
    const messageData = snapshot.val(); // Lấy giá trị (đối tượng tin nhắn)

    const messageElement = document.createElement('div');
    messageElement.classList.add('message'); // Thêm class để dễ dàng style

    // Hiển thị nội dung tin nhắn
    // Bạn có thể format thêm timestamp hoặc tên người gửi nếu có
    messageElement.textContent = messageData.text;

    // Thêm tin nhắn vào hộp chat
    chatbox.appendChild(messageElement);

    // Tự động cuộn xuống cuối hộp chat để xem tin nhắn mới nhất
    chatbox.scrollTop = chatbox.scrollHeight;
}

// --- Listener Real-time ---

// onChildAdded lắng nghe sự kiện khi có một child (một tin nhắn) được thêm vào node 'messages'
// Hàm này sẽ chạy một lần cho mỗi tin nhắn đã có sẵn khi listener được gắn,
// và sau đó chạy mỗi khi có tin nhắn mới được thêm vào.
onChildAdded(messagesRef, (snapshot) => {
    // snapshot chứa dữ liệu của tin nhắn mới được thêm vào
    console.log("Nhận được tin nhắn mới:", snapshot.key, snapshot.val());
    displayMessage(snapshot); // Hiển thị tin nhắn này
}, (error) => {
    console.error("Lỗi khi lắng nghe tin nhắn:", error);
});


// --- Gắn sự kiện cho các phần tử HTML ---

// Gắn sự kiện click cho nút "Gửi"
sendMessageBtn.addEventListener('click', sendMessage);

// Gắn sự kiện nhấn phím cho ô nhập tin nhắn
// Để cho phép người dùng nhấn Enter để gửi
messageInput.addEventListener('keypress', (event) => {
    // Kiểm tra xem phím được nhấn có phải là Enter (mã 13) không
    if (event.key === 'Enter') {
        event.preventDefault(); // Ngăn chặn hành động mặc định của phím Enter (ví dụ: gửi form nếu input nằm trong form)
        sendMessage(); // Gọi hàm gửi tin nhắn
    }
});

console.log("Script Firebase chat đã tải.");
