import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useDispatch } from "react-redux";
import { addStudyPlan } from "../../redux/actions";
import { useTheme } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { v4 as uuidv4 } from "uuid";
import DateTimePicker from "@react-native-community/datetimepicker";
import Feather from "react-native-vector-icons/Feather";

const AddStudyPlan = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [studyPlan, setStudyPlan] = useState({
    id: uuidv4(),
    title: "",
    description: "",
    tags: [],
    sessions: [],
    completed: false,
    collaborative: false,
    urgent: false,
    subject: { name: "", color: "" },
    reminder: { enabled: false, reminder_time: "" },
    users: [],
  });

  const [newSession, setNewSession] = useState({ title: "", description: "" });
  const [newUser, setNewUser] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle changes for study plan fields
  const handleChange = (field, value) => {
    setStudyPlan((prevPlan) => ({
      ...prevPlan,
      [field]: value,
    }));
  };

  const handleSessionChange = (field, value) => {
    setNewSession((prevSession) => ({
      ...prevSession,
      [field]: value,
    }));
  };

  const addSession = () => {
    setStudyPlan((prevPlan) => ({
      ...prevPlan,
      sessions: [
        ...prevPlan.sessions,
        { ...newSession, id: uuidv4(), completed: false },
      ],
    }));
    setNewSession({ title: "", description: "" });
  };

  const addUser = () => {
    if (newUser.trim() === "") {
      alert("User cannot be empty");
      return;
    }
    setStudyPlan((prevPlan) => ({
      ...prevPlan,
      users: [...prevPlan.users, newUser],
    }));
    setNewUser("");
  };

  const handleSubmit = () => {
    if (studyPlan.title.trim() === "") {
      alert("Please enter a title");
      return;
    }
    dispatch(addStudyPlan(studyPlan));
    navigation.goBack();
  };

  return (
    <ScrollView
      style={{ padding: 20, backgroundColor: theme.colors.background }}
    >

      {/* Title Input */}
      <TextInput
        style={inputStyle}
        placeholder="Title"
        placeholderTextColor={colors.gray[600]}
        value={studyPlan.title}
        onChangeText={(text) => handleChange("title", text)}
      />

      {/* Description Input */}
      <TextInput
        style={inputStyle}
        placeholder="Description"
        placeholderTextColor={colors.gray[600]}
        value={studyPlan.description}
        onChangeText={(text) => handleChange("description", text)}
        multiline
      />

      {/* Tags Input */}
      <TextInput
        style={inputStyle}
        placeholder="Tags (comma separated)"
        placeholderTextColor={colors.gray[600]}
        value={studyPlan.tags.join(", ")}
        onChangeText={(text) => handleChange("tags", text.split(", "))}
      />

      {/* Subject Input */}
      <TextInput
        style={inputStyle}
        placeholder="Subject Name"
        value={studyPlan.subject.name}
        placeholderTextColor={colors.gray[600]}
        onChangeText={(text) =>
          handleChange("subject", { ...studyPlan.subject, name: text })
        }
      />
      <TextInput
        style={inputStyle}
        placeholder="Subject Color"
        value={studyPlan.subject.color}
        placeholderTextColor={colors.gray[600]}
        onChangeText={(text) =>
          handleChange("subject", { ...studyPlan.subject, color: text })
        }
      />

      {/* Urgent Switch */}
      <View style={switchContainer}>
        <Text style={switchLabel}>Urgent:</Text>
        <Switch
          value={studyPlan.urgent}
          onValueChange={(value) => handleChange("urgent", value)}
        />
      </View>

      {/* Collaborative Switch */}
      <View style={switchContainer}>
        <Text style={switchLabel}>Collaborative:</Text>
        <Switch
          value={studyPlan.collaborative}
          onValueChange={(value) => handleChange("collaborative", value)}
        />
      </View>

      {/* Add Users Section (conditionally rendered if collaborative is enabled) */}
      {studyPlan.collaborative && (
        <>
          <TextInput
            style={inputStyle}
            placeholder="Add User"
            placeholderTextColor={colors.gray[600]}
            value={newUser}
            onChangeText={(text) => setNewUser(text)}
          />
          <Button title="Add User" onPress={addUser} />
        </>
      )}

      {/* Reminder Switch */}
      <View style={switchContainer}>
        <Text style={switchLabel}>Reminder:</Text>
        <Switch
          value={studyPlan.reminder.enabled}
          onValueChange={(value) =>
            handleChange("reminder", { ...studyPlan.reminder, enabled: value })
          }
        />
      </View>

      {/* Reminder Time Picker */}
      {studyPlan.reminder.enabled && (
        <View style={reminderContainer}>
          <Button
            title="Set Reminder Time"
            onPress={() => setShowDatePicker(true)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="datetime"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                handleChange("reminder", {
                  ...studyPlan.reminder,
                  reminder_time: date.toString(),
                });
              }}
            />
          )}
          <View style={dateTimeDisplay}>
            <Text style={dateText}>
              {new Date(studyPlan.reminder.reminder_time).toLocaleDateString()}
            </Text>
            <Text style={timeText}>
              {new Date(studyPlan.reminder.reminder_time).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              )}
            </Text>
          </View>
        </View>
      )}


      {/* Submit Button */}
      <TouchableOpacity onPress={handleSubmit}>
        <View style={buttonStyle}>
          <Text style={{ color: colors.background, fontSize: 18 }}>
            Create Study Plan
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles
const inputStyle = {
  color: "#FFFFFF",
  borderWidth: 1,
  borderColor: colors.gray[600],
  padding: 12,
  borderRadius: 10,
  marginBottom: 20,
};

const switchContainer = {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 20,
};

const switchLabel = {
  color: colors.gray[700],
  fontSize: 16,
  flex: 1,
};

const buttonStyle = {
  backgroundColor: colors.gray[600],
  height: 50,
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 20,
};

const reminderContainer = {
  marginTop: 10,
  marginBottom: 20,
  alignItems: "center",
  justifyContent: "center",
};

const dateTimeDisplay = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
  width: "80%",
  marginTop: 10,
  backgroundColor: colors.gray[200],
  padding: 10,
  borderRadius: 10,
};

const dateText = {
  fontSize: 16,
  color: colors.gray[700],
  marginRight: 10,
};

const timeText = {
  fontSize: 16,
  color: colors.gray[700],
};

export default AddStudyPlan;

/*  const AddStudyPlan = ({navigation, route}) => {
  console.log("add a plan")
  return <></>;
};
export default AddStudyPlan;
/* const studyPlan = {
   title: string, // study plan title, like "History Chapter 2 Study Plan"
   description: string, // overview of the study plan, goals, etc.
   sessions: array, // array of session objects
   tags: array, // tags like "reading", "review", "quiz prep"
   completed: bool, // marks the completion status of the study plan
   subject: { name: string, color: string }, // subject info, similar to tasks
   collaborative: bool, // if the study plan is collaborative
   users: array, // list of users if collaborative
   reminder: {
       enabled: bool,
       reminder_time: string,
   },
   urgent: bool, // flag for urgent study plans
}; */
