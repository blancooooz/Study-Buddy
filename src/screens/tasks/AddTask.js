import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch } from "react-redux";
import { add_task } from "../../redux/actions";
import { connect } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import * as Icons from "react-native-vector-icons";
import { generateText, getRandomTasks } from "../../utils/AIUtils";
import { useSelector } from "react-redux";
const format_date_time = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZoneName: "short",
  };
  console.log("date", date.toLocaleString("en-US", options));
  return date.toLocaleString("en-US", options);
};
const AddTask = ({ navigation }) => {
  const theme = useTheme();
  const [task, setTask] = useState({
    title: "",
    deadline: "",
    description: "",
    id: "",
    tags: [],
    recurring: false,
    priority: 0,
    completed: false,
    time_due: "",
    multi_step: false,
    sub_tasks: [{}],
    reminder: {
      enabled: false,
      reminder_time: "",
    },
    created_at: format_date_time(new Date()),
    edited_at: "",
    attachments: [],
    subject: {
      name: "",
      color: "",
    },
    urgent: false,
  });

  const tasks = useSelector((state) => state.tasks);
  const [isMultiStep, setIsMultiStep] = useState(false);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(true);
  const [priority, setPriority] = useState(0);
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

  const assignPriority = async () => {
    try {
      const randomTasks = getRandomTasks(tasks, 3);
      const priority = await generateText(task, randomTasks);
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

  useEffect(() => {
    if (isPrioritySet) {
      dispatch(add_task(task));
      navigation.goBack();
    }
  }, [isPrioritySet]);

  const format_time = (date_string) => {
    const date = new Date(date_string);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    const formattedTime = date.toLocaleTimeString("en-US", options);
    console.log(formattedTime);
    return formattedTime;
  };

  const format_date = (date_string) => {
    const date = new Date(date_string);
    const options = { month: "short", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    console.log(formattedDate);
    return formattedDate;
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setShow(false);
    setDate(currentDate);
    const estDate = new Date(currentDate).toLocaleString("en-US", {
      timeZone: "America/New_York",
    });
    console.log("EST Date:", estDate);
    handleChange({
      target: { name: "deadline", value: new Date(currentDate).getTime() },
    });
    handleChange({
      target: { name: "time_due", value: new Date(currentDate).getTime() },
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
    if (task.deadline === "") {
      alert("Please set a deadline");
      return;
    }
    e.preventDefault();
    await assignPriority();
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
  const [subTasks, setSubTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSubTask, setCurrentSubTask] = useState(null);

  // Function to handle adding new sub-tasks
  const addSubTask = () => {
    setSubTasks([
      ...subTasks,
      {
        title: "",
        description: "",
        id: "",
        priority: 0,
        completed: false,
        created_at: "",
        updated_at: "",
      },
    ]);
  };

  // Function to handle editing sub-task
  const editSubTask = (index) => {
    setCurrentSubTask(index);
    setModalVisible(true);
  };

  // Function to save sub-task details
  const saveSubTask = (index, updatedSubTask) => {
    const updatedSubTasks = [...subTasks];
    updatedSubTasks[index] = updatedSubTask;
    setSubTasks(updatedSubTasks);
    setModalVisible(false);
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ marginTop: 50, padding: 20, backgroundColor: "white" }}>
          <TextInput
            placeholder="Title"
            value={subTasks[currentSubTask]?.title}
            onChangeText={(text) => {
              const updatedSubTask = {
                ...subTasks[currentSubTask],
                title: text,
              };
              saveSubTask(currentSubTask, updatedSubTask);
            }}
          />
          <TextInput
            placeholder="Description"
            value={subTasks[currentSubTask]?.description}
            onChangeText={(text) => {
              const updatedSubTask = {
                ...subTasks[currentSubTask],
                description: text,
              };
              saveSubTask(currentSubTask, updatedSubTask);
            }}
          />
          <Button title="Save" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
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
            color: colors.gray[300],
            marginBottom: 8,
          }}
        >
          Title
        </Text>
        <TextInput
          style={{
            color: colors.white,
            borderWidth: 1,
            borderColor: colors.gray[600],
            padding: 12,
            borderRadius: 10,
            marginBottom: 12,
          }}
          placeholder="Title"
          placeholderTextColor={colors.gray[600]}
          name="title"
          value={task.title}
          onChangeText={(text) =>
            handleChange({ target: { name: "title", value: text } })
          }
        />
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: colors.gray[300],
            marginBottom: 8,
          }}
        >
          Deadline
        </Text>

        <View style={{ alignItems: "flex-start" }}>
          <DateTimePicker
            minimumDate={new Date()}
            value={date}
            mode="datetime"
            themeVariant="dark"
            style={{ marginLeft: -10, marginBottom: 8 }}
            onChange={onChange}
          />
        </View>
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: colors.gray[300],
            marginBottom: 8,
          }}
        >
          Description
        </Text>
        <TextInput
          style={{
            color: colors.white,
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
          value={task.description}
          onChangeText={(text) =>
            handleChange({ target: { name: "description", value: text } })
          }
          multiline
        />
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: colors.gray[300],
            marginBottom: 8,
          }}
        >
          Tags
        </Text>
        <TextInput
          style={{
            color: colors.white,
            borderWidth: 1,
            borderColor: colors.gray[600],
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
          }}
          placeholder="Tags (comma separated)"
          placeholderTextColor={theme.colors.placeholderText}
          name="tags"
          value={task.tags.join(", ")}
          onChangeText={(text) =>
            handleChange({ target: { name: "tags", value: text.split(", ") } })
          }
        />
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: colors.gray[300],
            marginBottom: 8,
          }}
        >
          Recurring
        </Text>
        <Switch
          value={task.recurring}
          onValueChange={(value) =>
            handleChange({ target: { name: "recurring", value } })
          }
        />
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: colors.gray[300],
            marginBottom: 8,
          }}
        >
          Reminder
        </Text>
        <Switch
          value={task.reminder.enabled}
          onValueChange={(value) =>
            handleChange({
              target: {
                name: "reminder",
                value: { ...task.reminder, enabled: value },
              },
            })
          }
        />
        {task.reminder.enabled && (
          <View style={{ alignItems: "flex-start" }}>
            <DateTimePicker
              minimumDate={new Date()}
              value={new Date(task.reminder.reminder_time)}
              mode="datetime"
              themeVariant="dark"
              style={{ marginLeft: -10, marginBottom: 8 }}
              onChange={(event, selectedDate) =>
                handleChange({
                  target: {
                    name: "reminder",
                    value: {
                      ...task.reminder,
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
            color: colors.gray[300],
            marginBottom: 8,
          }}
        >
          Subject Name
        </Text>
        <TextInput
          style={{
            color: colors.white,
            borderWidth: 1,
            borderColor: colors.gray[600],
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
          }}
          placeholder="Subject Name"
          placeholderTextColor={theme.colors.placeholderText}
          name="subject.name"
          value={task.subject.name}
          onChangeText={(text) =>
            handleChange({ target: { name: "subject.name", value: text } })
          }
        />
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: colors.gray[300],
            marginBottom: 8,
          }}
        >
          Subject Color
        </Text>
        <TextInput
          style={{
            color: colors.white,
            borderWidth: 1,
            borderColor: colors.gray[600],
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
          }}
          placeholder="Subject Color"
          placeholderTextColor={theme.colors.placeholderText}
          name="subject.color"
          value={task.subject.color}
          onChangeText={(text) =>
            handleChange({ target: { name: "subject.color", value: text } })
          }
        />
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: colors.gray[300],
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
                task.priority === 1 ? colors.green[400] : colors.gray[600],
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
                task.priority === 2 ? colors.yellow[200] : colors.gray[600],
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
                task.priority === 3 ? colors.red[300] : colors.gray[600],
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
        <View style={{}}>
          <Text
            style={{
              fontFamily: "SFProRoundedRegular",
              color: colors.gray[300],
              fontSize: 16,
              marginLeft: 8,
            }}
          >
            Sub tasks
          </Text>
          <View>
            {subTasks.map((subTask, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <TextInput
                  placeholder="Title"
                  value={subTask.title}
                  onChangeText={(text) => updateSubTask(index, "title", text)}
                  style={{
                    color: colors.white,
                    borderWidth: 1,
                    borderColor: colors.gray[600],
                    padding: 12,
                    borderRadius: 10,
                    marginBottom: 20,
                  }}
                />
                <TextInput
                  placeholder="Description"
                  value={subTask.description}
                  onChangeText={(text) =>
                    updateSubTask(index, "description", text)
                  }
                  style={{
                    color: colors.white,
                    borderWidth: 1,
                    borderColor: colors.gray[600],
                    padding: 12,
                    borderRadius: 10,
                    marginBottom: 20,
                  }}
                />
                <TextInput
                  placeholder="Priority"
                  value={String(subTask.priority)}
                  onChangeText={(text) =>
                    updateSubTask(index, "priority", Number(text))
                  }
                  keyboardType="numeric"
                  style={{
            color: colors.white,
            borderWidth: 1,
            borderColor: colors.gray[600],
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
          }}
                />
                <Switch
                  value={subTask.completed}
                  onValueChange={(value) =>
                    updateSubTask(index, "completed", value)
                  }
                />
              </View>
            ))}
            <Button title="+ Add Sub Task" onPress={addSubTask} />
          </View>
        </View>

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
              Create Task
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
    add_task: (task) => dispatch(add_task(task)),
  };
};

export default connect(mapDispatchToProps)(AddTask);
