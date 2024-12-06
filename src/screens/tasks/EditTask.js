import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch } from "react-redux";
import { edit_task } from "../../redux/actions";
import { connect } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import * as Icons from "react-native-vector-icons";
import { generateText, getRandomTasks } from "../../utils/AIUtils";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

const EditTask = ({ navigation }) => {
  const theme = useTheme();
  const route = useRoute();
  const { task } = route.params;
  const [currentTask, setTask] = useState(task);

  const tasks = useSelector((state) => state.tasks || []);
  const [isMultiStep, setIsMultiStep] = useState(task.multi_step);
  const dispatch = useDispatch();
  const [date, setDate] = useState(
    task.deadline === "" ? "No Deadline" : task.deadline
  );
  const [show, setShow] = useState(true);
  const [priority, setPriority] = useState(task.priority);
  const [isPrioritySet, setIsPrioritySet] = useState(false);

  const generateId = () => {
    const generateRandomId = () => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < 7; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    };

    let newId;
    do {
      newId = generateRandomId();
    } while (tasks.some((task) => task.id === newId));

    setTask((prevTask) => ({
      ...prevTask,
      id: newId,
    }));
  };

  const parseDateString = (dateString) => {
    console.log("Date string:", dateString);
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }
    return date;
  };
  const assignPriority = async () => {
    try {
      const randomTasks = getRandomTasks(tasks, 3);
      const priority = await generateText(currentTask, randomTasks);
      generateId();
      setTask((prevTask) => ({
        ...prevTask,
        priority: parseInt(priority),
      }));
      setPriority(parseInt(priority));
      setIsPrioritySet(true);
      console.log("Priority from AI:", priority);
    } catch (e) {
      console.log(e);
    }
  };

  const format_time = (date_string) => {
    const date = new Date(date_string);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    const formattedTime = date.toLocaleTimeString("en-US", options);
    console.log(formattedTime);
    return formattedTime;
  };
  useEffect(() => {
    console.log("currentTask", currentTask);
    //console.log ('incoming task', task);
    // console.log("Date object from database", date)
    // console.log("Date object after format", new Date(date))
    // console.log("Date object", new Date());
  });
  const format_date = (date_string) => {
    const date = new Date(date_string);
    const options = { month: "short", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    console.log(formattedDate);
    return formattedDate;
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    console.log(currentDate);
    setShow(false);
    setDate(currentDate);
    handleChange({
      target: { name: "deadline", value: format_date(currentDate) },
    });
    handleChange({
      target: { name: "time_due", value: format_time(currentDate) },
    });
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target; //e comes in as an object
    setTask((prevTask) => ({
      ...prevTask,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //await assignPriority();
    dispatch(edit_task(currentTask.id, currentTask, tasks));
    navigation.navigate("Tasks");
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  const handleMultiStep = () => {
    handleChange({ target: { name: "multi_step", value: !isMultiStep } });
    setIsMultiStep(!isMultiStep);
  };

  const addAttachment = (attachment) => {
    setTask((prevTask) => ({
      ...prevTask,
      attachments: [...prevTask.attachments, attachment],
    }));
  };

  return (
    <View>
      <View
        style={{
          marginBottom: 16,
          marginLeft: 8,
          flexDirection: "row",
          alignItems: "center",
        }}
      ></View>
      <ScrollView style={{ padding: 20 }}>
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          Title
        </Text>
        <TextInput
          style={{
            color: theme.colors.text,
            borderWidth: 1,
            borderColor: colors.gray[600],
            padding: 12,
            borderRadius: 10,
            marginBottom: 12,
          }}
          placeholder="Title"
          placeholderTextColor={colors.gray[600]}
          name="title"
          value={currentTask.title}
          onChangeText={(text) =>
            handleChange({ target: { name: "title", value: text } })
          }
        />
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          Deadline
        </Text>

        <View style={{ alignItems: "flex-start" }}>
          <DateTimePicker
            minimumDate={new Date()}
            value={new Date()}
            mode="datetime"
            style={{ marginLeft: -10, marginBottom: 8 }}
            onChange={onChange}
          />
        </View>
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          Description
        </Text>
        <TextInput
          style={{
            color: theme.colors.text,
            borderWidth: 1,
            borderColor: colors.gray[600],
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
            height: 80,
          }}
          placeholder="Description"
          placeholderTextColor={theme.colors.placeholderText}
          name="description"
          value={currentTask.description}
          onChangeText={(text) =>
            handleChange({ target: { name: "description", value: text } })
          }
          multiline
        />
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          Tags
        </Text>
        <TextInput
          style={{
            color: theme.colors.text,
            borderWidth: 1,
            borderColor: colors.gray[600],
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
          }}
          placeholder="Tags (comma separated)"
          placeholderTextColor={theme.colors.placeholderText}
          name="tags"
          value={currentTask.tags.join(", ")}
          onChangeText={(text) =>
            handleChange({ target: { name: "tags", value: text.split(", ") } })
          }
        />{/*
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          Recurring
        </Text>
        <Switch
          value={currentTask.recurring}
          onValueChange={(value) =>
            handleChange({ target: { name: "recurring", value } })
          }
        />
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          Reminder
        </Text>
        <Switch
          value={currentTask.reminder.enabled}
          onValueChange={(value) =>
            handleChange({
              target: {
                name: "reminder",
                value: { ...currentTask.reminder, enabled: value },
              },
            })
          }
        />
        {currentTask.reminder.enabled && (
          <View style={{ alignItems: "flex-start" }}>
            <DateTimePicker
              minimumDate={new Date()}
              value={new Date(currentTask.reminder.reminder_time)}
              mode="datetime"
              themeVariant="dark"
              style={{ marginLeft: -10, marginBottom: 8 }}
              onChange={(event, selectedDate) =>
                handleChange({
                  target: {
                    name: "reminder",
                    value: {
                      ...currentTask.reminder,
                      reminder_time: selectedDate.toISOString(),
                    },
                  },
                })
              }
            />
          </View>
        )}
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          Subject Name
        </Text>
        <TextInput
          style={{
            color: theme.colors.text,
            borderWidth: 1,
            borderColor: colors.gray[600],
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
          }}
          placeholder="Subject Name"
          placeholderTextColor={theme.colors.placeholderText}
          name="subject.name"
          value={currentTask.subject.name}
          onChangeText={(text) =>
            handleChange({ target: { name: "subject.name", value: text } })
          }
        />
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          Subject Color
        </Text>
        <TextInput
          style={{
            color: theme.colors.text,
            borderWidth: 1,
            borderColor: colors.gray[600],
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
          }}
          placeholder="Subject Color"
          placeholderTextColor={theme.colors.placeholderText}
          name="subject.color"
          value={currentTask.subject.color}
          onChangeText={(text) =>
            handleChange({ target: { name: "subject.color", value: text } })
          }
        />*/}
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          Priority
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor:
                currentTask.priority === 1
                  ? colors.green[400]
                  : colors.gray[600],
              padding: 12,
              borderRadius: 10,
              flex: 1,
              marginRight: 5,
              alignItems: "center",
            }}
            onPress={() =>
              handleChange({ target: { name: "priority", value: 1 } })
            }
          >
            <Text style={{ color: colors.white }}>Normal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor:
                currentTask.priority === 2
                  ? colors.yellow[200]
                  : colors.gray[600],
              padding: 12,
              borderRadius: 10,
              flex: 1,
              marginHorizontal: 5,
              alignItems: "center",
            }}
            onPress={() =>
              handleChange({ target: { name: "priority", value: 2 } })
            }
          >
            <Text style={{ color: colors.white }}>Moderate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor:
                currentTask.priority === 3 ? colors.red[300] : colors.gray[600],
              padding: 12,
              borderRadius: 10,
              flex: 1,
              marginLeft: 5,
              alignItems: "center",
            }}
            onPress={() =>
              handleChange({ target: { name: "priority", value: 3 } })
            }
          >
            <Text style={{ color: colors.white }}>Urgent</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 20 }}></View>{/*
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={handleMultiStep}>
            <View
              style={{
                height: 32,
                width: 32,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: colors.gray[300],
                backgroundColor: theme.colors.background,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
            </View>
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "SFProRoundedRegular",
              color: theme.colors.text,
              fontSize: 16,
              marginLeft: 8,
            }}
          >
            Sub tasks
          </Text>
        </View>*/}
        <TouchableOpacity onPress={handleSubmit}>
          <View
            style={{
              backgroundColor: colors.gray[300],
              width: "75%",
              height: 48,
              borderRadius: 12,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 32,
              marginTop: 16,
            }}
          >
            <Text
              styles={{
                fontFamily: "SFProRoundedRegular",
                color: colors.gray[100],
                fontSize: 24,
              }}
            >
              Update Task
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 75 }} />
      </ScrollView>
    </View>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    edit_task: (id, updated_task, task_list) =>
      dispatch(edit_task(id, updated_task, task_list)),
  };
};

export default connect(mapDispatchToProps)(EditTask);
