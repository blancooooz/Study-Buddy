import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from '@react-navigation/native';
//task is the task object that will come into this component
const Task = (task) => {
    const { colors } = useTheme();
  const test_task_obj = {
    title: "Turn in HW4",
    deadline: "2024-10-20",
    description: "Turn in HW4 on time for Programming Languages",
    tags: [],
    id: 1,
    recurring: false,
    priority: 1,
    completed: false,
  };
  return (
    <View style={{height:100,width:'100%'}}>
      <View style={{backgroundColor: "#4CAF50", // Green background color
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
    padding: 20,}}>
        <Text style={styles.username}>{test_task_obj.title}</Text>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Write Comment</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            backgroundColor: "#4CAF50", // Green background color
            flex: 2,
            borderBottomRightRadius: 20,
            padding: 20,
            borderBottomLeftRadius: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#4CAF50",
              position: "absolute",
              top: 0,
              right: -20,
              height: 16,
              width: 24,
            }}
          ></View>
        </View>
        <View
          style={{
            // position: "absolute",
            // bottom: 0,
            // right: 0,
            flex: 1,
            borderTopStartRadius: 20,
            height: 50,
            backgroundColor: colors.background,
          }}
        ></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height:100,
    width:'100%',
    backgroundColor: "#121212", // Background color of the screen
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

export default Task;
