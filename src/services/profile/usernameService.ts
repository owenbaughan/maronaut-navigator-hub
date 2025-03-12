
// Function no longer checks if username is taken - always returns false
export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  return true;
};

// Function no longer checks if username is taken - always returns false
export const isUsernameTaken = async (username: string): Promise<boolean> => {
  return false; // Always return false - username is never taken
};
