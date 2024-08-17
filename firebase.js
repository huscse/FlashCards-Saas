// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXK9MnJKXtXP3w_zdEuWlcMtalmwhYg9U",
  authDomain: "ai-flashcards-93b02.firebaseapp.com",
  projectId: "ai-flashcards-93b02",
  storageBucket: "ai-flashcards-93b02.appspot.com",
  messagingSenderId: "622315917816",
  appId: "1:622315917816:web:c8c1a641d34956018dc60d",
  measurementId: "G-0FBSNXYZ8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}