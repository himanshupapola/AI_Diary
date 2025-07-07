/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {listenForNewPosts} from '../../utils/supabaseFunctions';

const MAX_NOTIFICATIONS = 10;

const getFormattedDateTime = () => {
  const now = new Date();
  return (
    now.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }) +
    `, ${now.toLocaleDateString('en-US', {day: 'numeric', month: 'short'})}`
  );
};
export default function Notifications({navigation}) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const subscription = listenForNewPosts(handleNewNotification);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleNewNotification = async notification => {
    const newNotification = {
      ...notification,
      id: `S-${Date.now()}`,
      time: getFormattedDateTime(),
    };

    try {
      const savedNotifications = await AsyncStorage.getItem('notifications');
      const existingNotifications = savedNotifications
        ? JSON.parse(savedNotifications)
        : [];

      const updatedNotifications = [
        newNotification,
        ...existingNotifications.slice(0, MAX_NOTIFICATIONS - 1),
      ];

      await AsyncStorage.setItem(
        'notifications',
        JSON.stringify(updatedNotifications),
      );

      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('❌ Failed to save notification:', error);
    }
  };

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const savedNotifications = await AsyncStorage.getItem('notifications');
        const storedNotifications = savedNotifications
          ? JSON.parse(savedNotifications)
          : [];

        setNotifications(storedNotifications);
      } catch (error) {
        console.error('❌ Failed to load notifications:', error);
      }
    };

    loadNotifications();
  }, []);

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({...n, read: true}));
    setNotifications(updatedNotifications);
    AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = async () => {
    try {
      await AsyncStorage.removeItem('notifications');
      setNotifications([]);
      console.log('🗑️ All notifications cleared');
    } catch (error) {
      console.error('❌ Failed to clear notifications:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.goBackButton}>
          <Icon name="keyboard-backspace" size={27} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notifications</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={markAllAsRead} style={styles.actionButton}>
            <Text style={styles.markRead}>Mark all as read</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={clearAllNotifications}
            style={styles.actionButton}>
            <Text style={styles.clearAll}>Clear all</Text>
          </TouchableOpacity> */}
        </View>
      </View>
      <FlatList
        data={notifications.slice(0, MAX_NOTIFICATIONS)}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              setNotifications(prev =>
                prev.map(n => (n.id === item.id ? {...n, read: true} : n)),
              )
            }
            style={[
              styles.notificationCard,
              {backgroundColor: item.read ? '#F0F0F0' : item.backgroundColor},
            ]}>
            <Image source={{uri: item.image}} style={styles.userImage} />
            <View style={styles.textContainer}>
              <Text style={styles.userName}>{item.user}</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F4F2',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  goBackButton: {
    padding: 8,
    marginRight: 8,
  },
  headerText: {
    fontSize: 21,
    flex: 1,
    fontFamily: 'Urbanist-Bold',
  },
  actionButton: {
    marginLeft: 15,
  },
  markRead: {
    fontSize: 14,
    color: '#f0a63e',
    fontFamily: 'Urbanist-Bold',
  },
  clearAll: {
    fontSize: 14,
    color: '#FF3B30',
    fontFamily: 'Urbanist-Bold',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 0.2,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Urbanist-Bold',
  },
  message: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'Urbanist-Regular',
  },
  time: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Urbanist-Bold',
  },
});
