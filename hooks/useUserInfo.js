/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {Button, View, Text, Image, TouchableOpacity} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null); // Initially null
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '215067663734-a669q0p4lob60bn6ps13mmn62vj829iu.apps.googleusercontent.com',
    });

    const checkSignInStatus = async () => {
      try {
        const user = await GoogleSignin.getCurrentUser();
        if (user) {
          setUserInfo(user);
        }
      } catch (error) {
        console.error('Error checking sign-in status:', error);
      }
      setLoading(false); // Set loading to false after checking
    };

    checkSignInStatus();
  }, []);

  return {userInfo, loading}; // Return an object with both values
};

export default useUserInfo;
