
// Export all follow-related functionality from the individual modules
export * from './status';
export * from './core';
export * from './getFollowers';

// Re-export the getFollowRequests function from the requestService
export { getFollowRequests } from '../requestService';
