import React, { useEffect, useState } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

import { onAuthStateChanged } from "firebase/auth";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { lightTheme, darkTheme } from "./src/theme/theme";
import { firebaseAuth } from "./src/utils/DataHandler";
import { NavigationContainer, ThemeProvider } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

import Main from "./src/Main";
import Login from "./src/screens/auth/Login";
import Register from "./src/screens/auth/Register";
import Landing from "./src/screens/auth/Landing";

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Track the theme

  const toggleTheme = async () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    // Store theme preference in AsyncStorage
    await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Function to handle Firebase user state changes
  function onUserStateChanged(user) {
    setUser(user);
    setInitializing(false);
  }

  // Load the theme preference from AsyncStorage when the app starts
  useEffect(() => {
    const loadThemePreference = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        setIsDarkTheme(savedTheme === "dark");
      }
    };

    // Listen for auth state change
    const subscriber = onAuthStateChanged(firebaseAuth, onUserStateChanged);

    // Load theme preference
    loadThemePreference();

    return subscriber; // Clean up Firebase listener on unmount
  }, []);

  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      />
    );
  }

  // No user logged in
  if (!user) {
    return (
      <ThemeProvider value={isDarkTheme ? darkTheme : lightTheme}>
        <NavigationContainer theme={isDarkTheme ? darkTheme : lightTheme}>
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
      </ThemeProvider>
    );
  }

  // User logged in
  if (user) {
    return (
      <Provider store={store}>
        <ThemeProvider value={isDarkTheme ? darkTheme : lightTheme}>
          <NavigationContainer theme={isDarkTheme ? darkTheme : lightTheme}>
            <Main isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
          </NavigationContainer>
        </ThemeProvider>
      </Provider>
    );
  }
}