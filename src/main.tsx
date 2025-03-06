
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';
import FirebaseInitializer from './components/firebase/FirebaseInitializer';

// Get the publishable key
const clerkPubKey = "pk_test_ZG9taW5hbnQtemVicmEtMjQuY2xlcmsuYWNjb3VudHMuZGV2JA";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <FirebaseInitializer>
        <App />
      </FirebaseInitializer>
    </ClerkProvider>
  </React.StrictMode>
);
