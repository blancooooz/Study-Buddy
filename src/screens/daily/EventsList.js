import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { connect, useDispatch, useSelector } from "react-redux";
import { complete_task, markTaskComplete } from "../../redux/actions"; // Assume this action updates the task's 'completed' status in the store
import { useTheme } from "@react-navigation/native";

const EventList = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.events); // Assuming tasks are in redux state

  // Format date in "Oct 30" format
  const format_date = (date_string) => {
    const date = new Date(date_string);
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Get today's date formatted
  const currentFormattedDate = format_date(new Date());

  // Filter tasks for today
  const dailyEvents = tasks.filter(
    (task) => task.deadline === currentFormattedDate
  );

  const handleCompleteTask = (taskId) => {
    complete_task(taskId);
  };
  return (
    <View>
      {dailyEvents.length ? (
        dailyEvents.map((event) => (
          <View
            key={event.id}
            style={[
              styles.taskContainer,
              { backgroundColor: theme.colors.secondary },
            ]}
          >
            {/* Task Header */}
            <View style={styles.taskHeader}>
              <Text style={[styles.taskTitle, { color: theme.colors.text }]}>
                {event.title}
              </Text>
              {event.priority > 0 && (
                <Text
                  style={[styles.priority, { color: theme.colors.primary }]}
                >
                  Priority {event.priority}
                </Text>
              )}
            </View>

            {/* Task Details */}
            <Text style={[styles.time, { color: theme.colors.text }]}>
              Due: {event.time_due}
            </Text>
            <Text style={[styles.description, { color: theme.colors.text }]}>
              {event.description.length > 40
                ? `${event.description.slice(0, 40)}...`
                : event.description}
            </Text>

            {/* Completion Button */}
            <TouchableOpacity
              style={[
                styles.completeButton,
                {
                  backgroundColor: event.completed
                    ? theme.colors.quaternary
                    : theme.colors.tertriary,
                },
              ]}
              onPress={() => handleCompleteTask(event.id)}
            >
              <Text
                style={[
                  styles.completeButtonText,
                  { color: theme.colors.text },
                ]}
              >
                {event.completed ? "Completed" : "Mark Complete"}
              </Text>
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
      margin: 8,
      padding: 12,
      borderRadius: 10,
      flexDirection: "column",
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
    complete_task: (task) => dispatch(complete_task(task)),
  };
};

export default connect(mapDispatchToProps)(EventList);
