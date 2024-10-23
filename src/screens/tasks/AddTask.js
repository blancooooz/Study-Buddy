import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { CheckBox } from "@react-native-community/checkbox";
import { useDispatch } from "react-redux";
import { add_task } from "../../redux/actions";
import { connect } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import * as Icons from "react-native-vector-icons";
//import DateTimePickerModal from "react-native-modal-datetime-picker";
const AddTask = ({ navigation }) => {
  const theme = useTheme();
  const [task, setTask] = useState({
    title: "",
    deadline: "",
    description: "",
    tags: [],
    id: "",
    recurring: false,
    priority: 0,
    completed: false,
    time_due: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
      <View style={{ marginBottom: 16, marginLeft: 8 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.Feather
            name="chevron-left"
            size={40}
            color={colors.gray[100]}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ padding: 20 }}>
        <Text
          style={{
            fontFamily: "SFProRoundedMedium",
            fontSize: 16,
            color: colors.gray[100],
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
            marginBottom: 20,
          }}
          placeholder="Title"
          placeholderTextColor={colors.gray[600]}
          name="title"
          value={task.title}
          onChangeText={(text) =>
            handleChange({ target: { name: "title", value: text } })
          }
        />
        <TextInput
          style={{
            color: colors.white,
            borderWidth: 1,
            borderColor: colors.gray[600],
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
          }}
          placeholder="Deadline"
          name="deadline"
          value={task.deadline}
          placeholderTextColor={theme.colors.placeholderText}
          onChangeText={(text) =>
            handleChange({ target: { name: "deadline", value: text } })
          }
        />
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
        />
        <TouchableOpacity onPress={handleMultiStep}>
          <View>
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 12,
                backgroundColor: colors.gray[100],
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isMultiStep ? (
                <View
                  style={{
                    height: 48,
                    width: 48,
                    borderRadius: 12,
                    backgroundColor: colors.gray[200],
                    justifyContent:'center',
                    alignItems:'center',
                  }}
                ><Icons.Feather name="check" size={16} color={colors.gray[600]}/></View>
              ) : (
                <View
                  style={{
                    height: 48,
                    width: 48,
                    borderRadius: 12,
                    backgroundColor: theme.colors.background,
                  }}
                ></View>
              )}
            </View>
          </View>
        </TouchableOpacity>

        <Button title="Add Task" onPress={handleSubmit} />
        <View style={{ height: 50 }} />
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
