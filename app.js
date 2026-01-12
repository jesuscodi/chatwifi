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
