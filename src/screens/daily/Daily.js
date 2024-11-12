import { useTheme } from "@react-navigation/native";
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
import TaskList from "./TaskList";
const Daily = () => {
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
    .filter((task) => task.deadline === currentFormattedDate)
    .sort(
      (a, b) => convertToMinutes(a.time_due) - convertToMinutes(b.time_due)
    );
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
  const tasksByHour = dailyTasks.reduce((acc, task) => {
    const taskHour = task.time_due.split(":")[0]; // Get hour from time_due
    if (!acc[taskHour]) acc[taskHour] = [];
    acc[taskHour].push(task);
    return acc;
  }, {});
  const HourlyCalendar = () => {
    return (
      <ScrollView>
        {Object.keys(tasksByHour).length > 0 ? (
          Object.keys(tasksByHour).map((hour) => (
            <View key={hour} style={styles.hourBlock}>
              <Text key={hour} style={[styles.hourText, { color: theme.colors.text }]}>
                {hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
              </Text>
              {tasksByHour[hour].map((task) => (
                <Text key={task.id} style={{ color: theme.colors.text }}>
                  - {task.title}
                </Text>
              ))} 
            </View>
          ))
        ) : (
          <Text style={{ color: theme.colors.text, textAlign: "center" }}>
            No tasks for today!
          </Text>
        )}
      </ScrollView>
    );
  };

  //i need a component that will render a progress circle, based off of how many tasks are completed in the step property of task_list
  const ProgressCircle = () => {
    const [progress, setProgress] = useState(0); // Use state to track progress

    useEffect(() => {
      try {
        // Calculate progress
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
            Daily Calender
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
