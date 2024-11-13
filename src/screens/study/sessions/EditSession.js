import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Button,
  FlatList,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { editSession } from "../../../redux/actions";
import { Linking } from 'react-native';

const EditSession = ({ navigation, route }) => {
  const { sessionId } = route.params;
  const dispatch = useDispatch();
  const theme = useTheme();

  // Fetch study plans from Redux
  const studyPlans = useSelector((state) => state?.studyPlans || []);
  
  // Find the session using sessionId across all study plans
  let session, studyPlanId;
  for (const plan of studyPlans) {
    const foundSession = plan.sessions?.find((s) => s.id === sessionId);
    if (foundSession) {
      session = foundSession;
      studyPlanId = plan.id;
      break;
    }
  }

  // Check if session was found, otherwise show an error
  if (!session) {
    console.error("Session not found with sessionId:", sessionId);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: theme.colors.text }}>Session not found.</Text>
      </View>
    );
  }

  // Initialize state variables for session data
  const [editedSession, setEditedSession] = useState({
    title: session?.title || "",
    description: session?.description || "",
    notes: session?.notes || "",
    tags: Array.isArray(session?.tags) ? session.tags : [], // Ensure tags is an array
    timer: {
      duration: session?.timer?.duration?.toString() || "0",
      intervalCount: session?.timer?.intervalCount?.toString() || "0",
      completedIntervals: session?.timer?.completedIntervals || 0,
    },
    attachments: Array.isArray(session?.attachments) ? session.attachments : [],
  });

  const [newAttachment, setNewAttachment] = useState("");
  
  useEffect(() => {
    if (session) {
      navigation.setOptions({ title: `Edit ${session.title}` });
    }
  }, [session, navigation]);

  // Handle input changes
  const handleChange = (field, value) => {
    setEditedSession((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTimerChange = (field, value) => {
    setEditedSession((prev) => ({
      ...prev,
      timer: {
        ...prev.timer,
        [field]: value,
      },
    }));
  };

  const handleTagsChange = (text) => {
    const tagsArray = text.split(",").map((tag) => tag.trim());
    handleChange("tags", tagsArray);
  };

  const addAttachment = () => {
    if (newAttachment.trim() === "" || !newAttachment.startsWith("http")) {
      alert("Please enter a valid URL that starts with http or https.");
      return;
    }
    setEditedSession((prev) => ({
      ...prev,
      attachments: [...prev.attachments, newAttachment.trim()],
    }));
    setNewAttachment("");
  };

  const openAttachment = (url) => {
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    Linking.openURL(formattedUrl).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const handleSaveSession = () => {
    if (!editedSession.title.trim()) {
      Alert.alert("Error", "Title cannot be empty.");
      return;
    }

    const updatedSession = {
      ...session,
      title: editedSession.title,
      description: editedSession.description,
      notes: editedSession.notes,
      tags: editedSession.tags,
      timer: {
        duration: parseInt(editedSession.timer.duration) || 0,
        intervalCount: parseInt(editedSession.timer.intervalCount) || 0,
        completedIntervals: session?.timer?.completedIntervals || 0,
      },
      attachments: editedSession.attachments,
      updatedAt: new Date().toISOString(),
    };

    dispatch(editSession(studyPlanId, sessionId, updatedSession));
    navigation.goBack();
  };

  return (
    <ScrollView style={{ padding: 20, backgroundColor: theme.colors.background }}>

      <TextInput
        placeholder="Title"
        placeholderTextColor={theme.colors.placeholderText}
        value={editedSession.title}
        onChangeText={(text) => handleChange("title", text)}
        style={{ borderColor: theme.colors.border, borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 20,color:theme.colors.text }}
      />

      <TextInput
        placeholder="Description"
        placeholderTextColor={theme.colors.placeholderText}
        value={editedSession.description}
        onChangeText={(text) => handleChange("description", text)}
        multiline
        style={{ borderColor: theme.colors.border, borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 20,color:theme.colors.text }}
      />

      <TextInput
        placeholder="Notes"
        placeholderTextColor={theme.colors.placeholderText}
        value={editedSession.notes}
        onChangeText={(text) => handleChange("notes", text)}
        multiline
        style={{ borderColor: theme.colors.border, borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 20,color:theme.colors.text }}
      />

      <TextInput
        placeholder="Tags (comma separated)"
        placeholderTextColor={theme.colors.placeholderText}
        value={editedSession.tags.join(", ")}
        onChangeText={handleTagsChange}
        style={{ borderColor: theme.colors.border, borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 20,color:theme.colors.text }}
      />

      <TextInput
        placeholder="Duration (minutes)"
        placeholderTextColor={theme.colors.placeholderText}
        value={editedSession.timer.duration}
        onChangeText={(text) => handleTimerChange("duration", text)}
        keyboardType="numeric"
        style={{ borderColor: theme.colors.border, borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 20,color:theme.colors.text }}
      />

      <TextInput
        placeholder="Intervals"
        placeholderTextColor={theme.colors.placeholderText}
        value={editedSession.timer.intervalCount}
        onChangeText={(text) => handleTimerChange("intervalCount", text)}
        keyboardType="numeric"
        style={{ borderColor: theme.colors.border, borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 20,color:theme.colors.text }}
      />

      <TextInput
        placeholder="Add attachment URL"
        placeholderTextColor={theme.colors.placeholderText}
        value={newAttachment}
        onChangeText={(text) => setNewAttachment(text)}
        style={{ borderColor: theme.colors.border, borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10,color:theme.colors.text }}
      />
      <Button title="Add Attachment" onPress={addAttachment} />

      <TouchableOpacity onPress={handleSaveSession} style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8, alignItems: "center", marginTop: 60,color:theme.colors.text }}>
        <Text style={{ color: "#fff", fontSize: 18 }}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditSession;

