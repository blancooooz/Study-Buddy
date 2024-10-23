import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView
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
import { useSelector } from "react-redux"; // Redux hook to access the store's state
import { get_all_tasks } from "../../redux/actions";
const Tasks = ({ navigation }) => {
  const { colors } = useTheme();
  const [tasks, setTasks] = useState([]); // State variable to store tasks
  //const [sort_type, setSortType] = useState(''); // State variable to store sort type
  let allTasks = [];
  try{
    allTasks = useSelector((state) => state.tasks || []);
  }
  catch(e){
    console.log(e);
  }
  const uncompleted_tasks = allTasks
    .filter(task => !task.completed);
  //console.log(uncompleted_tasks);
  const completed_tasks = allTasks
    .filter(task => task.completed);
  return (
    /* main screen view */
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <ScrollView style={{ }} showsVerticalScrollIndicator={false}>
        {uncompleted_tasks?.map((task) => (
          <Task key={task.id} task={task}></Task>
        ))}
        <Text style={{color:themecolors.gray[100],fontFamily:'SFProRoundedSemibold', fontSize:24,marginBottom:8}}>Completed</Text>
        {completed_tasks?.map((task) => (
          <Task key={task.id} task={task}></Task>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: 16,
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





  //whenever the user clicks sort,
  // const sort = (sort_by, tasks,...props) => {
  //   //sort_by could be by subject, by time created, etc
  //   switch(sort_by){
  //     case "subject":{
  //       const subject = props.subject;
  //       //core tasks will be all displayed first, then math
  //       tasks.sort((a, b) => (a.title > b.title) ? 1 : -1);
  //       //[math, math, core, ]

  //       //[core,core,math, math,core] then rerun sort
  //       break;
  //     }
  //   }
  // }
  //sort(sort_by, tasks, subject="math")
  //pull tasks from database, and display them
  //need an if check for a global variable that stores the light/dark mode