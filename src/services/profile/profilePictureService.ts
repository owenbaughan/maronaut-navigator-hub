
import { doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export const uploadProfilePicture = async (userId: string, file: File): Promise<string> => {
  try {
    console.log("Uploading profile picture for user:", userId);
    
    const timestamp = new Date().getTime();
    const storageRef = ref(storage, `profilePictures/${userId}_${timestamp}`);
    
    console.log("Uploading to Firebase Storage...");
    const snapshot = await uploadBytes(storageRef, file);
    console.log("Upload successful:", snapshot);
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Download URL:", downloadURL);
    
    const userRef = doc(db, "userProfiles", userId);
    await updateDoc(userRef, {
      profilePicture: downloadURL,
      updatedAt: serverTimestamp()
    }).catch(async (error) => {
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
    });
    
    console.log("Updated user profile with new picture URL in Firestore");
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};
