import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

// Detectar en qué página estamos
const currentPage = window.location.pathname.split("/").pop();

if(currentPage === "index.html") {
    // LOGIN / REGISTRO
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const mensaje = document.getElementById('mensaje');

    registerBtn.addEventListener('click', async () => {
        try {
            const email = usernameInput.value + "@chat.com";
            await createUserWithEmailAndPassword(auth, email, passwordInput.value);
            mensaje.innerText = "¡Usuario registrado con éxito!";
            window.location.href = "chat.html"; 
        } catch (error) {
            mensaje.innerText = error.message;
        }
    });

    loginBtn.addEventListener('click', async () => {
        try {
            const email = usernameInput.value + "@chat.com";
            await signInWithEmailAndPassword(auth, email, passwordInput.value);
            window.location.href = "chat.html"; 
        } catch (error) {
            mensaje.innerText = error.message;
        }
    });

} else if(currentPage === "chat.html") {
    // CHAT EN TIEMPO REAL
    auth.onAuthStateChanged(user => {
        if(!user) window.location.href = "index.html";
    });

    const messagesContainer = document.getElementById('messages');
    const msgInput = document.getElementById('msgInput');
    const sendBtn = document.getElementById('sendBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    const messagesRef = collection(db, "mensajes");
    const q = query(messagesRef, orderBy("timestamp"));

    onSnapshot(q, (snapshot) => {
        messagesContainer.innerHTML = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const div = document.createElement("div");
            div.classList.add(data.emisor === auth.currentUser.email ? "my-msg" : "other-msg");
            div.innerHTML = `<strong>${data.emisor.split('@')[0]}:</strong> ${data.texto}`;
            messagesContainer.appendChild(div);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });

    sendBtn.addEventListener('click', async () => {
        if(msgInput.value.trim() === "") return;
        await addDoc(messagesRef, {
            emisor: auth.currentUser.email,
            texto: msgInput.value,
            timestamp: serverTimestamp()
        });
        msgInput.value = "";
    });

    logoutBtn.addEventListener('click', async () => {
        await signOut(auth);
        window.location.href = "index.html";
    });
}
