
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBq9dhLAa2l7KMRZe8zUaW7V3QqM7sTw2Y",
  authDomain: "maronaut-sailing-app.firebaseapp.com",
  projectId: "maronaut-sailing-app",
  storageBucket: "maronaut-sailing-app.appspot.com",
  messagingSenderId: "846712718933",
  appId: "1:846712718933:web:9a7a15f8df9f44f01a7b35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
