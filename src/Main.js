// Importing necessary libraries and components
import React, { useEffect, useState } from "react";
import { View, Button } from "react-native"; 
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; // For bottom tab navigation
import { createStackNavigator } from "@react-navigation/stack"; // For stack navigation within tabs
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer"; // For drawer navigation
import { useDispatch, useSelector } from "react-redux"; // Redux hooks to dispatch actions and select state
import { fetchUserData } from "./redux/actions"; // Redux action to fetch user data
import { firebaseAuth } from "./utils/DataHandler"; // Firebase authentication utilities
import { signOut } from "firebase/auth"; // Firebase signOut method

// Importing screens for each part of the app
import Daily from "./screens/daily/Daily";
import Tasks from "./screens/tasks/Tasks";
import Calendar from "./screens/calendar/Calender";
import StudyPlan from "./screens/study/StudyPlan";
import Settings from "./screens/account/Settings";
import Preferences from "./screens/account/Preferences";
import Username from "./screens/account/Username";
import ChangePassword from "./screens/account/ChangePassword";


// Navigators for tabs, stacks, and drawers
const Tab = createBottomTabNavigator(); // Bottom Tab Navigator
const Stack = createStackNavigator(); // Stack Navigator
const Drawer = createDrawerNavigator(); // Drawer Navigator

/**
 * Stack Navigator for the "Daily" screen.
 */
const DailyStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Daily" options={{ headerShown: false }}>
      {() => <Daily />} 
    </Stack.Screen>
  </Stack.Navigator>
);

/**
 * Stack Navigator for the "Tasks" screen and its related screens.
 */
const TasksStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Tasks" options={{ headerShown: false }}>
      {() => <Tasks />} 
    </Stack.Screen>
    {/* Add other screens related to Tasks here */}
  </Stack.Navigator>
);

/**
 * Stack Navigator for the "Calendar" screen.
 */
const CalendarStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Calendar" options={{ headerShown: false }}>
      {() => <Calendar />} 
    </Stack.Screen>
  </Stack.Navigator>
);

/**
 * Stack Navigator for the "Study Plan" screen.
 */
const StudyPlanStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Study Plan" options={{ headerShown: false }}>
      {() => <StudyPlan />} 
    </Stack.Screen>
  </Stack.Navigator>
);

/**
 * Stack Navigator for the "Settings" and related screens.
 */
const SettingsStack = () => {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen name="SettingsScreen" options={{ headerShown: false }}>
        {({ navigation }) => <Settings navigation={navigation} />} 
      </Stack.Screen>
      <Stack.Screen name="Username" options={{ headerShown: false }}>
        {({ navigation }) => <Username navigation={navigation} />} 
      </Stack.Screen>
      <Stack.Screen name="ChangePassword" options={{ headerShown: false }}>
        {({ navigation }) => <ChangePassword navigation={navigation} />} 
      </Stack.Screen>
    </Stack.Navigator>
  );
};

/**
 * Drawer Navigator that wraps around the Bottom Tab Navigator.
 * Contains the "Settings" and "Preferences" options as drawer items.
 */
const DrawerNavigator = ({ isDarkTheme, toggleTheme }) => (
  <Drawer.Navigator
    initialRouteName="Home"
    drawerContent={(props) => {
      return (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          {/* Logout button */}
          <DrawerItem label="Logout" onPress={() => signOut(firebaseAuth)} /> 
        </DrawerContentScrollView>
      );
    }}
  >
    <Drawer.Screen name="Home" options={{ title: "Home" }}>
      {() => <BottomTabNavigator />} 
    </Drawer.Screen>
    <Drawer.Screen name="Settings" options={{ title: "Settings" }}>
      {() => <SettingsStack />} 
    </Drawer.Screen>
    <Drawer.Screen name="Preferences">
      {() => <Preferences toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />} 
    </Drawer.Screen>
  </Drawer.Navigator>
);

/**
 * Bottom Tab Navigator that contains the main navigation tabs for the app.
 * It uses the Stack Navigators for each section (Daily, Tasks, Calendar, Study Plan).
 */
const BottomTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="DailyStack" options={{ title: "Daily", headerShown: false }}>
      {() => <DailyStack />} 
    </Tab.Screen>
    <Tab.Screen name="TasksStack" options={{ title: "Tasks", headerShown: false }}>
      {() => <TasksStack />} 
    </Tab.Screen>
    <Tab.Screen name="CalendarStack" options={{ title: "Calendar", headerShown: false }}>
      {() => <CalendarStack />} 
    </Tab.Screen>
    <Tab.Screen name="StudyPlanStack" options={{ title: "Study Plan", headerShown: false }}>
      {() => <StudyPlanStack />} 
    </Tab.Screen>
  </Tab.Navigator>
);

/**
 * The main component that initializes the app and handles user state.
 * It fetches user data and displays a loading indicator if data is still being fetched.
 * It also passes the `isDarkTheme` and `toggleTheme` props to the DrawerNavigator.
 */
const Main = ({ isDarkTheme, toggleTheme }) => {
  const dispatch = useDispatch(); // Redux's dispatch function
  const userData = useSelector((state) => state.userData); // Get user data from Redux store

  // Fetch user data when the component mounts if not already present
  useEffect(() => {
    if (!userData) {
      dispatch(fetchUserData()); // Fetch user data from Firestore and store in Redux
    }
  }, []);

  // State to track loading status
  const [isLoading, setIsLoading] = useState(true); 

  // Set loading state to false once userData is available
  useEffect(() => {
    if (userData) {
      setIsLoading(false);
    }
  }, [userData]);

  // Show a loading screen while data is being fetched
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        {/* Add a loading indicator component here */}
      </View>
    );
  }

  // Render the DrawerNavigator once data is loaded
  return <DrawerNavigator isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />;
};

export default Main;