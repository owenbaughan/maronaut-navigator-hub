
import { UserProfile } from "./types";
import { getUserProfile } from "./profileCoreService";

export const getPublicUserProfile = async (userId: string): Promise<Partial<UserProfile> | null> => {
  try {
    if (!userId) {
      console.error("Cannot fetch public profile: userId is required");
      return null;
    }
    
    console.log("Fetching public profile for user:", userId);
    const fullProfile = await getUserProfile(userId);
    
    if (!fullProfile) {
      console.error("No profile found for user:", userId);
      return null;
    }
    
    if (fullProfile.privacySettings && !fullProfile.privacySettings.isPublicProfile) {
      console.log("User has a private profile, returning limited data");
      return {
        userId: fullProfile.userId,
        username: fullProfile.username,
      };
    }
    
    console.log("Returning public profile data for user:", userId);
    const publicProfile: Partial<UserProfile> = {
      userId: fullProfile.userId,
      username: fullProfile.username,
      firstName: fullProfile.firstName,
      lastName: fullProfile.lastName,
      bio: fullProfile.bio,
      sailingSince: fullProfile.sailingSince,
      profilePicture: fullProfile.profilePicture,
    };
    
    if (!fullProfile.privacySettings || fullProfile.privacySettings.showEmail) {
      publicProfile.email = fullProfile.email;
    }
    
    if (!fullProfile.privacySettings || fullProfile.privacySettings.showLocation) {
      publicProfile.location = fullProfile.location;
    }
    
    if (!fullProfile.privacySettings || fullProfile.privacySettings.showBoatDetails) {
      publicProfile.boatDetails = fullProfile.boatDetails;
    }
    
    return publicProfile;
  } catch (error) {
    console.error("Error getting public user profile:", error);
    return null;
  }
};
