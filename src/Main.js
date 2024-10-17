import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser } from "./redux/actions/index";
import firebase from "firebase/compat/app"; // Import Firebase app
import "firebase/compat/auth"; // Import Firebase authentication
import "firebase/compat/firestore"; // Import Firebase Firestore

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

const DailyStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Daily"
      component={Daily}
      options={{ headerShown: false }}
    />
    {/* Add other screens related to Daily */}
  </Stack.Navigator>
);

const TasksStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Tasks"
      component={Tasks}
      options={{ headerShown: false }}
    />
    {/* Add other screens related to Tasks */}
  </Stack.Navigator>
);

const CalendarStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Calendar"
      component={Calendar}
      options={{ headerShown: false }}
    />
    {/* Add other screens related to Calendar */}
  </Stack.Navigator>
);

const StudyPlanStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Study Plan"
      component={StudyPlan}
      options={{ headerShown: false }}
    />
    {/* Add other screens related to Study Plan */}
  </Stack.Navigator>
);
const SettingsStack = () => {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen
        name="SettingsScreen"
        component={Settings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Username"
        component={Username}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      {/* Add other screens related to Settings */}
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator with the 4 stack navigators
const BottomTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="DailyStack"
      component={DailyStack}
      options={{ title: "Daily", headerShown: false }}
    />
    <Tab.Screen
      name="TasksStack"
      component={TasksStack}
      options={{ title: "Tasks", headerShown: false }}
    />
    <Tab.Screen
      name="CalendarStack"
      component={CalendarStack}
      options={{ title: "Calendar", headerShown: false }}
    />
    <Tab.Screen
      name="StudyPlanStack"
      component={StudyPlanStack}
      options={{ title: "Study Plan", headerShown: false }}
    />
  </Tab.Navigator>
);

// Drawer Navigator wrapping the Bottom Tab Navigator
const DrawerNavigator = ({ isDarkTheme, toggleTheme }) => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen
      name="Home"
      component={BottomTabNavigator}
      options={{ title: "Home" }}
    />
    <Drawer.Screen
      name="Settings"
      component={SettingsStack}
      options={{ title: "Settings"}}
    />
    <Drawer.Screen name="Preferences">
      {() => (
        <Preferences toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
      )}
    </Drawer.Screen>
  </Drawer.Navigator>
);

// Main component that initializes everything
const Main = ({ navigation, isDarkTheme, toggleTheme }) => {
  useEffect(() => {}, []);

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

  // Drawer Navigator is the main navigator
  return (
    <DrawerNavigator isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
  );
};

// Map Redux state to component props
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

// Map dispatch actions to props
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchUser }, dispatch);

// Connect component to Redux store and export
export default connect(mapStateToProps, mapDispatchToProps)(Main);
