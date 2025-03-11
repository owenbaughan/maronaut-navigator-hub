
import { Timestamp } from "firebase/firestore";

export interface FollowingData {
  id: string;
  userId: string;
  followingId: string;
  timestamp: Timestamp;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string | null;
}

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

export interface FollowRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: Timestamp;
  senderUsername?: string;
  receiverUsername?: string;
  senderFirstName?: string;
  senderLastName?: string;
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
