/* eslint-disable react-native/no-inline-styles */
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Animated,
  Easing,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle} from 'react-native-svg';
import COLORS from '../constants/colors';
import Button from '../components/Button';
import * as Progress from 'react-native-progress';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
const {width, height} = Dimensions.get('window');
const allColors = ['#E4E9D6', '#FFC89E', '#E1E0E0', '#FFEBC2', '#DDD1FF'];
const allDarkerColors = ['#9BB168', '#ED7E1C', '#896B66', '#FFBD1A', '#A694F5'];

const images = [
  require('../assets/onBoarding/1.png'),
  require('../assets/onBoarding/2.png'),
  require('../assets/onBoarding/3.png'),
  require('../assets/onBoarding/4.png'),
  require('../assets/onBoarding/5.png'),
];

const onboardingTexts = [
  {
    main: 'Personalize Your Mental',
    highlight: 'Health State',
    end: ' With AI',
  },
  {
    main: 'Intelligent Mood Tracking',
    highlight: '& AI Emotion ',
    end: 'Insights',
  },
  {main: 'Mental Jurnaling &', highlight: 'AI Response', end: ' bot'},
  {
    main: 'Mindful Resources That',
    highlight: 'Inspire You',
    end: ' Everyday',
  },
  {main: 'Loving & Supportive', highlight: 'Community', end: ''},
];

export default function Onboarding({navigation}) {
  const [step, setStep] = useState(0);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    translateAnim.setValue(20);

    // Start animations when step changes
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, step, translateAnim]);

  const handleNext = () => {
    if (step < images.length - 1) {
      setStep(step + 1);
    } else {
      navigation.navigate('Signup');
    }
  };

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        style={styles.container}
        colors={[allColors[step], allColors[step]]}>
        {/* Semi-Circle at Bottom */}
        <View style={styles.curveContainer}>
          <Svg
            width={420 * 2}
            height={920 * 0.9}
            viewBox={`0 0 ${width * 2} ${height * 0.8}`}>
            <Circle cx={width} cy={height * 0.42} r={width} fill="white" />
          </Svg>
        </View>

        {/* Animated Image */}
        <Animated.View
          style={[
            styles.imageContainer,
            {opacity: fadeAnim, transform: [{translateY: translateAnim}]},
          ]}>
          <Image source={images[step]} style={styles.image} />
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={(step + 1) / images.length} // Normalize progress
            width={width * 0.6}
            color={allDarkerColors[step]}
            unfilledColor="#E0E0E0"
            borderWidth={0}
            height={10}
            borderRadius={10}
          />
        </View>
        {/* Animated Text */}
        <Animated.View
          style={[
            styles.textContainer,
            {opacity: fadeAnim, transform: [{translateY: translateAnim}]},
          ]}>
          <Text style={styles.title}>{onboardingTexts[step].main}</Text>
          <Text style={styles.title}>
            <Text style={{color: allDarkerColors[step]}}>
              {onboardingTexts[step].highlight}
            </Text>
            {onboardingTexts[step].end}
          </Text>
        </Animated.View>

        {/* Button */}
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Button onPress={handleNext} style={styles.buttonPosition} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#6B635C',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  curveContainer: {
    width: width,
    height: height * 0.46,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  imageContainer: {
    position: 'absolute',
    top: verticalScale(675) * 0.03,
    left: width * -0.08,
    zIndex: 1,
  },
  image: {
    width: moderateScale(390,2),
    height: verticalScale(405),
  },
  textContainer: {
    top: verticalScale(180),
    flex: 1,
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  progressContainer: {
    top: verticalScale(430),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  title: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 30,
    color: COLORS.darkBrown,
  },
  buttonPosition: {
    bottom: height * 0.1,
    zIndex: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
