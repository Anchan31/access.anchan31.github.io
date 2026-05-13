// Firebase Configuration
// Replace placeholders with your actual project keys from the Firebase Console
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDKuFUJyHUl5AIFSFHCg-4S_wadsha6Et4",
    authDomain: "recruitment-suite-hr.firebaseapp.com",
    projectId: "recruitment-suite-hr",
    storageBucket: "recruitment-suite-hr.firebasestorage.app",
    messagingSenderId: "1049067446272",
    appId: "1:1049067446272:web:a0eb4e5a9fac1589a8f8e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
