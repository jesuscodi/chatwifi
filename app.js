import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const mensaje = document.getElementById('mensaje');

// Registrar usuario
registerBtn.addEventListener('click', async () => {
    try {
        const email = usernameInput.value + "@chat.com"; // Convertimos el usuario en email ficticio
        await createUserWithEmailAndPassword(auth, email, passwordInput.value);
        mensaje.innerText = "¡Usuario registrado con éxito!";
        window.location.href = "chat.html"; 
    } catch (error) {
        mensaje.innerText = error.message;
    }
});

// Login usuario
loginBtn.addEventListener('click', async () => {
    try {
        const email = usernameInput.value + "@chat.com";
        await signInWithEmailAndPassword(auth, email, passwordInput.value);
        window.location.href = "chat.html"; 
    } catch (error) {
        mensaje.innerText = error.message;
    }
});
