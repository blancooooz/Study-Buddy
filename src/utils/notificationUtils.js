{/*import * as Notifications from "expo-notifications";

// Configure notifications behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request notification permissions
export const registerForPushNotificationsAsync = async () => {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if (status !== "granted") {
    const { status: newStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (newStatus !== "granted") {
      throw new Error("Notification permissions not granted!");
    }
  }
  return (await Notifications.getExpoPushTokenAsync()).data;
};

// Schedule a notification
export const scheduleNotification = async (title, body, triggerDate) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: { date: triggerDate },
  });
};

// Send an immediate notification
export const sendImmediateNotification = async (title, body) => {
  await Notifications.presentNotificationAsync({
    title,
    body,
  });
};
*/}