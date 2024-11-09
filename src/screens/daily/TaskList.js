import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { connect, useDispatch, useSelector } from "react-redux";
import { complete_task } from "../../redux/actions"; // Assume this action updates the task's 'completed' status in the store
import { useTheme } from "@react-navigation/native";
import * as Icons from "react-native-vector-icons";

const TaskList = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
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
    dispatch(complete_task(taskId));
  };
  return (
    <View>
      {dailyTasks.length ? (
        dailyTasks.map((task) => (
          <View
            key={task.id}
            style={{
              flexDirection: "row",
              backgroundColor: theme.colors.secondary,
              margin: 8,
              padding: 12,
              borderRadius: 10,
            }}
          >
            <View
              style={[
                styles.taskContainer,
                { backgroundColor: theme.colors.secondary },
              ]}
            >
              {/* Task Header */}
              <View style={styles.taskHeader}>
                <Text style={[styles.taskTitle, { color: theme.colors.text }]}>
                  {task.title}
                </Text>
                {task.priority > 0 && (
                  <Text
                    style={[styles.priority, { color: theme.colors.primary }]}
                  >
                    Priority {task.priority}
                  </Text>
                )}
              </View>

              {/* Task Details */}
              <Text style={[styles.time, { color: theme.colors.text }]}>
                Due: {task.time_due}
              </Text>
            </View>
            <TouchableOpacity
              style={{ flex: 1, alignSelf: "center" }}
              onPress={() => handleCompleteTask(task.id)}
            >
              {task.completed ? (
                <View
                  style={{
                    height: 48,
                    width: 48,
                    borderRadius: 24,
                    backgroundColor: theme.colors.card,
                    marginRight: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icons.Feather
                    name="check"
                    size={36}
                    color={theme.colors.primary}
                  ></Icons.Feather>
                </View>
              ) : (
                <View
                  style={{
                    height: 48,
                    width: 48,
                    borderRadius: 24,
                    backgroundColor: theme.colors.primary,
                    marginRight: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: theme.colors.secondary,
                      height: 44,
                      width: 44,
                      borderRadius: 24,
                    }}
                  ></View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <></>
      )}
    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    taskContainer: {
      flexDirection: "column",
      flex: 5,
    },
    taskHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    taskTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    priority: {
      fontSize: 14,
      fontWeight: "500",
    },
    time: {
      fontSize: 14,
      marginVertical: 4,
    },
    description: {
      fontSize: 14,
      marginBottom: 8,
    },
    completeButton: {
      padding: 8,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8,
    },
    completeButtonText: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });

const mapDispatchToProps = (dispatch) => {
  return {
    // Dispatch the `complete_task` action when called
    complete_task: (taskId) => dispatch(complete_task(taskId)),
  };
};

export default connect(mapDispatchToProps)(TaskList);
