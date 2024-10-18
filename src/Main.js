import React, { useEffect, useState } from "react";
import { View, Button } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./redux/actions";
import { onSnapshot, doc } from "firebase/firestore";
import { db, firebaseAuth } from "./utils/DataHandler";
import firebase from "firebase/compat/app"; // Import Firebase app
import "firebase/compat/auth"; // Import Firebase authentication
import "firebase/compat/firestore"; // Import Firebase Firestore
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { signOut } from "firebase/auth";

// Screens
import Daily from "./screens/daily/Daily";
import Tasks from "./screens/tasks/Tasks";
import Calendar from "./screens/calendar/Calender";
import StudyPlan from "./screens/study/StudyPlan";
import Settings from "./screens/account/Settings"; // Drawer screen
import Preferences from "./screens/account/Preferences"; // Drawer screen
import Username from "./screens/account/Username";
import ChangePassword from "./screens/account/ChangePassword";

// Redux/State
import { colors } from "./theme/colors"; // Theme colors

// Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Example of passing userData in one of the stacks
const DailyStack = ({ userData }) => (
  <Stack.Navigator>
    <Stack.Screen name="Daily" options={{ headerShown: false }}>
      {() => <Daily userData={userData} />}
    </Stack.Screen>
    {/* Add other screens and pass userData similarly */}
  </Stack.Navigator>
);

const TasksStack = ({ userData }) => (
  <Stack.Navigator>
    <Stack.Screen name="Tasks" options={{ headerShown: false }}>
      {() => <Tasks userData={userData} />}
    </Stack.Screen>
    {/* Add other screens related to Tasks */}
  </Stack.Navigator>
);

const CalendarStack = ({ userData }) => (
  <Stack.Navigator>
    <Stack.Screen name="Calendar" options={{ headerShown: false }}>
      {() => <Calendar userData={userData} />}
    </Stack.Screen>
    {/* Add other screens related to Tasks */}
  </Stack.Navigator>
);

const StudyPlanStack = ({ userData }) => (
  <Stack.Navigator>
    <Stack.Screen name="Study Plan" options={{ headerShown: false }}>
      {() => <StudyPlan userData={userData} />}
    </Stack.Screen>
    {/* Add other screens related to Tasks */}
  </Stack.Navigator>
);
const SettingsStack = ({ userData }) => {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen name="SettingsScreen" options={{ headerShown: false }}>
        {({ navigation }) => (
          <Settings userData={userData} navigation={navigation} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Username" options={{ headerShown: false }}>
        {({ navigation }) => (
          <Username navigation={navigation} userData={userData} />
        )}
      </Stack.Screen>
      <Stack.Screen name="ChangePassword" options={{ headerShown: false }}>
        {({ navigation }) => (
          <ChangePassword navigation={navigation} userData={userData} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// Drawer Navigator wrapping the Bottom Tab Navigator
const DrawerNavigator = ({ isDarkTheme, toggleTheme, userData }) => (
  <Drawer.Navigator
    initialRouteName="Home"
    drawerContent={(props) => {
      return (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem label="Logout" onPress={() => signOut(firebaseAuth)} />
        </DrawerContentScrollView>
      );
    }}
  >
    <Drawer.Screen name="Home" options={{ title: "Home" }}>
      {() => <BottomTabNavigator userData={userData} />}
    </Drawer.Screen>
    <Drawer.Screen name="Settings" options={{ title: "Settings" }}>
      {() => <SettingsStack userData={userData} />}
    </Drawer.Screen>
    <Drawer.Screen name="Preferences">
      {() => (
        <Preferences
          toggleTheme={toggleTheme}
          isDarkTheme={isDarkTheme}
          userData={userData} // Passing user data here as well
        />
      )}
    </Drawer.Screen>
  </Drawer.Navigator>
);

// Bottom Tab Navigator with the 4 stack navigators
const BottomTabNavigator = ({ userData }) => (
  <Tab.Navigator>
    <Tab.Screen
      name="DailyStack"
      options={{ title: "Daily", headerShown: false }}
    >
      {() => <DailyStack userData={userData} />}
    </Tab.Screen>
    <Tab.Screen
      name="TasksStack"
      options={{ title: "Tasks", headerShown: false }}
    >
      {() => <TasksStack userData={userData} />}
    </Tab.Screen>
    <Tab.Screen
      name="CalendarStack"
      options={{ title: "Calendar", headerShown: false }}
    >
      {() => <CalendarStack userData={userData} />}
    </Tab.Screen>
    <Tab.Screen
      name="StudyPlanStack"
      options={{ title: "Study Plan", headerShown: false }}
    >
      {() => <StudyPlanStack userData={userData} />}
    </Tab.Screen>
  </Tab.Navigator>
);

// Main component that initializes everything
const Main = ({ isDarkTheme, toggleTheme }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  useEffect(() => {
    if (!userData) {
      dispatch(fetchUser());
    } 
  }, []);
  useEffect(() => {
    if (userData) {
      setIsLoading(false)
    } 
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: colors.white,
        }}
      >
        {/* Show loading indicator */}
      </View>
    );
  }

  return (
    <DrawerNavigator
      isDarkTheme={isDarkTheme}
      toggleTheme={toggleTheme}
      userData={userData} // Pass userData to DrawerNavigator
    />
  );
};
export default Main;