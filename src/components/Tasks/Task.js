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
import { useSelector } from "react-redux";
import { edit_task, complete_task, delete_task } from "../../redux/actions"; // Importing edit_task action
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
const good_colors = colors;
const Task = ({ onPress, task }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isChecked = task.completed;
  const is_multi_step = task.multiStep;
  const currentTask = task;
  const taskList = useSelector((state) => state.tasks || []);
  const handle_complete_task = () => {
    dispatch(complete_task(currentTask.id)); // Dispatch complete task action
  };
  const formatTime = (milliseconds) => {
    const date = new Date(milliseconds);
    date.setHours(date.getHours() - 5); // Convert to EST
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };

  const formatMilliseconds = (milliseconds) => {
    const date = new Date(milliseconds);
    date.setHours(date.getHours() - 5); // Convert to EST
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getUTCDate().toString().padStart(2, "0");
    return `${month} ${day}`;
  };
  const handle_delete_task = () => {
    dispatch(delete_task(currentTask.id, taskList)); // Dispatch delete task action
  };

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        onPress={handle_delete_task}
        style={{
          backgroundColor: good_colors.red[500],
          justifyContent: "center",
          alignItems: "center",
          width: 80,
          height: "90%",
          borderRadius: 12,
        }}
      >
        <Text style={[styles.deleteButtonText, { color: theme.colors.text }]}>
          Delete
        </Text>
      </TouchableOpacity>
    );
  };
  const handleEditTask = (task) => {
    onPress
  };
  const { colors } = useTheme();

  if (is_multi_step) {
    return (
      <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
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
          <View
            style={{ justifyContent: "center", alignItems: "center" }}
          ></View>
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
              {priorityComponent(task.priority)}
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
                {formatTime(task.time_due)}
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
                {formatMilliseconds(task.deadline)}
              </Text>
            </View>
          </View>
          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "center",
              flex: 1,
            }}
          >
            {currentTask.multi_step && currentTask.sub_tasks ? (
              <ProgressCircle steps={currentTask.sub_tasks} />
            ) : null}
          </View>
        </View>
      </Swipeable>
    );
  }

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <Pressable onPress={onPress} style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: theme.colors.taskBackground,
            width: "100%",
            borderRadius: 12,
            padding: 12,
            marginBottom: 8,
            flexDirection: "row",
          }}
        >
          <View
            style={{ justifyContent: "center", alignItems: "center" }}
          ></View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 18,
                  fontFamily: "SFProRoundedSemibold",
                }}
              >
                {task.title}
              </Text>
              {priorityComponent(task.priority)}
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
                color={theme.colors.taskIcons}
              />
              <Text style={{ color: theme.colors.taskIcons, marginLeft: 4 }}>
                {formatTime(task.time_due)}
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
                color={theme.colors.taskIcons}
              />
              <Text style={{ color: theme.colors.taskIcons, marginLeft: 4 }}>
                {formatMilliseconds(task.deadline)}
              </Text>
            </View>
          </View>
          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={handle_complete_task}>
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
                  />
                </View>
              ) : (
                <View
                  style={{
                    height: 32,
                    width: 32,
                    borderRadius: 24,
                    backgroundColor: theme.colors.taskIcons,
                    marginRight: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: theme.colors.taskBackground,
                      height: 28,
                      width: 28,
                      borderRadius: 24,
                    }}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

const priorityComponent = (priority) => {
  let backgroundColor;
  let text;
  let text_color;

  switch (priority) {
    case 3:
      backgroundColor = good_colors.red[500];
      text = "Urgent";
      break;
    case 2:
      backgroundColor = good_colors.yellow[300];
      text = "Moderate";
      text_color = good_colors.gray[700];
      break;
    case 1:
      backgroundColor = good_colors.green[500];
      text = "Normal";
      break;
    default:
      backgroundColor = good_colors.gray[500];
      text = "Low";
  }

  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginLeft: 8,
      }}
    >
      <Text
        style={{
          color: text_color || good_colors.white,
          fontSize: 12,
          fontFamily: "SFProRoundedMedium",
        }}
      >
        {text}
      </Text>
    </View>
  );
};
const ProgressCircle = ({ steps, handle_complete_task, isChecked }) => {
  // Calculate the number of completed steps
  const completedSteps = steps.filter((step) => Object.values(step)[0]).length;
  // Calculate the progress as a fraction
  const progress = completedSteps / steps.length;

  if (progress === 1) {
    return (
      <Pressable onPress={handle_complete_task}>
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
            />
          </View>
        ) : (
          <View
            style={{
              height: 32,
              width: 32,
              borderRadius: 24,
              backgroundColor: theme.color.taskIcons,
              marginRight: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: theme.color.taskBackground,
                height: 28,
                width: 28,
                borderRadius: 24,
              }}
            />
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <View style={{ alignItems: "center", marginRight: 12 }}>
      <Circle
        size={50}
        progress={progress}
        showsText={true}
        formatText={() => `${Math.round(progress * 100)}%`}
        color={good_colors.green[500]}
        unfilledColor={theme.color.circleBackground}
        borderWidth={0}
        textStyle={{
          fontFamily: "SFProRoundedMedium",
          fontSize: 16,
          color: theme.color.text,
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Task;
