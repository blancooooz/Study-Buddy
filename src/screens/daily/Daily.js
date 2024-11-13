// src/screens/daily/Daily.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { Circle } from "react-native-progress";
import { useTheme } from "@react-navigation/native";
import TaskList from "./TaskList";
import DailyAgenda from "./DailyAgenda"; // Import the new component

const Daily = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [progress, setProgress] = useState(0);
  const [uncompleted_tasks, setUncompletedTasks] = useState([]); // State variable to store uncompleted tasks
  const [completed_tasks, setCompletedTasks] = useState([]); // State variable to store completed tasks
  const [uncompleted_events, setUncompletedEvents] = useState([]); // State variable to store uncompleted tasks
  const [completed_events, setCompletedEvents] = useState([]); // State variable to store completed tasks
  const [dailyTasks, setDailyTasks] = useState([]);
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
    console.log('tasks in daily', tasks)
  } catch (e) {
    console.log("No tasks:", e);
  }
  try {
    events = useSelector((state) => state.events);
  } catch (e) {
    console.log("No events:", e);
  }

  // Format date in "Oct 30" format
  const format_date = (date_string) => {
    const date = new Date(date_string);
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Get today's date formatted
  const currentFormattedDate = format_date(new Date());

  // Helper function to convert "HH:MM AM/PM" format to minutes since midnight
  const convertToMinutes = (timeString) => {
    const [time, period] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Adjust hours based on AM/PM
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  // Filter and sort tasks by hour for today
  useEffect(() => {
    const daily = tasks
      .filter((task) => {
        const taskDate = new Date(task.deadline).toDateString();
        const currentDate = new Date().toDateString();
        return taskDate === currentDate;
      })
      .sort((a, b) => new Date(a.time_due) - new Date(b.time_due));
    
      console.log('daily tasks', daily)
    setDailyTasks(daily)
  },[tasks]);

  useEffect(() => {
    const uncompletedTasks = dailyTasks.filter((task) => !task.completed);
    const completedTasks = dailyTasks.filter((task) => task.completed);
    setUncompletedTasks(uncompletedTasks);
    setCompletedTasks(completedTasks);
  }, [tasks]);

  useEffect(() => {
    const uncompletedEvents = events.filter((task) => !task.completed);
    const completedEvents = events.filter((task) => task.completed);
    setUncompletedEvents(uncompletedEvents);
    setCompletedEvents(completedEvents);
  }, [events]);

  // Group tasks by hour
  const HourlyCalendar = () => {
    return (
      <View/>
    );
  };

  // Calculate progress
  useEffect(() => {
    try {
      const totalTasks = dailyTasks.length + events.length;
      const completedTasks = completed_tasks.length + completed_events.length;
      const newProgress = totalTasks > 0 ? completedTasks / totalTasks : 1;
      console.log(totalTasks, completedTasks, newProgress);

      if (typeof newProgress === "number") {
        setProgress(newProgress);
        console.log("Progress set to:", newProgress);
      } else {
        console.log("Progress is not a number:", typeof newProgress);
      }
    } catch (e) {
      console.error("Error calculating progress:", e);
    }
  }, [tasks]);

  const ProgressCircle = () => {
    return (
      <View style={{ alignItems: "center", marginRight: 12, marginTop: 12 }}>
        <Circle
          size={70}
          progress={progress}
          showsText={true}
          formatText={() => `${Math.round(progress * 100)}%`}
          color={theme.colors.primary}
          unfilledColor={theme.colors.secondary}
          borderWidth={0}
          textStyle={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: theme.colors.text,
          }}
        />
      </View>
    );
  };

  return (
    <ScrollView>
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
                  color: theme.colors.text,
                }}
              >
                Progress Bar
              </Text>
              {ProgressCircle()}
            </View>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.quatriary,
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
              Daily Calendar
            </Text>
            <DailyAgenda navigation={navigation} /> 
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.quatriary,
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
                  color: theme.colors.text, // Color for section title (customize as needed)
                }}
              >
                Your Tasks for Today
              </Text>
              {dailyTasks.length != 0 ? (
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
              <Text style={{ fontSize: 16, color: theme.colors.text }}>
                No events scheduled!
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    welcome_text: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 20,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    greetingText: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      paddingBottom: 8,
    },
    hourBlock: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: "#ddd",
      marginLeft: 12,
    },
    hourText: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default Daily;