import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';

import {Button, View, Text, Image, TouchableOpacity} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';


const GoogleLogin = ({text}) => {
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

  // Google Sign-In Function
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const usrInfo = await GoogleSignin.signIn();
      setUserInfo(usrInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.error('Some other error happened:', error);
      }
    }
  };

  // Google Sign-Out Function
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut(); // Sign out from Firebase
      setUserInfo(null); // Reset state
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {userInfo ? (
        <>
          <Text>{userInfo.user.name}</Text>
          <Text>{userInfo.user.email}</Text>
          <Image
            source={{uri: userInfo.user.photo}}
            style={{width: 100, height: 100, borderRadius: 50}}
          />
          <TouchableOpacity
            onPress={signOut}
            style={{padding: 20, borderWidth: 1, marginTop: 30}}>
            <Text>Sign out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          onPress={signIn}
          style={{padding: 20, borderWidth: 1}}>
          <Text>{text}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default GoogleLogin;
