
import { db, collection } from "../lib/firebase";
import { getDocs } from "firebase/firestore";
import { UserProfileData } from "./types";

export const searchUsers = async (searchQuery: string, currentUserId: string) => {
  if (!searchQuery.trim()) return [];
  
  try {
    console.log("Searching users with query:", searchQuery, "Current user:", currentUserId);
    const usersRef = collection(db, "userProfiles");
    
    console.log("Searching in collection:", usersRef.path);
    
    const lowercaseQuery = searchQuery.toLowerCase();
    
    const querySnapshot = await getDocs(usersRef);
    console.log("Total profiles found in database:", querySnapshot.size);
    
    if (querySnapshot.empty) {
      console.error("NO PROFILES FOUND IN DATABASE! Check your Firestore collection structure.");
      return [];
    }
    
    const users: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as UserProfileData;
      console.log("Examining user:", userData.username, "ID:", userData.userId);
      
      if (userData.userId === currentUserId) {
        console.log("Skipping current user:", userData.username);
        return;
      }
      
      if (!userData.username) {
        console.log("Skipping user with no username:", doc.id);
        return;
      }
      
      const username = userData.username.toLowerCase();
      console.log(`Comparing '${username}' with search query '${lowercaseQuery}'`);
      
      if (username.includes(lowercaseQuery)) {
        console.log("Match found! Adding to results:", userData.username);
        
        // Ensure privacySettings exist
        const privacySettings = userData.privacySettings || {
          isPublicProfile: true,
          autoAcceptFriends: false
        };
        
        users.push({
          id: userData.userId,
          username: userData.username,
          profilePicture: userData.profilePicture || null,
          privacySettings: privacySettings
        });
      } else {
        console.log("No match for", userData.username, "with query", lowercaseQuery);
      }
    });
    
    console.log("Final search results:", users);
    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};
