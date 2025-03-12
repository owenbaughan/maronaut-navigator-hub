
import { doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export const uploadProfilePicture = async (userId: string, file: File): Promise<string> => {
  try {
    console.log("Uploading profile picture for user:", userId);
    
    // Create a unique filename with timestamp to avoid cache issues
    const timestamp = new Date().getTime();
    const storageRef = ref(storage, `profilePictures/${userId}_${timestamp}`);
    
    console.log("Uploading to Firebase Storage...");
    const snapshot = await uploadBytes(storageRef, file);
    console.log("Upload successful:", snapshot);
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Generated download URL:", downloadURL);
    
    // Update the user profile in Firestore
    console.log("Updating user profile in Firestore...");
    const userRef = doc(db, "userProfiles", userId);
    
    try {
      // Try to update existing document
      await updateDoc(userRef, {
        profilePicture: downloadURL,
        updatedAt: serverTimestamp()
      });
      console.log("Updated existing user profile with picture URL in Firestore");
    } catch (error: any) {
      // If document doesn't exist, create it
      if (error.code === 'not-found') {
        await setDoc(userRef, {
          userId,
          profilePicture: downloadURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log("Created new user profile with picture URL in Firestore");
      } else {
        throw error;
      }
    }
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};
