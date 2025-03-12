
import { PrivacySettings } from "./types";

export const getDefaultPrivacySettings = (): PrivacySettings => ({
  isPublicProfile: true,
  autoAcceptFollows: true,
  autoAcceptFriends: true,
  showEmail: false,
  showLocation: true,
  showBoatDetails: true
});

export const normalizePrivacySettings = (settings?: PrivacySettings): PrivacySettings => {
  if (!settings) {
    return getDefaultPrivacySettings();
  }

  // Sync autoAcceptFollows and autoAcceptFriends for backward compatibility
  const normalizedSettings = { ...settings };
  
  if (normalizedSettings.autoAcceptFollows !== undefined && normalizedSettings.autoAcceptFriends === undefined) {
    normalizedSettings.autoAcceptFriends = normalizedSettings.autoAcceptFollows;
  } else if (normalizedSettings.autoAcceptFriends !== undefined && normalizedSettings.autoAcceptFollows === undefined) {
    normalizedSettings.autoAcceptFollows = normalizedSettings.autoAcceptFriends;
  }
  
  return normalizedSettings;
};
