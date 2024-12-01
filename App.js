import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useFonts } from "expo-font"; // For fonts
import { onAuthStateChanged } from "firebase/auth";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { lightTheme, darkTheme } from "./src/theme/theme";
import { firebaseAuth } from "./src/utils/DataHandler";
import { NavigationContainer, ThemeProvider } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";

const Stack = createStackNavigator();

import Main from "./src/Main";
import Login from "./src/screens/auth/Login";
import Register from "./src/screens/auth/Register";
import Landing from "./src/screens/auth/Landing";

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Track the theme
  const [fontsLoaded, fontError] = useFonts({
    SFProDisplayMedium: require("./assets/fonts/SFPro/SF-Pro-Display-Medium.otf"),
    SFProTextMedium: require("./assets/fonts/SFPro/SF-Pro-Text-Medium.otf"),
    SFProTextLight: require("./assets/fonts/SFPro/SF-Pro-Display-Light.otf"),
    SFProTextReg: require("./assets/fonts/SFPro/SF-Pro-Text-Regular.otf"),
    SFProRoundedMedium: require("./assets/fonts/SFPro/SF-Pro-Rounded-Medium.otf"),
    SFProRoundedSemibold: require("./assets/fonts/SFPro/SF-Pro-Rounded-Semibold.otf"),
    SFProRoundedLight: require("./assets/fonts/SFPro/SF-Pro-Rounded-Light.otf"),
    SFProRoundedThin: require("./assets/fonts/SFPro/SF-Pro-Rounded-Thin.otf"),
    SFProRoundedRegular: require("./assets/fonts/SFPro/SF-Pro-Rounded-Regular.otf"),
    Pacifico: require("./assets/fonts/Pacifico-Regular.ttf"),
    Allura: require("./assets/fonts/Allura-Regular.ttf"),
  });

  const toggleTheme = async () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  function onUserStateChanged(user) {
    setUser(user);
    setInitializing(false);
  }

  // ADD: Setup Notifications
  const setupNotifications = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        Alert.alert("Permission Denied", "Notifications will not work without permission.");
        return;
      }
    }

    const token = await Notifications.getExpoPushTokenAsync();
    console.log("Expo Push Token:", token);

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received in foreground:", notification);
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification interaction:", response);
    });
  };

  useEffect(() => {
    const loadThemePreference = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        setIsDarkTheme(savedTheme === "dark");
      }
    };

    const subscriber = onAuthStateChanged(firebaseAuth, onUserStateChanged);

    setupNotifications(); // ADD: Initialize Notifications
    loadThemePreference();

    return subscriber;
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