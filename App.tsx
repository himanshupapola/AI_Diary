/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Welcome, Onboarding, Signup, Login} from './screens/index';
import Home from './screens/main/Home';
import {getAuth, onAuthStateChanged} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Settings from './screens/main/Settings';
import Diary from './screens/main/Diary';
import Community from './screens/main/Community';
import {StyleSheet, TouchableOpacity} from 'react-native';
import IconsHandler from './components/IconHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  requestNotificationPermission,
  setupNotifications,
} from './services/MyFirebaseMessagingService';
import Notifications from './screens/main/Notifications';
import SplashScreen from 'react-native-splash-screen';
// Screens
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarButton: props => (
          <TouchableOpacity {...props} activeOpacity={1} />
        ),
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',

          ...styles.shadow,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <IconsHandler
              focused={focused}
              image={require('./assets/nav/home.png')}
              iconName={undefined}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Diary"
        component={Diary}
        options={{
          tabBarIcon: ({focused}) => (
            <IconsHandler
              focused={focused}
              image={
                focused
                  ? require('./assets/nav/diaryOn.png')
                  : require('./assets/nav/diaryOff.png')
              }
              iconName={undefined}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={Community}
        options={{
          tabBarIcon: ({focused}) => (
            <IconsHandler
              focused={focused}
              image={
                focused
                  ? require('./assets/nav/commuOff.png')
                  : require('./assets/nav/commuOn.png')
              }
              iconName={undefined}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({focused}) => (
            <IconsHandler
              focused={focused}
              image={
                focused
                  ? require('./assets/nav/settingsOn.png')
                  : require('./assets/nav/settingsOff.png')
              }
              iconName={undefined}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarItemStyle: {display: 'none'},
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 200);
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user: any) => {
      setIsLoggedIn(!!user);
    });

    return () => subscriber();
  }, [auth]);

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '215067663734-a669q0p4lob60bn6ps13mmn62vj829iu.apps.googleusercontent.com',
    });

    // Check if user is already signed in
    const checkSignInStatus = async () => {
      try {
        const user = await GoogleSignin.getCurrentUser();
        if (user) {
          setUserInfo(user);
        }
      } catch (error) {
        console.error('Error checking sign-in status:', error);
      }
    };

    checkSignInStatus();
  }, []);

  useEffect(() => {
    const initializeNotifications = async () => {
      const alreadyInitialized = await AsyncStorage.getItem(
        'notifications_initialized',
      );

      if (!alreadyInitialized) {
        const permissionGranted = await requestNotificationPermission();
        if (permissionGranted) {
          await setupNotifications();
          await AsyncStorage.setItem('notifications_initialized', 'true');
        } else {
          console.warn('Notification permission not granted!');
        }
      }
    };

    initializeNotifications();
  }, []);

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn || userInfo ? 'Main' : 'Welcome'}>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  shadow: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7F5DF0',
  },
});

export default App;
