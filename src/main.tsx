
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

// Get the publishable key from the environment
const clerkPubKey = "pk_test_ZG9taW5hbnQtemVicmEtMjQuY2xlcmsuYWNjb3VudHMuZGV2JA";

// Only render the app if we have the key
if (!clerkPubKey) {
  console.error("Missing Clerk publishable key");
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
