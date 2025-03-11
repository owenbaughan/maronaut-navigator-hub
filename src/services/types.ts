import { Timestamp } from 'firebase/firestore';

// User profile related types
export interface UserProfile {
  id?: string;
  userId: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  birthdate?: string;
  phoneNumber?: string;
  profilePicture?: string;
  bannerImage?: string;
  joinedDate: Timestamp | Date;
  followersCount?: number;
  followingCount?: number;
  isPrivate?: boolean;
  isVerified?: boolean;
  lastActive?: Timestamp | Date;
  experience?: ExperienceLevel;
  completedTrips?: number;
  savedTrips?: string[];
  preferredCommunication?: string[];
  socialLinks?: SocialLinks;
  privacySettings?: PrivacySettings;
  notificationSettings?: NotificationSettings;
}

export interface ExperienceLevel {
  sailing?: "beginner" | "intermediate" | "advanced" | "expert";
  powerboat?: "beginner" | "intermediate" | "advanced" | "expert";
  certifications?: string[];
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
}

export interface PrivacySettings {
  isPublicProfile?: boolean;
  showLocation?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
  showAge?: boolean;
  autoAcceptFollows?: boolean;
  autoAcceptFriends?: boolean;
}

export interface NotificationSettings {
  email?: boolean;
  push?: boolean;
  friendRequests?: boolean;
  messages?: boolean;
  tripUpdates?: boolean;
  marketplaceAlerts?: boolean;
}

// Follow and following related types
export interface FollowRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: Timestamp;
  senderUsername?: string;
  receiverUsername?: string;
  senderFirstName?: string | null;
  senderLastName?: string | null;
}

export interface FollowingData {
  id: string;
  userId: string;
  followingId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string | null;
  timestamp: Timestamp;
}

// Re-export types that were previously in the file
export interface UserProfileData {
  userId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string | null;
  privacySettings?: {
    isPublicProfile: boolean;
    autoAcceptFollows?: boolean;
    autoAcceptFriends?: boolean;
    showEmail?: boolean;
    showLocation?: boolean;
    showBoatDetails?: boolean;
  };
}

export interface FriendData {
  id: string;
  userId: string;
  friendId: string;
  timestamp: Timestamp;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string | null;
}
