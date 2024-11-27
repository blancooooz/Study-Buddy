import React from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import {
  scheduleNotification,
  sendImmediateNotification,
} from "../utils/notificationUtils"; // Import functions

export default function NotificationTestScreen() {
  const testImmediateNotification = () => {
    sendImmediateNotification("Test Notification", "This is a test notification!");
    Alert.alert("Notification Sent", "Check your device for the test notification.");
  };

  const testScheduledNotification = () => {
    const triggerDate = new Date(Date.now() + 5 * 1000); // 5 seconds from now
    scheduleNotification("Scheduled Notification", "This will appear after 5 seconds!", triggerDate);
    Alert.alert("Notification Scheduled", "A notification is scheduled to appear in 5 seconds.");
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
