// FIREBASE
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// REACT
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

// NAVIGATION
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// REDUX/STATE MANAGEMENT
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser } from "./redux/actions/index";

// THEME
import {colors} from './theme/colors'

// SCREEN IMPORTS
import Daily from "./screens/daily/Daily";
import Tasks from "./screens/tasks/Tasks";
import Calendar from "./screens/calendar/Calender";
import Account from "./screens/account/Account";

const Tab = createBottomTabNavigator();

const Main = ({ navigation }) => {
  //details
  const [isLoading, setIsLoading] = useState(false);
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: theme.colors.white,
        }}
      ></View>
    ); // Or any other loading indicator
  }
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

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
