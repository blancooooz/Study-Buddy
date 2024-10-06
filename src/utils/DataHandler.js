// FIREBASE
import firebase from "firebase/compat/app"; // Import Firebase for compatibility mode (older SDK version)
import "firebase/compat/auth"; // Import Firebase authentication for compatibility mode
import "firebase/compat/firestore"; // Import Firestore for compatibility mode
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth"; // Import Firebase authentication functions for React Native
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for persistence in React Native
import { getApps } from "@firebase/app"; // Import function to check if Firebase apps are already initialized
import { initializeApp } from "firebase/app"; // Import function to initialize Firebase app
import { initializeFirestore } from "firebase/firestore"; // Import function to initialize Firestore

// FIREBASE INITIALIZATION

// Firebase configuration object containing project-specific keys and IDs
const firebaseConfig = {
  // YOUR FIREBASE CONFIGURATION OBJECT HERE
};

// Initialize app and auth
let app, firebaseAuth;

// Check if any Firebase app is already initialized to prevent re-initialization
if (!getApps().length) {
  try {
    // Initialize Firebase app with the configuration
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase authentication with React Native persistence using AsyncStorage
    firebaseAuth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    // Log an error message if app initialization fails
    console.log("Error initializing app: " + error);
  }
} else {
  // If the app is already initialized, use the existing app
  app = initializeApp(firebaseConfig);

  // Get Firebase authentication instance from the existing app
  firebaseAuth = getAuth(app);
}

// Initialize Firestore with custom settings to optimize for React Native
// 'useFetchStreams' and 'experimentalForceLongPolling' help avoid network issues in React Native
const db = initializeFirestore(app, {
  useFetchStreams: false, // Disable fetch streams for compatibility with React Native
  experimentalForceLongPolling: true, // Force long polling for better connection handling in React Native
}, "(default)"); // Default Firestore namespace

// Export Firebase authentication, app instance, and Firestore instance for use in other parts of the app
export { firebaseAuth, app, db };