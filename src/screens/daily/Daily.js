import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
const Daily = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  // Try to get the user's name from the Redux store
  let username = "";
  let name = "";
  let tasks = [];
  let events = [];
  try {
    name = useSelector((state) => state.userData.name);
  } catch (e) {
    console.log("No name available", e);
  }
  try {
    username = useSelector((state) => state.userData.Username);
  } catch (e) {
    console.log("No username available", e);
  }
  try {
    tasks = useSelector((state) => state.tasks);
  } catch (e) {
    console.log("No tasks:", e);
  }
  try {
    tasks = useSelector((state) => state.events);
  } catch (e) {
    console.log("No events:", e);
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: theme.colors.background,
        borderWidth: 0,
      }}
    >
      {/* Greeting message */}
      <View>
        <Text style={styles.welcome_text}>
          {username
            ? `Hi, ${username}!`
            : `Hi, ${name.charAt(0).toUpperCase() + name.slice(1)}!`}
        </Text>
        <Text style={{ fontSize: 20, marginBottom: 12 }}>subheader</Text>
      </View>

      {/* Section for meow*/}
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: theme.colors.secondary,
              margin: 4,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginLeft: 12,
                marginTop: 8,
              }}
            >
              Start a Timer
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.tertriary,
              margin: 4,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginLeft: 12,
                marginTop: 8,
              }}
            >
              Progress Bar
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.quatriary,
            margin: 4,
            borderRadius: 12,
            justifyContent: "flex-start",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginLeft: 12,
              marginTop: 8,
            }}
          >
            Daily Calender
          </Text>
        </View>
      </View>
      {/* Section for tasks and events */}
      <Text
        style={{
          paddingTop: 12,
          fontSize: 20,
          fontWeight: "600",
          paddingBottom: 8,
        }}
      >
        Tasks and Events for the day
      </Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 30, flex: 1 }}>
        {/* Placeholder for tasks */}
        <View
          style={{
            marginBottom: 12, // Space between sections
            padding: 15,
            backgroundColor: theme.colors.card, // White background for sections
            borderRadius: 18,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              color: theme.colors.text,
            }}
          >
            Your Tasks for Today
          </Text>
          <Text style={{ fontSize: 16 }}>No tasks yet!</Text>
          {/* You can map your tasks here */}
        </View>

        {/* Placeholder for events */}
        <View
          style={{
            marginBottom: 12, // Space between sections
            padding: 15,
            backgroundColor: theme.colors.card, // White background for sections
            borderRadius: 18,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              color: theme.colors.text, // Color for section title (customize as needed)
            }}
          >
            Your Events for Today
          </Text>
          <Text style={{ fontSize: 16 }}>No events scheduled!</Text>
          {/* You can map your events here */}
        </View>
      </ScrollView>
    </View>
  );
};
const createStyles = (theme) =>
  StyleSheet.create({
    welcome_text: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.colors.text,
    },
  });

export default Daily;
