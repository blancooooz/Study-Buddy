
import React, { useEffect, useState } from "react"; // Import React hooks
import { View } from "react-native"; // Import React Native components

// FIREBASE
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged function from Firebase

// REDUX/STATE MANAGEMENT
import { Provider } from "react-redux"; // Import Redux provider to pass down the store to components
import store from './src/redux/store'
import { lightTheme, darkTheme } from "./src/theme/theme"; // Import your themes
import { app } from "./src/utils/DataHandler"; // Import app configuration from Firebase utility



// FIREBASE
import { firebaseAuth } from "./src/utils/DataHandler"; // Import Firebase authentication instance

// NAVIGATION
import { NavigationContainer, ThemeProvider } from "@react-navigation/native"; // Import React Navigation container
import { createStackNavigator } from "@react-navigation/stack"; // Import Stack Navigator for screen transitions
const Stack = createStackNavigator(); // Create a stack navigator

// THEME
import { colors } from "./src/theme/colors"; // Import theme colors

// SCREEN IMPORTS
import Main from "./src/Main"; // Import Main screen
import Login from "./src/screens/auth/Login"; // Import Login screen
import Register from "./src/screens/auth/Register"; // Import Register screen
import Landing from "./src/screens/auth/Landing"; // Import Landing screen

export default function App() {
  // Local state to track whether Firebase is initializing
  const [initializing, setInitializing] = useState(true);
  // Local state to track the logged-in user
  const [user, setUser] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Theme state

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Callback function to handle user state changes in Firebase authentication
  function onUserStateChanged(user) {
    setUser(user); // Update user state
    setInitializing(false); // Set initializing to false after state is set
  }

  useEffect(() => {
    // Listen for authentication state changes and clean up when the component is unmounted
    return (subscriber = onAuthStateChanged(firebaseAuth, onUserStateChanged)); // Subscribe to Firebase auth state changes
  }, []);

  // If Firebase is still initializing, display a loading screen
  if (initializing) {
    console.log("Firebase Initializing");
    return (
      <View
        style={{
          flex: 1, // Fill the entire screen
          justifyContent: "center", // Center the content vertically
          backgroundColor: colors.background, // Set the background color
        }}
      >
        {/* Empty loading view */}
      </View>
    );
  }

  // If no user is logged in, show the Landing, Register, and Login screens
  if (!user) {
    console.log("User not logged in");
    return (
      <NavigationContainer>
        {/* Stack navigator for the authentication flow */}
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={Landing}
            options={{ headerShown: false }} // Hide the header
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }} // Hide the header
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }} // Hide the header
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  //moew
  // If user is logged in, render the Main screen
  if (user) {
    return (
      <>
        {/* Provide the Redux store to the rest of the app */}
        <Provider store={store}>
          <ThemeProvider value={isDarkTheme ? darkTheme : lightTheme}>
            <NavigationContainer theme={isDarkTheme ? darkTheme : lightTheme}>
              <Main isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
            </NavigationContainer>
          </ThemeProvider>
        </Provider>
      </>
    );
  }
}
