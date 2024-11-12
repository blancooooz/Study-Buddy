import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch } from "react-redux";
import { add_task } from "../../redux/actions";
import { connect } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import * as Icons from "react-native-vector-icons";
import { generateText } from "../../utils/AIUtils";
//import DateTimePickerModal from "react-native-modal-datetime-picker";
const AddTask = ({ navigation }) => {
  const theme = useTheme();
  const [task, setTask] = useState({
    title: "",
    deadline: "",
    description: "",
    tags: [],
    recurring: false,
    priority: 0,
    completed: false,
    time_due: "",
    multi_step: false,
    sub_tasks: [{}],
    collaborative: false,
    users: [],
    reminder: {
      enabled: false,
      reminder_time: "",
    },
    attachments: [],
    subject: {
      name: "",
      color: "",
    },
  });
  const [isMultiStep, setIsMultiStep] = useState(false);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(true);

  const getPriority = () => {
    const priority = generateText(task);
    console.log("Priority from AI:",priority);
  }
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
    const { name, value, type, checked, multi_step } = event.target; //e comes in as an object
    setTask((prevTask) => ({
      ...prevTask,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(add_task(task));
    getPriority();
    navigation.goBack();
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

  return (
    <View>
      <View
        style={{
          marginBottom: 16,
          marginLeft: 8,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        
      </View>
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
        {/*  <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: colors.gray[300],
            marginBottom: 8,
          }}
        >
          ID
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
          placeholder="ID"
          placeholderTextColor={theme.colors.placeholderText}
          name="id"
          value={task.id}
          onChangeText={(text) =>
            handleChange({ target: { name: "id", value: text } })
          }
        /> */}

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
              {isMultiStep ? (
                <View
                  style={{
                    height: 32,
                    width: 32,
                    borderRadius: 10,
                    backgroundColor: colors.gray[300],
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icons.Feather
                    name="check"
                    size={16}
                    color={colors.gray[600]}
                  />
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
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
    // Dispatch the `updateUsername` action when called
    add_task: (task) => dispatch(add_task(task)),
  };
};

export default connect(mapDispatchToProps)(AddTask);
