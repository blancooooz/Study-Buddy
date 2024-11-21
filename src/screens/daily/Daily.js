// src/screens/daily/Daily.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextComponent,
  LayoutAnimation,
} from "react-native";
import { useSelector } from "react-redux";
import { Circle } from "react-native-progress";
import { useTheme } from "@react-navigation/native";
import TaskList from "./TaskList";
import LottieView from "lottie-react-native";

const Daily = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [progress, setProgress] = useState(0);
  const [uncompleted_tasks, setUncompletedTasks] = useState([]); // State variable to store uncompleted tasks
  const [completed_tasks, setCompletedTasks] = useState([]); // State variable to store completed tasks
  const [uncompleted_events, setUncompletedEvents] = useState([]); // State variable to store uncompleted tasks
  const [completed_events, setCompletedEvents] = useState([]); // State variable to store completed tasks
  const [dailyTasks, setDailyTasks] = useState([]);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const lottieRef = useRef(null);
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
    console.log("tasks in daily", tasks);
  } catch (e) {
    console.log("No tasks:", e);
  }
  try {
    events = useSelector((state) => state.events);
  } catch (e) {
    console.log("No events:", e);
  }
  const toggleCalendarView = () => {
    console.log("hit toggleCalendarView");
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsCalendarExpanded((prevState) => !prevState);
    if (lottieRef.current) {
      if (isCalendarExpanded) {
        lottieRef.current.play();
      } else {
        lottieRef.current.play(30, 0);
      }
    }
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

    console.log("daily tasks", daily);
    setDailyTasks(daily);
  }, [tasks]);

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

  const generateHourlyTasks = () => {
    const tasksByHour = dailyTasks.reduce((acc, task) => {
      if (!task.time_due || typeof task.time_due !== "number") {
        console.error(`Invalid time_due: ${task.time_due}`);
        return acc; // Skip tasks with invalid time_due
      }

      const taskDate = new Date(task.time_due);
      const taskHour = taskDate.getHours(); // Get hour in 24-hour format

      if (!acc[taskHour]) acc[taskHour] = [];
      acc[taskHour].push(task);
      return acc;
    }, {});

    // Ensure all hours are present
    const allHours = Array.from({ length: 24 }, (_, i) => i);
    return allHours.map((hour) => ({
      hour,
      tasks: tasksByHour[hour] || [],
    }));
  };
  const HourlyCalendar = ({ tasks, expanded }) => {
    const hourlyTasks = generateHourlyTasks(tasks);

    // Filter only hours with tasks if not expanded
    const filteredTasks = expanded
      ? hourlyTasks
      : hourlyTasks.filter(({ tasks }) => tasks.length > 0);

    return (
      <ScrollView>
        {filteredTasks.map(({ hour, tasks }, index) => (
          <View
            key={hour}
            style={{
              backgroundColor:
                index % 2 === 0
                  ? theme.colors.secondary
                  : theme.colors.transparent,
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 4,
              }}
            >
              {hour === 0
                ? `12 AM`
                : hour < 12
                ? `${hour} AM`
                : hour === 12
                ? `12 PM`
                : `${hour - 12} PM`}
            </Text>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <View key={task.id}>
                  <Text
                    style={{
                      color: theme.colors.text,
                      fontSize: 16,
                      marginLeft: 12,
                    }}
                  >
                    - {task.title}
                  </Text>
                </View>
              ))
            ) : (
              <></>
            )}
          </View>
        ))}
      </ScrollView>
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
          size={90}
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
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("Pomodoro")} // Wrap navigation call in an anonymous function
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: theme.colors.text,
              }}
            >
              Start a Timer
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 2,
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
            backgroundColor: theme.colors.quaternary,
            margin: 4,
            borderRadius: 12,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
            onPress={toggleCalendarView}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginLeft: 12,
                color: theme.colors.text,
              }}
            >
              Daily Calendar
            </Text>
            <View
              style={{
                backgroundColor: theme.colors.placeholderText,
                marginLeft: 10,
                borderRadius: 18,
              }}
            >
              <LottieView
                ref={lottieRef}
                source={require("../../assets/dropdown_arrow.json")}
                style={{ width: 20, height: 20 }}
                loop={false}
                speed={2}
              />
            </View>
          </TouchableOpacity>

          {/* Render HourlyCalendar */}
          <HourlyCalendar tasks={dailyTasks} expanded={isCalendarExpanded} />
        </View>
      </View>
      <View
        style={{
          flex: 1.3,
          backgroundColor: theme.colors.card,
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
