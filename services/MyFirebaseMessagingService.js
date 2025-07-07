import {getApp} from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  setBackgroundMessageHandler,
  onNotificationOpenedApp,
} from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform, Alert} from 'react-native';

// Initialize Firebase Messaging
const app = getApp();
const messaging = getMessaging(app);

// Request notification permission
export const requestNotificationPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging.requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } else if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return true; // Auto-allow for Android < 13
    }
  } catch (error) {
    console.error('❌ Error requesting notification permission:', error);
    return false;
  }
};

// Get the FCM token
export const getFCMToken = async () => {
  try {
    const token = await getToken(messaging);
    if (token) {
      return token;
    } else {
      console.warn('⚠️ FCM Token is null or undefined');
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching FCM Token:', error);
    return null;
  }
};

// Handle foreground notifications
export const handleForegroundNotifications = () => {
  onMessage(messaging, async remoteMessage => {
    try {
      console.log('📩 Foreground Notification:', remoteMessage);
      if (remoteMessage?.notification) {
        const {title, body} = remoteMessage.notification;
      }
    } catch (error) {
      console.error('❌ Error handling foreground notification:', error);
    }
  });
};

// Handle background and terminated app notifications
export const handleBackgroundNotifications = () => {
  setBackgroundMessageHandler(async remoteMessage => {
    try {
      console.log('📩 Background Notification:', remoteMessage);
      if (remoteMessage?.notification) {
        const {title, body} = remoteMessage.notification;
        if (title && body) {
          console.log(
            `Background Notification - Title: ${title}, Body: ${body}`,
          );
        }
      }
    } catch (error) {
      console.error('❌ Error handling background notification:', error);
    }
  });
};

// Handle notification when app is opened from a notification
export const handleAppOpenedFromNotification = () => {
  onNotificationOpenedApp(remoteMessage => {
    try {
      console.log('📩 App opened by notification:', remoteMessage);
      if (remoteMessage?.notification) {
        const {title, body} = remoteMessage.notification;
        if (title && body) {
          Alert.alert(title, body); // Show notification when app is opened from the notification
        }
      }
    } catch (error) {
      console.error('❌ Error handling opened app from notification:', error);
    }
  });
};

// Setup notifications
export const setupNotifications = async () => {
  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) {
    console.warn('⚠️ Notification permission not granted.');
    return;
  }

  const token = await getFCMToken();
  if (!token) {
    console.warn('⚠️ Failed to get FCM token.');
    return;
  }

  // Register handlers
  handleForegroundNotifications();
  handleBackgroundNotifications();
  handleAppOpenedFromNotification();
};
