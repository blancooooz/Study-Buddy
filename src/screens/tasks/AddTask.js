import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { CheckBox } from "@react-native-community/checkbox";
import { useDispatch } from "react-redux";
import { add_task } from "../../redux/actions";
import { connect } from "react-redux";
import { useTheme } from "@react-navigation/native";

const AddTask = () => {
    const theme = useTheme()
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
    sub_tasks: [],
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

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(add_task(task));
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
        placeholder="Title"
        placeholderTextColor={theme.colors.placeholderText}
        name="title"
        value={task.title}
        onChangeText={(text) =>
          handleChange({ target: { name: "title", value: text } })
        }
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
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
          height: 80,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
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
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
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
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
        placeholder="ID"
        placeholderTextColor={theme.colors.placeholderText}
        name="id"
        value={task.id}
        onChangeText={(text) =>
          handleChange({ target: { name: "id", value: text } })
        }
      />
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Text style={{color:theme.colors.text}}>Recurring</Text>
      </View>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
        placeholder="Priority"
        placeholderTextColor={theme.colors.placeholderText}
        name="priority"
        value={String(task.priority)}
        onChangeText={(text) =>
          handleChange({ target: { name: "priority", value: text } })
        }
        keyboardType="numeric"
      />
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Text style={{color:theme.colors.text}}>Completed</Text>
      </View>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
        placeholder="Time Due"
        placeholderTextColor={theme.colors.placeholderText}
        name="time_due"
        value={task.time_due}
        onChangeText={(text) =>
          handleChange({ target: { name: "time_due", value: text } })
        }
      />
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Text style={{color:theme.colors.text}}>Multi-step</Text>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Text style={{color:theme.colors.text}}>Collaborative</Text>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Text style={{color:theme.colors.text}}>Reminder Enabled</Text>
      </View>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
        placeholder="Reminder Time"
        placeholderTextColor={theme.colors.placeholderText}
        name="reminder.reminder_time"
        value={task.reminder.reminder_time}
        onChangeText={(text) =>
          handleChange({
            target: { name: "reminder.reminder_time", value: text },
          })
        }
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
        placeholder="Subject Name"
        placeholderTextColor={theme.colors.placeholderText}
        name="subject.name"
        value={task.subject.name}
        onChangeText={(text) =>
          handleChange({ target: { name: "subject.name", value: text } })
        }
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
        placeholder="Subject Color"
        placeholderTextColor={theme.colors.placeholderText}
        name="subject.color"
        value={task.subject.color}
        onChangeText={(text) =>
          handleChange({ target: { name: "subject.color", value: text } })
        }
      />
      <Button title="Add Task" onPress={handleSubmit} />
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
