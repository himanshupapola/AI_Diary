import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import animationData from '../assets/lottie/anime.json';

const FlashMessage = ({
  message,
  type = 'info',
  onDismiss,
  email,
  buttonMsg,
  onPress,
}) => {
  const navigation = useNavigation();

  if (!message) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, styles[type]]}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            source={animationData}
            autoPlay
            loop={false}
            style={styles.lottie}
          />
        </View>
        {message}
        <TouchableOpacity onPress={onPress} style={styles.emailButton}>
          <Text style={styles.emailButtonText}>{buttonMsg}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(53, 28, 2, 0.48)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999999,
  },
  container: {
    width: 320,
    padding: 16,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    elevation: 10,
  },
  lottie: {
    width: 120,
    height: 110,
  },

  emailButton: {
    width: '90%',
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  emailButtonText: {
    color: 'white',
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
  },
});

export default FlashMessage;
