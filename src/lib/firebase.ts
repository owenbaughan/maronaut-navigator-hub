
import { initializeApp } from "firebase/app";
import { getFirestore, collection, CollectionReference } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAbWsq2c3qS47ytgA-x_DPvEOpjy5402g",
  authDomain: "maronuat.firebaseapp.com",
  projectId: "maronuat",
  storageBucket: "maronuat.appspot.com",
  messagingSenderId: "927440294332",
  appId: "1:927440294332:web:5f9f7d3a00efa245c01bb9",
  measurementId: "G-9CWPQ39QL9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Create collection references with proper typing
const friendsCollection = collection(db, "friends");
const userProfilesCollection = collection(db, "userProfiles");
const friendRequestsCollection = collection(db, "friendRequests");

// Initialize Analytics only in browser environment
let analytics;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error("Analytics initialization failed:", error);
}

export { 
  app, 
  db, 
  auth,
  storage,
  analytics,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  friendsCollection,
  userProfilesCollection,
  friendRequestsCollection,
  collection
};

export type { User };
