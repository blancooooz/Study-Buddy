import React from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import {
  scheduleNotification,
  sendImmediateNotification,
} from "../utils/notificationUtils"; // Import functions

export default function NotificationTestScreen() {
  const testImmediateNotification = async () => {
    try {
      await sendImmediateNotification("Test Notification", "This is a test notification!");
      Alert.alert("Notification Sent", "Check your device for the test notification.");
    } catch (error) {
      console.error("Failed to send immediate notification:", error);
      Alert.alert("Error", "Failed to send immediate notification.");
    }
  };

  const testScheduledNotification = async () => {
    try {
      const triggerDate = new Date(Date.now() + 5 * 1000); // 5 seconds from now
      await scheduleNotification("Scheduled Notification", "This will appear after 5 seconds!", triggerDate);
      Alert.alert("Notification Scheduled", "A notification is scheduled to appear in 5 seconds.");
    } catch (error) {
      console.error("Failed to schedule notification:", error);
      Alert.alert("Error", "Failed to schedule notification.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Send Immediate Notification" onPress={testImmediateNotification} />
      <Button title="Schedule Notification" onPress={testScheduledNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
