import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { Circle } from "react-native-progress";
import * as Icons from "react-native-vector-icons";
import { edit_task, complete_task } from "../../redux/actions"; // Importing edit_task action

const good_colors = colors;
//task is the task object that will come into this component
const Task = ({ task }) => {
  const [currentTask, setCurrentTask] = useState(task);
  const [isChecked, setIsChecked] = useState(task.completed);
  let is_multi_step = task.multi_step;
  //complete_task toggles the isChecked state, which will update the UI,
  //and then it will update the task object in the database AND redux
  const handle_complete_task = () => {
      setIsChecked(!isChecked); //this line updates the UI
      console.log("hello")
      // Update Redux state with the new task completion status
      const updated_task = {...currentTask, completed: !isChecked};
      setCurrentTask(updated_task);
      complete_task(updated_task);
  }
  const { colors } = useTheme();

  if (is_multi_step) {
    return (
      <View
        style={{
          backgroundColor: good_colors.gray[800],

          width: "100%",
          borderRadius: 12,
          padding: 12,
          marginBottom: 8,
          flexDirection: "row",
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {currentTask.multi_step && currentTask.sub_tasks ? (
            <ProgressCircle steps={currentTask.sub_tasks} />
          ) : null}
        </View>
        <View style={{}}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: good_colors.white,
                fontSize: 18,
                fontFamily: "SFProRoundedSemibold",
              }}
            >
              {task.title}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
              fontFamily: "SFProRoundedMedium",
            }}
          >
            <Icons.Feather
              name="clock"
              size={18}
              color={good_colors.gray[400]}
            />
            <Text style={{ color: good_colors.gray[400], marginLeft: 4 }}>
              {task.time_due}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 4,
              alignItems: "center",
              fontFamily: "SFProRoundedMedium",
            }}
          >
            <Icons.Feather
              name="calendar"
              size={18}
              color={good_colors.gray[400]}
            />
            <Text style={{ color: good_colors.gray[400], marginLeft: 4 }}>
              {task.deadline}
            </Text>
          </View>
        </View>
        <View
          style={{
            alignItems: "flex-end",
            justifyContent: "center",
            //backgroundColor: good_colors.red[200],
            flex: 1,
          }}
        >
          <Pressable onPress={() => handle_complete_task()}>
            {isChecked ? (
              <View
                style={{
                  height: 32,
                  width: 32,
                  borderRadius: 24,
                  backgroundColor: good_colors.green[200],
                  marginRight: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icons.Feather
                  name="check"
                  size={24}
                  color={good_colors.green[500]}
                ></Icons.Feather>
              </View>
            ) : (
              <View
                style={{
                  height: 32,
                  width: 32,
                  borderRadius: 24,
                  backgroundColor: good_colors.gray[400],
                  marginRight: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: good_colors.gray[800],
                    height: 28,
                    width: 28,
                    borderRadius: 24,
                  }}
                ></View>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <>
      <View
        style={{
          backgroundColor: good_colors.gray[800],

          width: "100%",
          borderRadius: 12,
          padding: 12,
          marginBottom: 8,
          flexDirection: "row",
        }}
      >
        <View style={{}}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: good_colors.white,
                fontSize: 18,
                fontFamily: "SFProRoundedSemibold",
              }}
            >
              {task.title}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
              fontFamily: "SFProRoundedMedium",
            }}
          >
            <Icons.Feather
              name="clock"
              size={18}
              color={good_colors.gray[400]}
            />
            <Text style={{ color: good_colors.gray[400], marginLeft: 4 }}>
              {task.time_due}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 4,
              alignItems: "center",
              fontFamily: "SFProRoundedMedium",
            }}
          >
            <Icons.Feather
              name="calendar"
              size={18}
              color={good_colors.gray[400]}
            />
            <Text style={{ color: good_colors.gray[400], marginLeft: 4 }}>
              {task.deadline}
            </Text>
          </View>
        </View>
        <View
          style={{
            alignItems: "flex-end",
            justifyContent: "center",
            //backgroundColor: good_colors.red[200],
            flex: 1,
          }}
        >
          <Pressable onPress={() => complete_task()}>
            {isChecked ? (
              <View
                style={{
                  height: 32,
                  width: 32,
                  borderRadius: 24,
                  backgroundColor: good_colors.green[200],
                  marginRight: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icons.Feather
                  name="check"
                  size={24}
                  color={good_colors.green[500]}
                ></Icons.Feather>
              </View>
            ) : (
              <View
                style={{
                  height: 32,
                  width: 32,
                  borderRadius: 24,
                  backgroundColor: good_colors.gray[400],
                  marginRight: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: good_colors.gray[800],
                    height: 28,
                    width: 28,
                    borderRadius: 24,
                  }}
                ></View>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </>

  );
};
//i need a component that will render a progress circle, based off of how many tasks are completed in the step property of task_list
const ProgressCircle = ({ steps }) => {
  // Calculate the number of completed steps
  const completedSteps = steps.filter((step) => Object.values(step)[0]).length;
  // Calculate the progress as a fraction
  const progress = completedSteps / steps.length;

  return (
    <View style={{ alignItems: "center", marginRight: 12 }}>
      <Circle
        size={50}
        progress={progress}
        showsText={true}
        formatText={() => `${Math.round(progress * 100)}%`}
        color={good_colors.green[500]}
        unfilledColor={good_colors.gray[700]}
        borderWidth={0}
        textStyle={{
          fontFamily: "SFProRoundedMedium",
          fontSize: 16,
          color: good_colors.white,
        }}
      />
    </View>
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




//code for the cool shape
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