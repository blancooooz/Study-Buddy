// FIREBASE
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, getApp } from "@firebase/app";
import { GlobalVariables } from "./GlobalVariables";

// Firebase Import
import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} from "@env";
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};
// Export config for firebase
export { firebaseConfig };
// Initialize app and auth
let app, firebaseAuth;
if (!getApps().length) {
  try {
    app = firebase.initializeApp(firebaseConfig);
    firebaseAuth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    console.log("Error initializing app: " + error);
  }
} else {
  app = firebase.initializeApp(firebaseConfig);
  firebaseAuth = getAuth(app);
}
// Export app and auth
export { app, firebaseAuth };
// Database
const db = firebase.firestore();
