import React from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import LottieView from 'lottie-react-native';
import COLORS from '../constants/colors';

const {width, height} = Dimensions.get('window');

const Loading = () => {
  return (
    <View style={styles.overlay}>
      <LottieView
        source={require('../assets/lottie/anim.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },

  lottie: {
    width: width * 0.5,
    height: width * 0.5,
  },

  loadingText: {
    marginTop: 0,
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.brown,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontStyle: 'italic',
  },
});

export default Loading;
