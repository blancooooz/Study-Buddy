import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, Alert, Modal, StyleSheet } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { useSelector, useDispatch } from "react-redux";
import { add_task, edit_task, delete_task } from "../../redux/actions";

const Calendar = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks || []);
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");

  // Update filtered tasks based on the selected date
  useEffect(() => {
    if (selectedDate) {
      const tasksForDate = tasks.filter((task) => task.date === selectedDate);
      setFilteredTasks(tasksForDate);
    }
  }, [selectedDate, tasks]);

  // Mark tasks on the calendar
  const getMarkedDates = () => {
    const markedDates = {};
    tasks.forEach((task) => {
      if (task.date) {
        markedDates[task.date] = { marked: true, dotColor: "blue" };
      }
    });
    return markedDates;
  };

  // Handle adding a new task
  const handleAddTask = () => {
    if (taskTitle && selectedDate) {
      const newTask = {
        id: Date.now().toString(),
        title: taskTitle,
        date: selectedDate,
        completed: false,
      };
      dispatch(add_task(newTask));
      setTaskTitle("");
      setShowModal(false);
    } else {
      Alert.alert("Error", "Please enter a task title and select a date.");
    }
  };

  // Handle editing a task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setShowModal(true);
  };

  const saveEditedTask = () => {
    if (editingTask) {
      const updatedTask = { ...editingTask, title: taskTitle };
      dispatch(edit_task(editingTask.id, updatedTask, tasks));
      setEditingTask(null);
      setTaskTitle("");
      setShowModal(false);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = (taskId) => {
    dispatch(delete_task(taskId, tasks));
    Alert.alert("Task Deleted", "The task has been deleted successfully.");
  };

  return (
    <View style={styles.container}>
      <RNCalendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...getMarkedDates(),
          [selectedDate]: {
            selected: true,
            selectedColor: "blue",
          },
        }}
        theme={{
          selectedDayBackgroundColor: "#00adf5",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#00adf5",
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
        }}
      />

      <View style={styles.taskList}>
        <Text style={styles.headerText}>Tasks for {selectedDate || "No Date Selected"}</Text>
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text>{item.title}</Text>
              <View style={styles.taskActions}>
                <Button title="Edit" onPress={() => handleEditTask(item)} />
                <Button title="Delete" onPress={() => handleDeleteTask(item.id)} color="red" />
              </View>
            </View>
          )}
          ListEmptyComponent={<Text>No tasks for this date.</Text>}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      {/* Modal for adding/editing task */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Task Title"
              value={taskTitle}
              onChangeText={(text) => setTaskTitle(text)}
              style={styles.input}
            />
            {editingTask ? (
              <Button title="Save Changes" onPress={saveEditedTask} />
            ) : (
              <Button title="Add Task" onPress={handleAddTask} />
            )}
            <Button title="Cancel" onPress={() => setShowModal(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  taskList: {
    flex: 1,
    marginTop: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  taskActions: {
    flexDirection: "row",
    gap: 8,
  },
  addButton: {
    backgroundColor: "#00adf5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
});

export default Calendar;
