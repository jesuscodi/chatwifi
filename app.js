import { auth, provider } from "./firebase-config.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log('Usuario logueado:', user.displayName, user.email);
        // Guardar info en Firestore
        window.location.href = "chat.html"; // Redirigir al chat
    } catch (error) {
        console.error(error);
    }
});
import { db, auth } from "./firebase-config.js";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

const messagesContainer = document.getElementById('messages');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');

const messagesRef = collection(db, "mensajes");
const q = query(messagesRef, orderBy("timestamp"));

onSnapshot(q, (snapshot) => {
    messagesContainer.innerHTML = "";
    snapshot.forEach(doc => {
        const data = doc.data();
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message");
        msgDiv.innerHTML = `<strong>${data.emisor}:</strong> ${data.texto}`;
        messagesContainer.appendChild(msgDiv);
    });
});

// Enviar mensaje
sendBtn.addEventListener('click', async () => {
    if(msgInput.value.trim() === "") return;
    await addDoc(messagesRef, {
        emisor: auth.currentUser.displayName,
        texto: msgInput.value,
        timestamp: serverTimestamp()
    });
    msgInput.value = "";
});
