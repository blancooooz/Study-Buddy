import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";

const Calendar = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState("");
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([
    { date: "2024-10-21", description: "Team meeting at 10 AM" },
    { date: "2024-10-21", description: "Lunch with Sarah at 1 PM" },
    { date: "2024-10-22", description: "Project deadline" },
  ]);

  const addTask = () => {
    if (newTask && selectedDate) {
      setTasks([...tasks, { date: selectedDate, description: newTask }]);
      setNewTask("");
    }
  };

  const removeTask = (taskToRemove) => {
    setTasks(tasks.filter((task) => task !== taskToRemove));
  };

  const filteredTasks = tasks.filter((task) => task.date === selectedDate);

  return (
    <View style={styles.container}>
      {/* Header */}

      {/* Calendar component */}
      <RNCalendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: "blue",
          },
        }}
        theme={{
          selectedDayBackgroundColor: theme.colors.selectedDayBackgroundColor,
          selectedDayTextColor: theme.colors.selectedDayTextColor,
          todayTextColor: theme.colors.todayTextColor,
          dayTextColor: theme.colors.dayTextColor,
          textDisabledColor: theme.colors.textDisabledColor,
          calendarBackground: theme.colors.calendarBackground,
          monthTextColor:theme.colors.dayTextColor
          
        }}
        enableSwipeMonths={true}
      />

      {/* Selected Date */}
      <View style={styles.selectedDateContainer}>
        {selectedDate ? (
          <Text
            style={styles.selectedDateText}
          >{`Selected Date: ${selectedDate}`}</Text>
        ) : null}
      </View>

      {/* Input for adding new task */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new task"
          value={newTask}
          onChangeText={(text) => setNewTask(text)}
          placeholderTextColor={theme.colors.placeholderText}
        />
        <Button title="Add Task" onPress={addTask} disabled={!selectedDate} />
      </View>

      {/* Agenda section */}
      <ImageBackground
        source={{ uri: "https://www.example.com/background-image.jpg" }}
        style={styles.agendaBackground}
        resizeMode="cover"
      >
        <View style={styles.agendaContainer}>
          <Text style={styles.agendaHeader}>
            Agenda for {selectedDate || "No Date Selected"}:
          </Text>
          {filteredTasks.length > 0 ? (
            <FlatList
              data={filteredTasks}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.taskItem}>
                  <Text
                    style={styles.agendaItem}
                  >{`- ${item.description}`}</Text>
                  <TouchableOpacity onPress={() => removeTask(item)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noEventsText}>No tasks for this date.</Text>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  selectedDateContainer: {
    marginVertical: 16,
    alignItems: "center",
  },
  selectedDateText: {
    fontSize: 18,
    color: "blue",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginBottom: 8,
  },
  agendaBackground: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
  },
  agendaContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 16,
    borderRadius: 10,
  },
  agendaHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  agendaItem: {
    fontSize: 16,
  },
  removeText: {
    color: "red",
    fontSize: 16,
  },
  noEventsText: {
    fontSize: 16,
    fontStyle: "italic",
  },
});

export default Calendar;
