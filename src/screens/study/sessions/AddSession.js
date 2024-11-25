import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import { addSession } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import { Linking } from 'react-native';


const AddSession = ({ navigation, route }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { planId } = route.params;

  // State for the new session
  const [session, setSession] = useState({
    id: uuidv4(),
    title: "",
    description: "",
    notes: "",
    tags: [],
    timer: { duration: "", intervalCount: "", completedIntervals: 0 },
    attachments: [],
    completed: false,
  });

  const [newAttachment, setNewAttachment] = useState("");

  // Handle input changes
  const handleChange = (field, value) => {
    setSession((prevSession) => ({
      ...prevSession,
      [field]: value,
    }));
  };

  const handleTimerChange = (field, value) => {
    setSession((prevSession) => ({
      ...prevSession,
      timer: {
        ...prevSession.timer,
        [field]: value,
      },
    }));
  };

  // Handle adding tags
  const handleTagsChange = (text) => {
    const tagsArray = text.split(",").map((tag) => tag.trim());
    handleChange("tags", tagsArray);
  };

  // Function to handle adding a new attachment
  const openAttachment = (url) => {
    if (!url || !url.trim()) {
      alert("No URL provided.");
      return;
    }
  
    // Ensure the URL starts with "http://" or "https://"
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
  
    Linking.canOpenURL(formattedUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(formattedUrl).catch((err) =>
            console.error("Failed to open URL:", err)
          );
        } else {
          alert("Invalid or unsupported link.");
        }
      })
      .catch((err) => {
        console.error("An error occurred:", err);
        alert("An error occurred while trying to open the link.");
      });
  };
  


  // Function to handle adding a session
  const handleSubmit = () => {
    if (session.title.trim() === "") {
      alert("Please enter a title for the session");
      return;
    }
    dispatch(addSession(planId, session));
    navigation.goBack();
  };

  //Function to open attachment 
  const addAttachment = () => {
    if (newAttachment.trim() === "" || !newAttachment.startsWith("http")) {
      alert("Please enter a valid URL that starts with http or https.");
      return;
    }
    setSession((prevSession) => ({
      ...prevSession,
      attachments: [...prevSession.attachments, newAttachment.trim()],
    }));
    setNewAttachment("");
  };

  return (
    <ScrollView style={{ padding: 20, backgroundColor: theme.colors.background }}>

      {/* Title Input */}
      <TextInput
        style={[inputStyle,{color:theme.colors.text}]}
        placeholderTextColor={theme.colors.placeholderText}
        placeholder="Title"
        value={session.title}
        onChangeText={(text) => handleChange("title", text)}
      />

      {/* Description Input */}
      <TextInput
        style={[inputStyle,{color:theme.colors.text}]}
        placeholderTextColor={theme.colors.placeholderText}
        placeholder="Description"
        value={session.description}
        onChangeText={(text) => handleChange("description", text)}
        multiline
      />

      {/* Notes Input */}
      <TextInput
        style={[inputStyle,{color:theme.colors.text}]}
        placeholderTextColor={theme.colors.placeholderText}
        placeholder="Notes"
        value={session.notes}
        onChangeText={(text) => handleChange("notes", text)}
        multiline
      />

      {/* Tags Input */}
      <TextInput
        style={[inputStyle, { marginBottom: 35,color:theme.colors.text }]}  // Increased margin to 30 for extra space
        placeholderTextColor={theme.colors.placeholderText}
        placeholder="Tags (comma separated)"
        value={session.tags.join(", ")}
        onChangeText={handleTagsChange}
      />


      {/* Timer Duration Input */}
      <Text style={labelStyle}>Session Duration:</Text>
      <TextInput
        style={[inputStyle,{color:theme.colors.text}]}
        placeholderTextColor={theme.colors.placeholderText}
        placeholder="Enter duration in minutes"
        keyboardType="numeric"
        value={session.timer.duration.toString()}
        onChangeText={(text) => handleTimerChange("duration", text)}
      />

      {/* Interval Count Input */}
      <Text style={labelStyle}>Number of Intervals:</Text>
      <TextInput
        style={[inputStyle, {marginBottom: 35,color:theme.colors.text}]}
        placeholderTextColor={theme.colors.placeholderText}
        placeholder="Enter number of intervals"
        keyboardType="numeric"
        value={session.timer.intervalCount.toString()}
        onChangeText={(text) => handleTimerChange("intervalCount", text)}
      />

       {/* Attachments Input */}
       <Text style={labelStyle}>Attachments:</Text>
      <TextInput
        style={[inputStyle, {marginBottom: 5, color:theme.colors.text}]}
        placeholderTextColor={theme.colors.placeholderText}
        placeholder="Enter link"
        value={newAttachment}
        onChangeText={(text) => setNewAttachment(text)}
      />

      <Button title="Add Attachment" onPress={addAttachment} />

      {/* Display Added Attachments */}
      {session.attachments.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={labelStyle}>Added Attachments:</Text>
          <FlatList
            data={session.attachments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => openAttachment(item)}
                style={{
                  marginBottom: 10,
                  backgroundColor: "#f0f0f0",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.primary,
                    textDecorationLine: "underline",
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}


      {/* Submit Button */}
      <TouchableOpacity onPress={handleSubmit} style={[buttonStyle,{backgroundColor:theme.colors.primary}]}>
        <Text style={{ color: 'black', fontSize: 18 }}>Add Session</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles 
const inputStyle = {
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 12,
  borderRadius: 10,
  marginBottom: 20,
  height: 40,
};

const labelStyle = {
  fontSize: 16,
  marginBottom: 1,
  color: "#666",
};

const buttonStyle = {
  padding: 16,
  borderRadius: 10,
  alignItems: "center",
  marginTop: 40,
};


export default AddSession;





/*const AddSession = ({ navigation, route }) => {
  const {planId}=route.params
  console.log(planId)
  return <></>;
};
export default AddSession;
 const session = {
   title: string, // title like "Section 1: Introduction"
   description: string, // session-specific goals and topics
   notes: string, // optional notes section
   tags: array, // array of tags for organization like "reading", "review"
   timer: {
       duration: number, // session duration in minutes for Pomodoro
       intervalCount: number, // number of intervals per session
       completedIntervals: number, // intervals completed
   },
   attachments: array, // links or file paths for resources like images, PDFs, etc.
   completed: bool, // marks if the session is completed
}; */
