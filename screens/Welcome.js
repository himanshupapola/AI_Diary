import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import GetStartedButton from '../components/GetStartedButton';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
export default function Welcome({navigation}) {
  return (
    <SafeAreaView style={[styles.safeArea, {marginTop: 20}]}>
      <LinearGradient
        style={styles.container}
        colors={[COLORS.white, COLORS.welcomeBackground]}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.imageWrapper}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>
        </View>

        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to the</Text>
          <Text style={styles.subtitle}>AI Diary</Text>
          <Text style={styles.description}>
            Your mindful mental health AI companion{'\n'}
            for everyone, anywhere 🌿
          </Text>
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/welcome/welcome.png')}
            style={styles.bottomImage}
          />
        </View>

        {/* Button */}
        <View style={styles.button}>
          <GetStartedButton onPress={() => navigation.navigate('Onboarding')} />
        </View>

        {/* Bottom Text */}
        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <Text
            style={[styles.bottomText, styles.bottomTextSigin]}
            onPress={() => navigation.navigate('Login')}>
            Sign in
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Logo Styling
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    height: scale(65),
    width: scale(65),
    borderRadius: scale(65),
  },

  // Text Styling
  textContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: verticalScale(20),
  },
  title: {
    fontFamily: 'Urbanist-Bold',
    fontSize: moderateScale(30),
    color: COLORS.darkBrown,
  },
  subtitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: moderateScale(30),
    marginTop: verticalScale(2),
    color: COLORS.brown,
  },
  description: {
    fontFamily: 'Urbanist-Regular',
    fontSize: moderateScale(18.5),
    textAlign: 'center',
    color: COLORS.gray,
    marginTop: verticalScale(20),
  },

  // Bottom Image Styling
  imageContainer: {
    marginTop: verticalScale(30),
    alignItems: 'center',
  },
  bottomImage: {
    width: scale(250),
    height: verticalScale(205),
    resizeMode: 'contain',
  },

  // Button style
  button: {
    marginTop: verticalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomTextContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },

  bottomText: {
    fontFamily: 'Urbanist-Regular',
    fontSize: moderateScale(18.5),
    textAlign: 'center',
    color: COLORS.gray,
    marginTop: verticalScale(20),
  },

  bottomTextSigin: {
    fontFamily: 'Urbanist-Bold',
    color: COLORS.orange,
    textDecorationLine: 'underline',
  },
});
