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
import TaskList from "./TaskList";

const Daily = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Try to get the user's name and other state data from the Redux store
  const username = useSelector((state) => state.userData.Username || "");
  const name = useSelector((state) => state.userData.name || "");
  const tasks = useSelector((state) => state.tasks || null);
  const events = useSelector((state) => state.events || null);

  const HourlyCalendar = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return (
      <ScrollView style={{ padding: 16 }}>
        {hours.map((hour) => (
          <View
            key={hour}
            style={{
              height: 50,
              justifyContent: "center",
              borderBottomWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <Text style={{ fontSize: 16, color: theme.colors.text }}>
              {hour === 0
                ? "12 AM"
                : hour < 12
                ? `${hour} AM`
                : hour === 12
                ? "12 PM"
                : `${hour - 12} PM`}
            </Text>
          </View>
        ))}
      </ScrollView>
    );
  };

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
        <Text style={[{ color: theme.colors.text }, styles.welcome_text]}>
          {username
            ? `Hi, ${username}!`
            : `Hi, ${name.charAt(0).toUpperCase() + name.slice(1)}!`}
        </Text>
        <Text
          style={{ fontSize: 20, marginBottom: 12, color: theme.colors.text }}
        >
          Motivational Quote
        </Text>
      </View>

      {/* Section for grid view*/}
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: theme.colors.secondary,
              margin: 4,
              borderRadius: 12,
            }}
            onPress={() => navigation.navigate("Pomodoro")}  // Wrap navigation call in an anonymous function
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginLeft: 12,
                marginTop: 8,
                color: theme.colors.text,
              }}
            >
              Start a Timer
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.tertiary,
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
                color: theme.colors.text,
              }}
            >
              Progress Bar
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.quaternary,
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
              color: theme.colors.text,
            }}
          >
            Daily Calendar
          </Text>
          {HourlyCalendar()}
        </View>
      </View>

      {/* Section for tasks and events */}
      <Text
        style={{
          paddingTop: 12,
          fontSize: 20,
          fontWeight: "600",
          paddingBottom: 8,
          color: theme.colors.text,
        }}
      >
        Tasks and Events for the day
      </Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 30, flex: 1 }}>
        {/* Placeholder for tasks */}
        <View
          style={{
            marginBottom: 12,
            padding: 15,
            backgroundColor: theme.colors.card,
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
          {tasks != null ? (
            <TaskList />
          ) : (
            <Text style={{ fontSize: 16, color: theme.colors.text }}>
              No tasks yet!
            </Text>
          )}
        </View>

        {/* Placeholder for events */}
        <View
          style={{
            marginBottom: 12,
            padding: 15,
            backgroundColor: theme.colors.card,
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
            Your Events for Today
          </Text>
          <Text style={{ fontSize: 16, color: theme.colors.text }}>
            No events scheduled!
          </Text>
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
    },
  });

export default Daily;
