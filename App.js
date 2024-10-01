// REACT
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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
// FIREBASE INITIALIZAITIONN
// FIREBASE

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


// REDUX/STATE MANAGEMENT
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import logger from "redux-logger";
import rootReducer from "./src/redux/reducers";
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// NAVIGATION
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator
} from "@react-navigation/stack";

// THEME
import { colors } from "./src/theme/colors";

// SCREEN IMPORTS
import Main from './src/Main';
import Login from './src/screens/auth/Login';
import Register from './src/screens/auth/Register';
import Landing from './src/screens/auth/Landing';

export default function App() {

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);


  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing && !user) {
      setInitializing(false);
    }
  }

  useEffect(()=>{
    return subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged); //checks for user state changes, using the onAuthStateChanged as the callback function
  },[])

  //checks for firebase initializing
  if (initializing) {
    console.log("Firebase Initializing")
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >

      </View>
    );
  }

  
  //if user is not logged in, show the landing screen, then the register/login flows
  if (!user) {
    console.log("User not logged in")
    return (
      <GlobalProvider>
        <ToastProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Landing">
              <Stack.Screen
                name="Landing"
                component={Landing}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ToastProvider>
      </GlobalProvider>
    );
  }

  if(user){
    return(
      <>
        <Provider store={store} >
          <GlobalProvider>
            <NavigationContainer>
              <Stack.Navigator 
              initialRouteName={"Main"}>
              <Stack.Screen
                name="Main"
                component={Main}
                options
              />

              </Stack.Navigator>
            </NavigationContainer>
          </GlobalProvider>
        </Provider>
      </>
    )
  }


  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
