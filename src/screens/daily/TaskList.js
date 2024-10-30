import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { markTaskComplete } from "../../redux/actions"; // Assume this action updates the task's 'completed' status in the store
import { useTheme } from "@react-navigation/native";
import Task from "../../components/Tasks/Task";

const TaskList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks); // Assuming tasks are in redux state

  // Format date in "Oct 30" format
  const format_date = (date_string) => {
    const date = new Date(date_string);
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Get today's date formatted
  const currentFormattedDate = format_date(new Date());

  // Filter tasks for today
  const dailyTasks = tasks.filter(
    (task) => task.deadline === currentFormattedDate
  );

  const handleCompleteTask = (taskId) => {
    console.log("Complete task pressed");
    //handleComplete
  };

  return (
    <View>
      {dailyTasks.length ? (
        dailyTasks.map((task) => (
          <Task key={task.id} task={task} onPress={handleCompleteTask}></Task>
        ))
      ) : (
        <Text style={{ padding: 16 }}>No tasks for today!</Text>
      )}
    </View>
  );
};

export default TaskList;
