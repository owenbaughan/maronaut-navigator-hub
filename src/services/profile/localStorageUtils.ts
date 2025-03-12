
import { UserProfile } from "./types";

export const saveToLocalStorage = (profile: UserProfile): void => {
  localStorage.setItem(`profile_${profile.userId}`, JSON.stringify(profile));
};

export const getFromLocalStorage = (userId: string): UserProfile | null => {
  const data = localStorage.getItem(`profile_${userId}`);
  return data ? JSON.parse(data) : null;
};
