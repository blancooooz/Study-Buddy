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
import { connect } from "react-redux";
const themecolors = colors;
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

  // Sample task list, just for testing!!
  const task_list = [
    {
      title: "Turn in HW4",
      deadline: "June 5",
      description: "Turn in HW4 on time for Programming Languages",
      tags: ["school", "urgent"],
      id: 1,
      recurring: false,
      priority: 1,
      completed: false,
      time_due: "11:59 PM",
      multi_step: false,
      steps: [],
    },
    {
      title: "Grocery Shopping",
      deadline: "June 6",
      description: "Buy groceries for the week",
      tags: ["personal", "shopping"],
      id: 2,
      recurring: true,
      priority: 2,
      completed: false,
      time_due: "5:00 PM",
      multi_step: false,
      steps: [],
    },
    {
      title: "Team Meeting",
      deadline: "June 7",
      description: "Attend the weekly team meeting",
      tags: ["work", "meeting"],
      id: 3,
      recurring: true,
      priority: 3,
      completed: false,
      time_due: "10:00 AM",
      multi_step: false,
      steps: [],
    },
    {
      title: "Doctor Appointment",
      deadline: "June 8",
      description: "Visit the doctor for a regular check-up",
      tags: ["health", "appointment"],
      id: 4,
      recurring: false,
      priority: 1,
      completed: false,
      time_due: "2:00 PM",
      multi_step: false,
      steps: [],
    },
    {
      title: "Finish Project Report",
      deadline: "June 9",
      description: "Complete the final report for the project",
      tags: ["work", "urgent"],
      id: 5,
      recurring: false,
      priority: 1,
      completed: false,
      time_due: "11:59 PM",
      multi_step: true,
      steps: [{"Draft report":true}, {"Review with team":false}, {"Finalize report":false}],
    },
  ];
  return (
    /* main screen view */
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ position: "absolute", top: 16, right: 16 }}>
        <Pressable>
          <View
            style={{
              width: 32,
              height: 32,
              backgroundColor: themecolors.gray[400],
              borderRadius: 24,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icons.Feather
              name="plus"
              size={24}
              color={"#FAFAFA"}
            ></Icons.Feather>
          </View>
        </Pressable>
      </View> 
      <View style={{marginTop:32}}>
      {task_list.map((task) => (
        <Task key={task.id} task={task}></Task>
      ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    padding: 20,
    // justifyContent: "center",
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
const mapDispatchToProps = (dispatch) => {
  return {
    // Dispatch the `updateUsername` action when called
    updateUsername: (username) => dispatch(updateUsername(username)),
  };
};

export default connect(mapDispatchToProps)(Tasks);
