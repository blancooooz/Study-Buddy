import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Register for push notifications and get Expo Push Token
export async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.error("Push Notification permissions not granted.");
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Expo Push Token:", token);

  // Android-specific configuration
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

// Schedule a notification for a specific time
export async function scheduleNotification(title, body, triggerDate) {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: {
      seconds: Math.ceil((triggerDate.getTime() - Date.now()) / 1000),
    },
  });

  console.log("Scheduled Notification ID:", notificationId);
  return notificationId;
}

// Cancel a specific notification by ID
export async function cancelNotification(notificationId) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
  console.log("Canceled Notification ID:", notificationId);
}

// Cancel all scheduled notifications
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("All scheduled notifications canceled.");
}

// Send an immediate notification
export async function sendImmediateNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null,
  });
  console.log("Immediate notification sent:", title);
}

// Send a reminder for a task or study plan
export async function sendReminder(item) {
  if (!item?.reminder?.enabled) {
    console.warn("Reminder is not enabled for this item.");
    return;
  }

  const reminderTime = new Date(item.reminder.reminderTime);
  if (isNaN(reminderTime.getTime()) || reminderTime < Date.now()) {
    console.error("Invalid or past reminder time.");
    return;
  }

  await scheduleNotification(
    `Reminder: ${item.title}`,
    item.description || "You have a pending task!",
    reminderTime
  );
  console.log(`Reminder scheduled for ${item.title} at ${reminderTime}`);
}
