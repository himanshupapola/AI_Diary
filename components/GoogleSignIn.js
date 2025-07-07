import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';

export default function GoogleSignIn({text}) {
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '215067663734-a669q0p4lob60bn6ps13mmn62vj829iu.apps.googleusercontent.com',
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const usrInfo = await GoogleSignin.getCurrentUser();
      setUserInfo(usrInfo);
      if (usrInfo && usrInfo.user) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
      }
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

  return (
    <View style={styles.buttonWrapperGoogle}>
      <TouchableOpacity style={styles.buttonGoogle} onPress={signIn}>
        <Image
          source={require('../assets/google.png')}
          style={styles.imageGoogle}
          resizeMode="contain"
        />
        <Text style={styles.textGoogle}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapperGoogle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    width: 260,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  imageGoogle: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  textGoogle: {
    fontFamily: 'Urbanist-Bold',
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
});
