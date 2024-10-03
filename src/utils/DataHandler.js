
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
import { getApps } from "@firebase/app";
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
// FIREBASE INITIALIZAITIONN

// Firebase Import
const firebaseConfig = {
  apiKey: "AIzaSyCq4BF6OciC4FVEZ_F10QmrmoLGkWeFXqE",
  authDomain: "study-app-bc788.firebaseapp.com",
  projectId: "study-app-bc788",
  storageBucket: "study-app-bc788.appspot.com",
  messagingSenderId: "214203925511",
  appId: "1:214203925511:web:5b3bfc05b4ede20e99d6a2",
  measurementId: "G-ZLQ79S8Y48"
};
// Initialize app and auth
let app, firebaseAuth;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    firebaseAuth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    console.log("Error initializing app: " + error);
  }
} else {
  app = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(app);
}
const db = initializeFirestore(app,{useFetchStreams :false,experimentalForceLongPolling:true},"(default)")

export {firebaseAuth,app,db}