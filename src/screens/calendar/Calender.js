import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
} from "react-native";
import { Agenda } from "react-native-calendars";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@react-navigation/native";

const Calendar = ({ navigation }) => {
  const theme = useTheme();
  const tasks = useSelector((state) => state.tasks || []);
  const [selectedDate, setSelectedDate] = useState("");
  const isThemeDark = theme.dark;
  const [themeId, setThemeId] = useState(isThemeDark ? "dark" : "light");
  const [dailyTasks, setDailyTasks] = useState([]);
  const [dailyObject, setDailyObject] = useState({});
  const formatTime = (milliseconds) => {
    const date = new Date(milliseconds);
    date.setHours(date.getHours() - 5); // Convert to EST
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };
  useEffect(() => {
    setThemeId(isThemeDark ? "dark" : "light");
  }, [isThemeDark]);
  useEffect(() => {
    const daily = tasks
      .filter((task) => {
        const taskDate = new Date(task.deadline).toDateString();
        const currentDate = new Date().toDateString();
        return taskDate === currentDate;
      })
      .sort((a, b) => a.time_due - b.time_due); // Compare time_due directly
  
    console.log("daily tasks", daily);
    setDailyTasks(daily);
  }, [tasks]);

  // Format tasks as an object with dates as keys and arrays of task items
  const formattedItems = useMemo(() => {
    const tasksCopy = [...tasks];
    const sortedTasks = tasksCopy.sort((a, b) => a.time_due - b.time_due); // Sort tasks globally
    return sortedTasks.reduce((acc, task) => {
      const taskDate = new Date(task.deadline).toISOString().split("T")[0];
      if (taskDate) {
        if (!acc[taskDate]) {
          acc[taskDate] = [];
        }
        acc[taskDate].push({
          name: task.title,
          height: task.priority ? 80 : 50,
          ...task,
        });
      }
      return acc;
    }, {});
  }, [tasks]);
  useEffect(() => {
    setDailyObject(formattedItems);
  }, [formattedItems]);

  // Handle day press and update the selected date
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const renderItem = (item) => (
    <TouchableOpacity
      style={[styles.taskItem, { backgroundColor: theme.colors.card }]}
      onPress={() => navigation.navigate("EditTask", { task: item })}
    >
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle,{color:theme.colors.text}]}>{item.name}</Text>
        <Text style={[styles.taskTime,{color:theme.colors.placeholderText}]}>{formatTime(item.time_due)}</Text>
        {item.description ? (
          <Text style={styles.taskDescription}>{item.description}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const calendarKey = isThemeDark ? "dark" : "light";
  console.log(dailyObject);
  return (
    <SafeAreaView style={styles.container}>
      <View key={calendarKey} style={{ flex: 1 }}>
        <Agenda
          style={[styles.agenda, { backgroundColor: theme.colors.transparent }]}
          selected={new Date().toISOString().split("T")[0]}
          renderItem={(task) => renderItem(task)}
          items={dailyObject}
          onDayPress={handleDayPress}
          theme={{
            selectedDayBackgroundColor: theme.colors.selectedDayBackgroundColor,
            selectedDayTextColor: theme.colors.selectedDayTextColor,
            todayTextColor: theme.colors.todayTextColor,
            agendaDayTextColor: theme.colors.agendaDayTextColor,
            agendaDayNumColor: theme.colors.agendaDayNumColor,
            agendaKnobColor: theme.colors.agendaKnobColor,
            calendarBackground: theme.colors.background,
            reservationsBackgroundColor: theme.colors.background,
            monthTextColor: theme.colors.text,
            dayTextColor: theme.colors.text,
          }}
          renderEmptyData={() => (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                No tasks for this date.
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  agenda: {
    marginTop: 10,
  },
  taskItem: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  taskContent: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 14,
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    backgroundColor: "#00adf5",
    padding: 16,
    borderRadius: 50,
    position: "absolute",
    bottom: 30,
    right: 30,
    alignItems: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
  },
});

export default Calendar;
