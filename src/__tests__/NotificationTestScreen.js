
import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import {
  registerForPushNotificationsAsync,
  scheduleNotification,
  sendImmediateNotification,
} from '../utils/notificationUtils'; // THIS IS WHERE YOU NEED TO IMPORT YOUR FUNCTIONS FROM notificationUtils.js

export default function NotificationTestScreen({navigation}) {
  const testImmediateNotification = () => {
    sendImmediateNotification('Test Notification', 'This is a test notification!');
    Alert.alert('Notification Sent', 'Check your device for the test notification.');
  };

  const testScheduledNotification = () => {
    const triggerDate = new Date(Date.now() + 5 * 1000); // 5 seconds from now
    scheduleNotification('Scheduled Notification', 'This will appear after 5 seconds!', triggerDate);
    Alert.alert('Notification Scheduled', 'A notification is scheduled to appear in 5 seconds.');
  };

  const testRegisterForNotifications = () => {
    registerForPushNotificationsAsync()
      .then(() => Alert.alert('Push Notifications Enabled'))
      .catch((err) => Alert.alert('Error', err.message));
  };

  return (
    <View style={styles.container}>
      <Button title="Send Immediate Notification" onPress={testImmediateNotification} />
      <Button title="Schedule Notification" onPress={testScheduledNotification} />
      <Button title="Register for Notifications" onPress={testRegisterForNotifications} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});