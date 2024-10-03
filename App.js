// REACT
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { onAuthStateChanged } from 'firebase/auth';
import { app } from './src/utils/DataHandler';

// REDUX/STATE MANAGEMENT
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import logger from "redux-logger";
import rootReducer from "./src/redux/reducers";
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// FIREBASE
import { firebaseAuth } from './src/utils/DataHandler';

// NAVIGATION
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator
} from "@react-navigation/stack";
const Stack = createStackNavigator();

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
  function onUserStateChanged(user) {
    setUser(user);
    setInitializing(false)
  }

  useEffect(()=>{
    return subscriber = onAuthStateChanged(firebaseAuth,onUserStateChanged); //checks for user state changes, using the onAuthStateChanged as the callback function
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
          <NavigationContainer >
            <Stack.Navigator initialRouteName="Landing" >
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
    );
  }

  if(user){
    return(
      <>
        <Provider store={store} >
            <NavigationContainer>
              <Stack.Navigator 
              initialRouteName={"Main"}>
              <Stack.Screen
                name="Main"
                component={Main}
                options={{headerShown:false}}
              />

              </Stack.Navigator>
            </NavigationContainer>
        </Provider>
      </>
    )
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
