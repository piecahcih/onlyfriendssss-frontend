import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyDBe02Ij2GYb0DFfcUDMLE7DQNShgxeEZs",
  authDomain: "only-friendssss.firebaseapp.com",
  projectId: "only-friendssss",
  storageBucket: "only-friendssss.firebasestorage.app",
  messagingSenderId: "1063185169841",
  appId: "1:1063185169841:web:019b7efa71d0f606e65190",
  measurementId: "G-MMLC862X0C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider()
export const message = getMessaging(app)