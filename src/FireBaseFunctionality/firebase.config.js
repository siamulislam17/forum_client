// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKX_0gTmPZE6gGcth0qO_j1ZuGWlkJyFY",
  authDomain: "forumnest-9712e.firebaseapp.com",
  projectId: "forumnest-9712e",
  storageBucket: "forumnest-9712e.firebasestorage.app",
  messagingSenderId: "269492329691",
  appId: "1:269492329691:web:d97f6f5a047d53a404c0fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);