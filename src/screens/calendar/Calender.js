import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TextInput, Alert, Modal, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Agenda } from "react-native-calendars";
import { useSelector, useDispatch } from "react-redux";
import { add_task, edit_task, delete_task } from "../../redux/actions";

const Calendar = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks || []);
  const [selectedDate, setSelectedDate] = useState("");
  const [items, setItems] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");

  // Memoize the formatted tasks to prevent unnecessary state updates
  const formattedItems = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const taskDate = task.date || "";
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

  // Only update items state if there is a change detected
  useEffect(() => {
    if (JSON.stringify(formattedItems) !== JSON.stringify(items)) {
      setItems(formattedItems);
    }
  }, [formattedItems, items]);

  // Handle day press and update the selected date
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // Handle task addition
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

  // Handle task editing
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

  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    dispatch(delete_task(taskId, tasks));
    Alert.alert("Task Deleted", "The task has been deleted successfully.");
    setShowModal(false);
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
        style={styles.agenda}
        items={items}
        selected={new Date().toISOString().split("T")[0]}
        renderItem={renderItem}
        onDayPress={handleDayPress}
        theme={{
          selectedDayBackgroundColor: "#00adf5",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#00adf5",
          agendaDayTextColor: "#2d4150",
          agendaDayNumColor: "#00adf5",
          agendaKnobColor: "#00adf5",
        }}
        renderEmptyData={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks for this date.</Text>
          </View>
        )}
      />

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
            <View style={styles.buttonRow}>
              {editingTask ? (
                <>
                  <TouchableOpacity style={styles.saveButton} onPress={saveEditedTask}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTask(editingTask.id)}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.saveButton} onPress={handleAddTask}>
                  <Text style={styles.buttonText}>Add Task</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: "#f9f9f9",
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  saveButton: {
    backgroundColor: "#00adf5",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
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
