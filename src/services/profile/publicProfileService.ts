
import { UserProfile } from "./types";
import { getUserProfile } from "./profileCoreService";

export const getPublicUserProfile = async (userId: string): Promise<Partial<UserProfile> | null> => {
  try {
    const fullProfile = await getUserProfile(userId);
    
    if (!fullProfile) return null;
    
    if (fullProfile.privacySettings && !fullProfile.privacySettings.isPublicProfile) {
      return {
        userId: fullProfile.userId,
        username: fullProfile.username,
      };
    }
    
    const publicProfile: Partial<UserProfile> = {
      userId: fullProfile.userId,
      username: fullProfile.username,
      firstName: fullProfile.firstName,
      lastName: fullProfile.lastName,
      bio: fullProfile.bio,
      sailingSince: fullProfile.sailingSince,
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
