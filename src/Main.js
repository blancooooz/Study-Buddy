// FIREBASE
import firebase from "firebase/compat/app"; // Import Firebase app
import "firebase/compat/auth"; // Import Firebase authentication
import "firebase/compat/firestore"; // Import Firebase Firestore

// REACT
import React, { useEffect, useRef, useState } from "react"; // Import React hooks
import { View } from "react-native"; // Import View component from React Native

// NAVIGATION
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; // Import bottom tab navigator from React Navigation

// REDUX/STATE MANAGEMENT
import { connect } from "react-redux"; // Import Redux connect for connecting component to the store
import { bindActionCreators } from "redux"; // Import bindActionCreators to dispatch actions
import { fetchUser } from "./redux/actions/index"; // Import fetchUser action

// THEME
import { colors } from './theme/colors'; // Import theme colors

// SCREEN IMPORTS
import Daily from "./screens/daily/Daily"; // Import Daily screen component
import Tasks from "./screens/tasks/Tasks"; // Import Tasks screen component
import Calendar from "./screens/calendar/Calender"; // Import Calendar screen component
import Account from "./screens/account/Account"; // Import Account screen component

// Create a bottom tab navigator
const Tab = createBottomTabNavigator();

const Main = ({ navigation }) => {
  // Local state to handle loading state
  const [isLoading, setIsLoading] = useState(false);

  // Conditionally render a loading screen if the app is in loading state
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1, // Make the view take up the entire screen
          justifyContent: "center", // Center the content vertically
          backgroundColor: theme.colors.white, // Set background color to white
        }}
      ></View>
    ); // Return an empty view or replace with any other loading indicator
  }

  // Main tab navigation
  return (
    <>
      <Tab.Navigator>
        <Tab.Screen name="Daily" component={Daily} /> 
        <Tab.Screen name="Tasks" component={Tasks} />
        <Tab.Screen name="Calendar" component={Calendar} />
        <Tab.Screen name="Account" component={Account}/>
      </Tab.Navigator>
    </>
  );
};

// Map Redux state to component props
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser, // Current user data from Redux state
});

// Map dispatch actions to props
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchUser }, dispatch); // Bind fetchUser action to dispatch

// Connect component to Redux store and export
export default connect(mapStateToProps, mapDispatchToProps)(Main);