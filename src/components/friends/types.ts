
export interface UserSearchResult {
  id: string;
  username: string;
  profilePicture: string | null;
  privacySettings?: {
    isPublicProfile: boolean;
    autoAcceptFollows?: boolean;
    autoAcceptFriends?: boolean;
  };
  status?: 'following' | 'requested' | null;
}

export interface UserSearchProps {
  onUserAdded?: () => void;
}

export interface FollowRequestsListProps {
  requests: FollowRequest[];
  onRequestAction: () => void;
}
