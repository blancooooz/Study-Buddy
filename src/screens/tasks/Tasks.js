import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app"; // Import Firebase for compatibility mode (older SDK version)
import "firebase/compat/auth"; // Import Firebase authentication for compatibility mode
import "firebase/compat/firestore"; // Import Firestore for compatibility mode
import { useTheme } from "@react-navigation/native";
import { add_task } from "../../utils/DataHandler";
import { colors } from "../../theme/colors";
const themecolors = colors
import Task from "../../components/Tasks/Task";
import * as Icons from "react-native-vector-icons";
import { useSelector } from 'react-redux'; // Redux hook to access the store's state

const Tasks = ({ }) => {
  const { colors } = useTheme();
  const [tasks, setTasks] = useState([]); // State variable to store tasks
  //pull tasks from database, and display them
  //need an if check for a global variable that stores the light/dark mode
  const get_all_tasks = () => {
    // Default value for current tasks
    let allTasks = [];
    try {
      // Getting all tasks from redux using useSelector hook
      allTasks = useSelector((state) => state.tasks?.tasks || []);

      // Storing tasks in state var
      setTasks(allTasks);
    }
    catch (error) {
      console.log('No tasks found');
    }

  };
  // Use useEffect to call get_all_tasks when the component mounts
  useEffect(() => {
    get_all_tasks();
  }, []); // Empty dependency array ensures it runs only once
  return (
    /* main screen view */
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ position: "absolute", top: 16, right: 16 }}>
        <Pressable>
          <View style={{ width: 32, height: 32, backgroundColor: themecolors.gray[400], borderRadius: 24, justifyContent: 'center', alignItems: 'center' }}>
            <Icons.Feather
              name="plus"
              size={24}
              color={"#FAFAFA"}
            ></Icons.Feather>
          </View>
        </Pressable>
      </View>
      <Task></Task>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#4CAF50", // Green background color
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
    padding: 20,
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  time: {
    color: "#aaa",
    marginBottom: 15,
  },
  question: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2E7D32",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Tasks;
