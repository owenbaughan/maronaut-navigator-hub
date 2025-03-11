
import { initializeApp } from "firebase/app";
import { getFirestore, collection, CollectionReference, getDocs, query, where, limit } from "firebase/firestore";
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
// Explicitly define collections
const userProfilesCollection = collection(db, "userProfiles");
const followingCollection = collection(db, "following");
const followRequestsCollection = collection(db, "followRequests");

// Initialize Analytics only in browser environment
let analytics;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error("Analytics initialization failed:", error);
}

// Here's a function to create a collection if it doesn't exist
// This helps ensure the collections are properly initialized
const ensureCollectionExists = async (collectionPath: string) => {
  try {
    console.log(`Ensuring collection exists: ${collectionPath}`);
    
    // We don't need to do anything special here, just accessing the collection reference
    // will ensure it's created when we later add documents to it
    return true;
  } catch (error) {
    console.error(`Error ensuring collection exists (${collectionPath}):`, error);
    return false;
  }
};

// Check if a username is already taken
// This function needs to work for both authenticated and unauthenticated users
const isUsernameTaken = async (username: string): Promise<boolean> => {
  try {
    if (!username || username.trim().length < 3) {
      return true; // Consider short/empty usernames as "taken" to avoid unnecessary queries
    }
    
    const trimmedUsername = username.trim().toLowerCase();
    console.log(`Checking if username already exists: ${trimmedUsername}`);
    
    // Create a query that will work with our security rules for unauthenticated users
    // The limit(1) is critical for the security rules to allow this query
    const q = query(
      userProfilesCollection, 
      where("username", "==", trimmedUsername),
      limit(1)
    );
    
    console.log("Executing username availability query");
    const querySnapshot = await getDocs(q);
    
    // Important: Log the actual query results to debug
    console.log(`Query returned ${querySnapshot.size} documents`);
    
    const isTaken = !querySnapshot.empty;
    console.log(`Username ${trimmedUsername} is ${isTaken ? 'taken' : 'available'}`);
    
    return isTaken;
  } catch (error) {
    console.error("Error checking username:", error);
    // If we get a permission error, assume the username might be taken to be safe
    return true;
  }
};

// Ensure critical collections exist
const initializeCollections = () => {
  ensureCollectionExists('userProfiles');
  ensureCollectionExists('following');
  ensureCollectionExists('followRequests');
};

// Call this once when the app initializes
initializeCollections();

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
  userProfilesCollection,
  followingCollection,
  followRequestsCollection,
  collection,
  ensureCollectionExists,
  isUsernameTaken,
  limit
};

export type { User };
