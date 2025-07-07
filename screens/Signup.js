import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Ellipse} from 'react-native-svg';
import COLORS from '../constants/colors';
import SignupButton from '../components/SignupButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from '@react-native-firebase/auth';
import FlashMessage from '../components/FlashMessage';
import GoogleSignIn from '../components/GoogleSignIn';

const {width, height} = Dimensions.get('window');

export default function Signup({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [flashModal, setFlashModal] = useState(false);
  const [errors, setError] = useState('');

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    const auth = getAuth(); // Get the auth instance

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        updateProfile(user, {
          displayName: name,
        });
        // Send Email Verification
        sendEmailVerification(user)
          .then(() => {
            setFlashModal(true);
          })
          .catch(error => {
            Alert.alert('Error', error.message);
          });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          setError('That email address is already in use!');
        } else if (error.code === 'auth/invalid-email') {
          setError('That email address is invalid!');
        } else {
          Alert.alert('Error', error.message);
        }
      });
  };

  const message = (
    <>
      <Text style={styles.text}>Thanks!{'\n'}Now check your email.</Text>
      <Text style={styles.text2}>
        We have sent an email to{'\n'}
        <Text style={styles.email}>{email}</Text> to verify{'\n'}your account.
      </Text>
    </>
  );

  const handleGoToEmail = () => {
    // Linking.openURL('https://gmail.app.goo.gl');
    setTimeout(() => {
      navigation.replace('Login');
    }, 1000);
  };

  return (
    <>
      {flashModal && (
        <FlashMessage
          message={message}
          email={email}
          type={'info'}
          buttonMsg={'Go to Login'}
          onPress={handleGoToEmail}
        />
      )}

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.imageWrapper}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Sign Up For Free</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <View
            style={
              errors && email === ''
                ? styles.outerBorderError
                : styles.outerBorder
            }>
            <View style={styles.inputWrapper}>
              <Icon
                name="user"
                size={18}
                style={styles.icon}
                color={COLORS.darkBrown}
              />
              <TextInput
                placeholder="Enter your name..."
                style={styles.input}
                keyboardType="default"
                placeholderTextColor="gray"
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                selectionColor={COLORS.orange}
                value={name}
                onChangeText={value => setName(value)}
              />
            </View>
          </View>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <View
            style={
              errors && email === ''
                ? styles.outerBorderError
                : styles.outerBorder
            }>
            <View style={styles.inputWrapper}>
              <Icon
                name="envelope"
                size={18}
                style={styles.icon}
                color={COLORS.darkBrown}
              />
              <TextInput
                placeholder="Enter your email..."
                style={styles.input}
                keyboardType="email-address"
                placeholderTextColor="gray"
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                selectionColor={COLORS.orange}
                value={email}
                onChangeText={value => setEmail(value)}
              />
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View
            style={
              errors && password === ''
                ? styles.outerBorderError
                : styles.outerBorder
            }>
            <View style={styles.inputWrapper}>
              <Icon
                name="lock"
                size={20}
                color={COLORS.darkBrown}
                style={styles.icon}
              />
              <TextInput
                placeholder="Enter your password..."
                style={styles.input}
                keyboardType="password"
                placeholderTextColor="gray"
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                secureTextEntry={!isPasswordVisible}
                maxLength={20}
                selectionColor={COLORS.orange}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Icon
                  name={isPasswordVisible ? 'eye' : 'eye-slash'}
                  size={19}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password Confirmation</Text>
          <View
            style={
              errors && confirmPassword === ''
                ? styles.outerBorderError
                : styles.outerBorder
            }>
            <View style={styles.inputWrapper}>
              <Icon
                name="lock"
                size={20}
                color={COLORS.darkBrown}
                style={styles.icon}
              />

              <TextInput
                placeholder="Confirm your password..."
                style={styles.input}
                secureTextEntry={!isPasswordVisible}
                keyboardType="password"
                placeholderTextColor="gray"
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                maxLength={20}
                selectionColor={COLORS.orange}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Icon
                  name={isPasswordVisible ? 'eye' : 'eye-slash'}
                  size={19}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>
          </View>
          {errors ? (
            <Text style={{color: 'red', marginTop: 5}}>{errors}</Text>
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          <SignupButton title={'Sign Up '} onPress={handleSignUp} />
        </View>

        <View style={styles.separatorWrapper}>
          <View style={styles.horizontalRule} />
          <Text style={styles.separatorText}>Or Sign up with</Text>
          <View style={styles.horizontalRule} />
        </View>

        <GoogleSignIn text={'Sign up with Google'} />

        {/* Bottom Text */}
        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <Text
            style={[styles.bottomText, styles.bottomTextSigin]}
            onPress={() => navigation.replace('Login')}>
            Sign in
          </Text>
        </View>

        <LinearGradient
          style={styles.container}
          colors={['#f7f4f2', '#f7f4f2']}
        />
        {/* Semi-Circle at Bottom */}
        <View style={styles.curveContainer}>
          <Svg
            width={width * 2}
            height={height * 0.57}
            viewBox={`0 0 ${width * 2} ${height * 0.8}`}>
            <Ellipse
              cx={width}
              cy={height * 0.05}
              rx={width * 0.9}
              ry={height * 0.3}
              fill="#3a271b"
            />
          </Svg>
        </View>
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  curveContainer: {
    width: width,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    top: (height / 35) * 3,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  logo: {
    width: 80,
    height: 80,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: (height / 99) * 17,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 22,
  },
  title: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 30,
    color: COLORS.darkBrown,
    zIndex: 999,
  },
  bottomTextContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },

  bottomText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16.5,
    textAlign: 'center',
    color: COLORS.gray,
    marginTop: 20,
  },

  bottomTextSigin: {
    fontFamily: 'Urbanist-Bold',
    color: COLORS.orange,
  },
  inputContainer: {
    marginHorizontal: 26,
    marginTop: 5,
  },
  label: {
    fontSize: 16,
    color: COLORS.darkBrown,
    marginBottom: 5,
    marginTop: 8,
    fontFamily: 'Urbanist-Bold',
  },
  outerBorder: {
    borderWidth: 3,
    borderColor: '#f5cba7',
    borderRadius: 37,
    marginVertical: 1,
  },

  outerBorderError: {
    borderWidth: 3,
    borderColor: '#eb4c34',
    borderRadius: 37,
    marginVertical: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 26,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.orange,
    zIndex: 99999,
    paddingVertical: 3,
  },

  input: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Urbanist-Bold',
    color: COLORS.darkBrown,
    paddingHorizontal: 10,
    textAlignVertical: 'center',
  },

  icon: {
    marginRight: 3,
  },
  separatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
    margin: 'auto',
  },
  horizontalRule: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
    fontFamily: 'Urbanist-Bold',
  },
  email: {
    color: '#FF8C00',
    fontFamily: 'Urbanist-Bold',
  },
  text: {
    fontFamily: 'Urbanist-Bold',
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  text2: {
    fontFamily: 'Urbanist-Regular',
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
});
