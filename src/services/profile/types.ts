
import { Timestamp } from "firebase/firestore";

export interface PrivacySettings {
  isPublicProfile: boolean;
  autoAcceptFollows: boolean;
  autoAcceptFriends?: boolean;
  showEmail: boolean;
  showLocation: boolean;
  showBoatDetails: boolean;
}

export interface BoatDetails {
  name: string;
  type: string;
  length: string;
  homeMarina: string;
}

export interface UserProfile {
  userId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  location: string;
  bio: string;
  boatDetails: BoatDetails;
  sailingSince?: string;
  email?: string;
  profilePicture?: string;
  privacySettings?: PrivacySettings;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}
