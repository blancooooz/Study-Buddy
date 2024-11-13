import React, { useState, useEffect, useMemo } from "react";
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
import { add_task, edit_task, delete_task } from "../../redux/actions";
import { useTheme } from "@react-navigation/native";

const Calendar = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks || []);
  const [selectedDate, setSelectedDate] = useState("");
  const [items, setItems] = useState([]);

  // Format tasks as an object with dates as keys and arrays of task items
  const formattedItems = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const taskDate = task.deadline || "";
      if (taskDate) {
        if (!acc[taskDate]) {
          acc[taskDate] = [];
        }
        acc[taskDate].push({
          id: task.id,
          title: task.title,
          completed: task.completed,
        });
      }
      return acc;
    }, {});
  }, [tasks]);

  useEffect(() => {
    setItems(formattedItems);
  }, [formattedItems]);

  // Handle day press and update the selected date
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };


  // Render each item in the agenda
  const renderItem = (item) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => handleEditTask(item)}
      onLongPress={() => handleDeleteTask(item.id)}
    >
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
      <Agenda
        style={[styles.agenda, { backgroundColor: theme.colors.background }]}
        items={items}
        selected={new Date().toISOString().split("T")[0]}
        renderItem={(task) => renderItem(task)}
        onDayPress={handleDayPress}
        theme={{
          selectedDayBackgroundColor: theme.colors.selectedDayBackgroundColor,
          selectedDayTextColor: theme.colors.selectedDayTextColor,
          todayTextColor: theme.colors.todayTextColor,
          agendaDayTextColor: theme.colors.agendaDayTextColor,
          agendaDayNumColor: theme.colors.agendaDayNumColor,
          agendaKnobColor: theme.colors.agendaKnobColor,
          backgroundColor: theme.colors.background,
        }}
        renderEmptyData={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks for this date.</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddTask")}
      >
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
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
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
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
    color: "#999",
    fontSize: 16,
  },
});

export default Calendar;