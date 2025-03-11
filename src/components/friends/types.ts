
// For search results
export interface UserSearchResult {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string | null;
  status?: 'following' | 'requested' | null;
  privacySettings?: {
    isPublicProfile?: boolean;
    autoAcceptFollows?: boolean;
    autoAcceptFriends?: boolean;
  };
}

// For follow requests
export interface FollowRequestItem {
  id: string;
  senderId: string;
  senderUsername: string;
  senderFirstName?: string;
  senderLastName?: string;
  senderProfilePicture?: string | null;
  timestamp: any;
}

// For friend requests
export interface FriendRequestItem {
  id: string;
  senderId: string;
  senderUsername: string;
  senderFirstName?: string;
  senderLastName?: string;
  senderProfilePicture?: string | null;
  timestamp: any;
}

// Props for the UserSearch component
export interface UserSearchProps {
  onUserAdded?: () => void;
}
