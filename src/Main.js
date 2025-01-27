// Importing necessary libraries and components
import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Dimensions,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; // For bottom tab navigation
import { createStackNavigator } from "@react-navigation/stack"; // For stack navigation within tabs
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer"; // For drawer navigation
import { connect, useDispatch, useSelector } from "react-redux"; // Redux hooks to dispatch actions and select state
import {
  fetchUserData,
  get_all_studyPlans,
  logOut,
  deleteSession,
  deleteStudyPlan,
} from "./redux/actions"; // Redux action to fetch user data
import { get_all_tasks } from "./redux/actions";
import { useNavigation, useTheme } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Icons from "react-native-vector-icons";
// Importing screens for each part of the app
import Daily from "./screens/daily/Daily";
import Tasks from "./screens/tasks/Tasks";
import Calendar from "./screens/calendar/Calender";
import StudyPlans from "./screens/study/StudyPlans";
import Settings from "./screens/account/Settings";
import Preferences from "./screens/account/Preferences";
import Username from "./screens/account/Username";
import ChangePassword from "./screens/account/ChangePassword";
import AddTask from "./screens/tasks/AddTask";
import EditTask from "./screens/tasks/EditTask";
import AddSession from "./screens/study/sessions/AddSession";
import EditStudyPlan from "./screens/study/EditStudyPlan";
import AddStudyPlan from "./screens/study/AddStudyPlan";
import EditSession from "./screens/study/sessions/EditSession";
import Session from "./screens/study/sessions/Session";
import StudyPlan from "./screens/study/StudyPlan";
import PomodoroScreen from "./screens/timer/Pomodoro";
import Gamify from "./screens/gamify/Gamify";
import { colors } from "./theme/colors";
import { current } from "@reduxjs/toolkit";
// Navigators for tabs, stacks, and drawers
const Tab = createBottomTabNavigator(); // Bottom Tab Navigator
const Stack = createStackNavigator(); // Stack Navigator
const Drawer = createDrawerNavigator(); // Drawer Navigator
const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

/**
 * Stack Navigator for the "Daily" screen.
 */
const DailyStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Daily" options={{ headerShown: false }}>
      {({ navigation }) => (
        <>
          <HomeHeader screen={"Daily"} />
          <Daily navigation={navigation} />
        </>
      )}
    </Stack.Screen>
    <Stack.Screen
      name="AddTask"
      options={{ header: () => <CustomHeader title={"AddTask"} /> }}
    >
      {({ navigation }) => <AddTask navigation={navigation} />}
    </Stack.Screen>
    <Stack.Screen
      name="Pomodoro"
      options={{ header: () => <CustomHeader title={"Pomodoro"} /> }}
    >
      {({ navigation }) => <PomodoroScreen navigation={navigation} />}
    </Stack.Screen>
    <Stack.Screen
      name="Gamify"
      options={{ header: () => <CustomHeader title={"Gamify"} /> }}
    >
      {({ navigation }) => <Gamify navigation={navigation} />}
    </Stack.Screen>
  </Stack.Navigator>
);

/**
 * Stack Navigator for the "Tasks" screen and its related screens.
 */
const TasksStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Tasks" options={{ headerShown: false }}>
      {({ navigation }) => (
        <>
          <HomeHeader screen={"Tasks"} />
          <Tasks navigation={navigation} />
        </>
      )}
    </Stack.Screen>

    <Stack.Screen
      name="AddTask"
      options={{ header: () => <CustomHeader title={"AddTask"} /> }}
    >
      {({ navigation }) => <AddTask navigation={navigation} />}
    </Stack.Screen>
    <Stack.Screen
      name="EditTask"
      options={{ header: () => <CustomHeader title={"Edit task"} /> }}
    >
      {({ navigation }) => <EditTask navigation={navigation} />}
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
      {({ navigation }) => (
        <>
          <HomeHeader screen={"Calendar"} />
          <Calendar navigation={navigation} />
        </>
      )}
    </Stack.Screen>
    <Stack.Screen
      name="AddTask"
      options={{ header: () => <CustomHeader title={"AddTask"} /> }}
    >
      {({ navigation }) => <AddTask navigation={navigation} />}
    </Stack.Screen>
  </Stack.Navigator>
);

/**
 * Stack Navigator for the "Study Plan" screen.
 */
const StudyPlanStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Study" options={{ headerShown: false }}>
      {({ navigation }) => (
        <>
          <HomeHeader screen={"StudyPlan"} />
          <StudyPlans navigation={navigation} />
        </>
      )}
    </Stack.Screen>
    <Stack.Screen
      name="Study Plan"
      options={({ route }) => ({
        header: () => (
          <CustomHeader title="Study Plan" routeParam={route.params?.id} />
        ),
      })}
    >
      {({ navigation, route }) => (
        <StudyPlan navigation={navigation} route={route} />
      )}
    </Stack.Screen>
    <Stack.Screen
      name="Session"
      options={({ route }) => ({
        header: () => (
          <CustomHeader title="Session" routeParam={route.params?.sessionId} />
        ),
      })}
    >
      {({ navigation, route }) => (
        <Session navigation={navigation} route={route} />
      )}
    </Stack.Screen>
    <Stack.Screen
      name="Add a Session"
      options={{ header: () => <CustomHeader title={"Add a Session"} /> }}
    >
      {({ navigation, route }) => (
        <AddSession navigation={navigation} route={route} />
      )}
    </Stack.Screen>
    <Stack.Screen
      name="Edit a Session"
      options={{ header: () => <CustomHeader title={"Edit a Session"} /> }}
    >
      {({ navigation, route }) => (
        <EditSession navigation={navigation} route={route} />
      )}
    </Stack.Screen>
    <Stack.Screen
      name="Add a Plan"
      options={{ header: () => <CustomHeader title={"Add a Plan"} /> }}
    >
      {({ navigation, route }) => (
        <AddStudyPlan navigation={navigation} route={route} />
      )}
    </Stack.Screen>
    <Stack.Screen
      name="Edit a Plan"
      options={{ header: () => <CustomHeader title={"Edit a Plan"} /> }}
    >
      {({ navigation, route }) => (
        <EditStudyPlan navigation={navigation} route={route} />
      )}
    </Stack.Screen>
    <Stack.Screen
      name="Pomodoro"
      options={{ header: () => <CustomHeader title={"Pomodoro"} /> }}
    >
      {({ navigation }) => <PomodoroScreen navigation={navigation} />}
    </Stack.Screen>
  </Stack.Navigator>
);

/**
 * Stack Navigator for the "Settings" and related screens.
 */
const SettingsStack = () => {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen
        name="User Settings"
        options={{ header: () => <HomeHeader title={"User Settings"} /> }}
      >
        {({ navigation }) => <Settings navigation={navigation} />}
      </Stack.Screen>
      <Stack.Screen
        name="Username"
        options={{ header: () => <CustomHeader title={"Username"} /> }}
      >
        {({ navigation }) => <Username navigation={navigation} />}
      </Stack.Screen>
      <Stack.Screen
        name="ChangePassword"
        options={{ header: () => <CustomHeader title={"Change Password"} /> }}
      >
        {({ navigation }) => <ChangePassword navigation={navigation} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

/**
 * Drawer Navigator that wraps around the Bottom Tab Navigator.
 * Contains the "Settings" and "Preferences" options as drawer items.
 */
const DrawerNavigator = ({
  isDarkTheme,
  toggleTheme,
  currentTabScreen,
  setCurrentTabScreen,
  dispatch,
}) => (
  <Drawer.Navigator
    initialRouteName="Home"
    screenOptions={{}}
    drawerContent={(props) => {
      return (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          {/* Logout button */}
          <DrawerItem label="Logout" onPress={() => dispatch(logOut())} />
        </DrawerContentScrollView>
      );
    }}
  >
    <Drawer.Screen name="Home" options={{ title: "Home", headerShown: false }}>
      {() => (
        <>
          <BottomTabNavigator setCurrentTabScreen={setCurrentTabScreen} />
        </>
      )}
    </Drawer.Screen>
    <Drawer.Screen
      name="Settings"
      options={{ title: "Settings", headerShown: false }}
    >
      {() => <SettingsStack />}
    </Drawer.Screen>
    <Drawer.Screen
      name="Preferences"
      options={{ header: () => <HomeHeader title={"Preferences"} /> }}
    >
      {() => (
        <Preferences toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
      )}
    </Drawer.Screen>
  </Drawer.Navigator>
);

const HomeHeader = ({ screen }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const renderExtraElements = (screenName) => {
    switch (screenName) {
      case "Daily":
        return ( <>
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 20,
              fontWeight: "500",
            }}
          >
            Daily
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("AddTask")}>
            <View
              style={{
                width: 32,
                height: 32,
                backgroundColor: colors.gray[400],
                borderRadius: 24,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              <Icons.Feather
                name="plus"
                size={24}
                color={"#FAFAFA"}
              ></Icons.Feather>
            </View>
          </TouchableOpacity>
        </>
        );
      case "Tasks":
        return ( <>
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 20,
              fontWeight: "500",
            }}
          >
            Tasks
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("AddTask")}>
            <View
              style={{
                width: 32,
                height: 32,
                backgroundColor: colors.gray[400],
                borderRadius: 24,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              <Icons.Feather
                name="plus"
                size={24}
                color={"#FAFAFA"}
              ></Icons.Feather>
            </View>
          </TouchableOpacity>
        </>
        );
      case "Calendar":
        return (
          <>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 20,
                fontWeight: "500",
              }}
            >
              Calendar
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("AddTask")}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: colors.gray[400],
                  borderRadius: 24,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <Icons.Feather
                  name="plus"
                  size={24}
                  color={"#FAFAFA"}
                ></Icons.Feather>
              </View>
            </TouchableOpacity>
          </>
        );
      case "StudyPlan":
        return (
          <>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 20,
                fontWeight: "500",
              }}
            >
              Study Plan
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Add a Plan")}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: colors.gray[400],
                  borderRadius: 24,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <Icons.Feather
                  name="plus"
                  size={24}
                  color={"#FAFAFA"}
                ></Icons.Feather>
              </View>
            </TouchableOpacity>
          </>
        );
    }
  };
  return (
    <View
      style={{
        marginTop: 64,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.transparent,
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        {/* safe area view pushes a margin of 2 already so 14+2=16 */}
        <View style={{ marginLeft: 14 }}>
          <Icons.Ionicons name="menu" size={36} color={colors.gray[500]} />
        </View>
      </TouchableOpacity>
      {/* <Text style={styles.headerTitle}>{title}</Text> */}
      {renderExtraElements(screen)}
    </View>
  );
};
const CustomHeader = ({ title, routeParam }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [optionsVisible, setOptionsVisible] = useState(false);
  const toggleOptions = () => {
    setOptionsVisible(!optionsVisible);
  };

  const handleEdit = () => {
    setOptionsVisible(false);
    if (title === "Study Plan") {
      navigation.navigate("Edit a Plan", { planId: routeParam });
    } else if (title === "Session") {
      navigation.navigate("Edit a Session", { sessionId: routeParam });
    }
  };

  const handleDelete = () => {
    setOptionsVisible(false);
    // Call the delete method for the study plan or session based on title
    if (title === "Study Plan") {
      dispatch(deleteStudyPlan(routeParam));
      navigation.goBack();
    } else if (title === "Session") {
      dispatch(deleteSession(routeParam));
      navigation.goBack();
    }
  };
  const renderExtraElements = (title) => {
    switch (title) {
      case "Study Plan":
        return (
          <>
            {optionsVisible && (
              <Modal
                transparent={true}
                animationType="fade"
                visible={optionsVisible}
                onRequestClose={() => setOptionsVisible(false)}
              >
                <TouchableOpacity
                  style={{backgroundColor:theme.colors.transparent, flex:1}}
                  onPress={() => setOptionsVisible(false)}
                >
                  <View
                    style={{
                      backgroundColor: theme.colors.card,
                      width: 150,
                      borderRadius: 8,
                      paddingVertical: 8,
                      paddingHorizontal: 10,
                      alignItems: "center",
                      position: "absolute",
                      top: height / 9,
                      right: width / 24,
                    }}
                  >
                    <TouchableOpacity
                      onPress={handleEdit}
                      style={styles.optionButton}
                    >
                      <Text style={{ color: theme.colors.text }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleDelete}
                      style={styles.optionButton}
                    >
                      <Text style={{ color: "red" }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>
            )}
            <TouchableOpacity
              onPress={() => toggleOptions()}
              style={{
                width: 32,
                height: 32,
                marginRight: 16,
                position: "absolute",
                right: 0,
              }}
            >
              <Icons.Ionicons
                name="options"
                size={36}
                color={
                  optionsVisible
                    ? theme.colors.secondary
                    : colors.gray[500]
                }
              />
            </TouchableOpacity>
          </>
        );
      case "Session":
        return (
          <>
            {optionsVisible && (
              <Modal
                transparent={true}
                animationType="fade"
                visible={optionsVisible}
                onRequestClose={() => setOptionsVisible(false)}
              >
                <TouchableOpacity
                  style={{backgroundColor:theme.colors.transparent, flex:1}}
                  onPress={() => setOptionsVisible(false)}
                >
                  <View
                    style={{
                      backgroundColor: theme.colors.card,
                      width: 150,
                      borderRadius: 8,
                      paddingVertical: 8,
                      paddingHorizontal: 10,
                      alignItems: "center",
                      position: "absolute",
                      top: height / 9,
                      right: width / 24,
                    }}
                  >
                    <TouchableOpacity
                      onPress={handleEdit}
                      style={styles.optionButton}
                    >
                      <Text style={{ color: theme.colors.text }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleDelete}
                      style={styles.optionButton}
                    >
                      <Text style={{ color: "red" }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>
            )}
            <TouchableOpacity
              onPress={() => toggleOptions()}
              style={{
                width: 32,
                height: 32,
                marginRight: 16,
                position: "absolute",
                right: 0,
              }}
            >
              <Icons.Ionicons
                name="options"
                size={36}
                color={
                  optionsVisible
                    ? theme.colors.secondary
                    : colors.gray[500]
                }
              />
            </TouchableOpacity>
          </>
        );
    }
  };

  return (
    <View
      style={{
        marginTop: 64,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.transparent,
        marginBottom: 16,
        padding: 10,
      }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icons.Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle,{color:theme.colors.text}]}>{title}</Text>
      {renderExtraElements(title)}
    </View>
  );
};
/**
 * Bottom Tab Navigator that contains the main navigation tabs for the app.
 * It uses the Stack Navigators for each section (Daily, Tasks, Calendar, Study Plan).
 */
const BottomTabNavigator = ({ setCurrentTabScreen }) => (
  <Tab.Navigator
    // Configure screen options for each tab
    screenOptions={({ route }) => ({
      // Define the icon for each tab based on the route name
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        // Set icon name based on the route name and focus state, this is an Icon that will be displayed over the tab screen
        if (route.name === "DailyStack") {
          iconName = focused ? "calendar" : "calendar-o";
        } else if (route.name === "TasksStack") {
          iconName = focused ? "tasks" : "tasks";
        } else if (route.name === "CalendarStack") {
          iconName = focused ? "calendar-check-o" : "calendar";
        } else if (route.name === "StudyPlanStack") {
          iconName = focused ? "book" : "book";
        }

        // Return the icon component
        return <Icon name={iconName} size={size} color={color} />;
      },
      // Define the label for each tab based on the route name
      tabBarLabel: ({ focused }) => {
        const label = route.name.replace("Stack", "");
        return (
          <Text
            style={{
              fontSize: 12,
              fontWeight: focused ? "bold" : "normal",
              color: focused ? "#000" : "#888",
            }}
          >
            {label}
          </Text>
        );
      },
      // Set active and inactive tint colors for the tab bar
      tabBarActiveTintColor: "#000",
      tabBarInactiveTintColor: "#888",
      // Style the tab bar
      tabBarStyle: {
        backgroundColor: "rgba(255,255,255,0.9)",
        borderTopWidth: 0,
        elevation: 5,
      },
    })}
    screenListeners={{
      tabPress: (e) => {
        setCurrentTabScreen(e.target.split("-")[0]);
      },
    }}
  >
    {/* Define each tab screen and its corresponding stack navigator */}
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

/**
 * The main component that initializes the app and handles user state.
 * It fetches user data and displays a loading indicator if data is still being fetched.
 * It also passes the `isDarkTheme` and `toggleTheme` props to the DrawerNavigator.
 */
const Main = ({ isDarkTheme, toggleTheme }) => {
  const dispatch = useDispatch(); // Redux's dispatch function
  const userData = useSelector((state) => state.userData); // Get user data from Redux store
  const [currentTabScreen, setCurrentTabScreen] = useState("DailyStack");
  // Fetch user data when the component mounts if not already present
  useEffect(() => {
    if (!userData) {
      dispatch(fetchUserData()); // Fetch user data from Firestore and store in Redux
      dispatch(get_all_tasks()); // Fetch tasks from Firestore and store in Redux
      dispatch(get_all_studyPlans());
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
  return (
    <DrawerNavigator
      isDarkTheme={isDarkTheme}
      toggleTheme={toggleTheme}
      currentTabScreen={currentTabScreen}
      setCurrentTabScreen={setCurrentTabScreen}
      dispatch={dispatch}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f4511e", // Customize your header background color
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // Customize your header title color
  },
  headerContainer: {
    marginTop: 64,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 10,
  },
  optionsIcon: {
    width: 32,
    height: 32,
    marginRight: 16,
    position: "absolute",
    right: 0,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  optionsContainer: {
    width: 150,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    // Dispatch the `updateUsername` action when called
    logOut: () => dispatch(logOut()),
  };
};

export default connect(mapDispatchToProps)(Main);