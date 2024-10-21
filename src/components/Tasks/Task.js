import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import * as Icons from "react-native-vector-icons";
const good_colors = colors;
//task is the task object that will come into this component
const Task = ({task}) => {
  const { colors } = useTheme();
  const test_task_obj = {
    title: "Turn in HW4",
    deadline: "June 5",
    description: "Turn in HW4 on time for Programming Languages",
    tags: [],
    id: 1,
    recurring: false,
    priority: 1,
    completed: false,
    time_due: "11:59 PM",
    multi_step: false,
    steps:[],
  };
  return (
    <View
      style={{
        backgroundColor: good_colors.gray[800],
        height: 100,
        width: "100%",
        borderRadius: 12,
        padding: 12,
        marginBottom:8,
      }}
    >
      <View style={{}}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: good_colors.white, fontSize: 18,fontFamily:'SFProRoundedSemibold' }}>
            {task.title}
          </Text>
        </View>
        <View style={{flexDirection:'row', alignItems:'center',marginTop:8, fontFamily:'SFProRoundedMedium'}}>
        <Icons.Feather name='clock' size={18} color={good_colors.gray[400]}/>
          <Text style={{ color: good_colors.gray[400],marginLeft:4, }}>
            {task.time_due}
          </Text>
        </View>
        <View style={{flexDirection:'row',marginTop:4, alignItems:'center',fontFamily:'SFProRoundedMedium'}}>
        <Icons.Feather name='calendar' size={18} color={good_colors.gray[400]}/>
          <Text style={{ color: good_colors.gray[400],marginLeft:4, }}>
            {test_task_obj.deadline}
          </Text>
        </View>
      </View>
    </View>
    // <View style={{ height: 150, width: "100%", backgroundColor:good_colors.gray[500] }}>
    //   <View
    //     style={{
    //       backgroundColor: "#4CAF50", // Green background color
    //       borderTopStartRadius: 20,
    //       borderTopEndRadius: 20,
    //       borderBottomEndRadius: 20,
    //       padding: 20,
    //     }}
    //   >
    //     <Text style={styles.username}>{test_task_obj.title}</Text>

    //     <TouchableOpacity style={styles.button}>
    //       <Text style={styles.buttonText}>Write Comment</Text>
    //     </TouchableOpacity>
    //   </View>
    //   <View style={{ flexDirection: "row" }}>
    //     <View
    //       style={{
    //         backgroundColor: "#4CAF50", // Green background color
    //         flex: 2,
    //         borderBottomRightRadius: 20,
    //         padding: 20,
    //         borderBottomLeftRadius: 20,
    //       }}
    //     >
    //       <View
    //         style={{
    //           backgroundColor: "#4CAF50",
    //           position: "absolute",
    //           top: 0,
    //           right: -20,
    //           height: 16,
    //           width: 24,
    //         }}
    //       ></View>
    //     </View>
    //     <View
    //       style={{
    //         // position: "absolute",
    //         // bottom: 0,
    //         // right: 0,
    //         flex: 1,
    //         borderTopStartRadius: 20,
    //         height: 50,
    //         backgroundColor: colors.background,
    //       }}
    //     ></View>
    //   </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: "100%",
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
