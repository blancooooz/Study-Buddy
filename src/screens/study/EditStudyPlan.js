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
import { useDispatch, useSelector } from "react-redux";
import { editStudyPlan } from "../../redux/actions";
import { useTheme } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
const EditStudyPlan = ({ navigation, route }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { planId } = route.params; // Get the plan id from route params
  const studyPlans = useSelector((state) => state.studyPlans);
  const [newUser, setNewUser] = useState(""); // Initialize state for adding a new user

  // Find the study plan by id
  const existingPlan = studyPlans.find((plan) => plan.id === planId) || {
    users: [], // Default users array
  };
  
  // Initialize state with the existing plan
  const [studyPlan, setStudyPlan] = useState({
    ...existingPlan,
    users: existingPlan?.users ?? [], //array
    reminder: {
      ...existingPlan?.reminder,
      enabled: existingPlan?.reminder?.enabled ?? false,
      reminder_time: existingPlan?.reminder?.reminder_time || new Date().toISOString(),
    },
  });
  
  // State for the reminder date picker
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle changes to form inputs
  const handleChange = (name, value) => {
    setStudyPlan((prevPlan) => ({
      ...prevPlan,
      [name]: value,
    }));
  };

  // Handle changes for the checkbox inputs
  const handleCheckboxChange = (name, value) => {
    setStudyPlan((prevPlan) => ({
      ...prevPlan,
      [name]: value,
    }));
  };

  // Save the edited study plan
  const handleSave = () => {
    dispatch(editStudyPlan(planId, studyPlan));
    navigation.goBack();
  };
  
  // Function to add a user
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

  return (
    <ScrollView style={{ padding: 20, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 24, marginBottom: 20, color:theme.colors.text }}>Edit Study Plan</Text>

      {/* Title Input */}
      <TextInput
        style={[inputStyle,{color:theme.colors.text}]}
        placeholder="Title"
        placeholderTextColor={colors.gray[600]}
        value={studyPlan.title}
        onChangeText={(text) => handleChange("title", text)}
      />

      {/* Description Input */}
      <TextInput
        style={[inputStyle,{color:theme.colors.text}]}
        placeholder="Description"
        placeholderTextColor={colors.gray[600]}
        value={studyPlan.description}
        onChangeText={(text) => handleChange("description", text)}
        multiline
      />

      {/* Tags Input */}
      <TextInput
        style={[inputStyle,{color:theme.colors.text}]}
        placeholder="Tags (comma separated)"
        placeholderTextColor={colors.gray[600]}
        value={studyPlan.tags.join(", ")}
        onChangeText={(text) => handleChange("tags", text.split(", "))}
      />

      {/* Subject Name Input */}
      <TextInput
        style={[inputStyle,{color:theme.colors.text}]}
        placeholder="Subject Name"
        placeholderTextColor={colors.gray[600]}
        value={studyPlan.subject.name}
        onChangeText={(text) =>
          handleChange("subject", { ...studyPlan.subject, name: text })
        }
      />

      {/* Urgent Switch */}
      <View style={switchContainer}>
        <Text style={{color:theme.colors.text}}>Urgent:</Text>
        <Switch
          value={studyPlan.urgent}
          onValueChange={(value) => handleCheckboxChange("urgent", value)}
        />
      </View>

      {/* Collaborative Switch */}
      <View style={switchContainer}>
        <Text style={{color:theme.colors.text}}>Collaborative:</Text>
        <Switch
          value={studyPlan.collaborative}
          onValueChange={(value) => handleChange("collaborative", value)}
        />
      </View>

      {/* Conditionally show the Add User section if Collaborative is enabled */}
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

          {/* Display added users */}
          {studyPlan.users.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Added Users:</Text>
              {studyPlan.users.map((user, index) => (
                <Text key={index} style={{ color: colors.gray[500], marginBottom: 5 }}>
                  {user}
                </Text>
              ))}
            </View>
          )}
        </>
      )}


      {/* Reminder Switch */}
<View style={switchContainer}>
  <Text style={{color:theme.colors.text}}>Reminder:</Text>
  <Switch
    value={studyPlan.reminder.enabled}
    onValueChange={(value) =>
      handleChange("reminder", { ...studyPlan.reminder, enabled: value })
    }
  />
</View>

{/* Reminder Time Picker and Display */}
{studyPlan.reminder.enabled && (
  <View style={reminderContainer}>
    {/* Button to open the DateTimePicker */}
    <Button
      title="Change Reminder Time"
      onPress={() => setShowDatePicker(true)}
    />
    {showDatePicker && (
      <DateTimePicker
        value={
          studyPlan.reminder.reminder_time
            ? new Date(studyPlan.reminder.reminder_time)
            : new Date()
        }
        mode="datetime"
        display="default"
        onChange={(event, date) => {
          setShowDatePicker(false);
          if (date) {
            handleChange("reminder", {
              ...studyPlan.reminder,
              reminder_time: date.toISOString(),
            });
          }
        }}
      />
    )}

    {/* Display selected reminder date and time */}
    {studyPlan.reminder.reminder_time && (
      <View style={dateTimeDisplay}>
        {/* Display Date */}
        <Text style={dateText}>
          {new Date(studyPlan.reminder.reminder_time).toLocaleDateString()}
        </Text>
        {/* Display Time */}
        <Text style={timeText}>
          {new Date(studyPlan.reminder.reminder_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    )}
  </View>
)}


      {/* Save Button */}
      <TouchableOpacity onPress={handleSave}>
        <View style={buttonStyle}>
          <Text style={{ color: "#fff", fontSize: 18 }}>Save Changes</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

//Styles
const inputStyle = {
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
  justifyContent: "space-between",
};

const buttonStyle = {
  backgroundColor: colors.gray[600],
  padding: 16,
  borderRadius: 10,
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
};

const timeText = {
  fontSize: 16,
  color: colors.gray[700],
};


export default EditStudyPlan;



/*const EditStudyPlan = ({ navigation, route }) => {
  const {planId}=route.params
  console.log(planId)
  return <></>;
};
export default EditStudyPlan; */
