import {View, StyleSheet, Text, Image} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

export default function Splash() {
  return (
    <LinearGradient
      colors={['rgb(238, 150, 43)', 'rgb(243, 114, 58)']}
      style={styles.container}>
      <View style={styles.content}>
        {/* <Image source={require('../assets/app/icon.png')} style={styles.logo} /> */}
        <LottieView
          source={require('../assets/lottie/laod.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.text}>Ai Diary</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 140,
    resizeMode: 'contain',
  },
  lottie: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 54,
    color: '#fbe9d1',
    fontFamily: 'Urbanist-Bold',
  },
});
