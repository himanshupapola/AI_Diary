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
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Ellipse} from 'react-native-svg';
import COLORS from '../constants/colors';
import SignupButton from '../components/SignupButton';
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import GoogleSignIn from '../components/GoogleSignIn';
import FlashMessage from '../components/FlashMessage';
import Loading from '../components/Loading';
import {RFValue} from 'react-native-responsive-fontsize';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
const {width, height} = Dimensions.get('window');

export default function Login({navigation}) {
  const [email, setEmail] = useState('papolahimanshu.ph@gmail.com');
  const [password, setPassword] = useState('12345678');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [flashModal, setFlashModal] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const handleSignIn = () => {
    setFirstLoading(false);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(response => {
        navigation.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
      })
      .catch(error => {
        if (error.code === 'auth/wrong-password') {
          Alert.alert('Password is not correct!');
        } else {
          Alert.alert('Login failed:', error.message);
        }
      });
    setFirstLoading(true);
  };

  const onForgotPassword = () => {
    if (!email) {
      Alert.alert('Please enter your email first');
      return;
    }

    const auth = getAuth(); // Get the auth instance

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setFlashModal(true);
      })
      .catch(error => {
        console.log('Forgot Password Error:', error);
        Alert.alert('Error', error.message);
      });
  };

  const message = (
    <>
      <Text style={styles.text}>Now check your email.</Text>
      <Text style={styles.text2}>
        We have sent an email to{'\n'}
        <Text style={styles.email}>{email}</Text> to reset your password.
      </Text>
    </>
  );

  return (
    <>
      {!firstLoading ? (
        <>
          {flashModal && (
            <FlashMessage
              message={message}
              email={email}
              type={'info'}
              buttonMsg={'I have reset Password'}
              onPress={() => {
                setFlashModal(false);
              }}
            />
          )}

          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={require('../assets/logo.png')}
                  style={styles.logo}
                />
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>Sign In To AI Diary</Text>
            </View>

            {/* Input Fields */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.outerBorder}>
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
                    selectionColor="#A2B772"
                    value={email}
                    onChangeText={value => setEmail(value)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.outerBorder}>
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
                    selectionColor="#A2B772"
                    value={password}
                    onChangeText={value => setPassword(value)}
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

            <View style={styles.buttonContainer}>
              <SignupButton title={'Sign In'} onPress={handleSignIn} />
            </View>

            <View style={styles.separatorWrapper}>
              <View style={styles.horizontalRule} />
              <Text style={styles.separatorText}>Or Sign in with</Text>
              <View style={styles.horizontalRule} />
            </View>

            <GoogleSignIn text={'Sign in with Google'} />
            {/* Bottom Text */}
            <View style={styles.bottomTextContainer}>
              <Text style={styles.bottomText}>Don't have an account? </Text>
              <Text
                style={[styles.bottomText, styles.bottomTextSigin]}
                onPress={() => navigation.replace('Signup')}>
                Sign Up
              </Text>
            </View>
            <View>
              <Text
                style={[styles.bottomText, styles.bottomTextSigin]}
                onPress={onForgotPassword}>
                Forgot Password
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
      ) : (
        <Loading />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: '#f7f4f2',
    justifyContent: 'flex-start',
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
    marginTop: (height / 99) * 20,
    marginBottom: '25',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 22,
  },
  title: {
    fontFamily: 'Urbanist-Bold',
    fontSize: RFValue(26),
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
    borderColor: '#DCDFCC',
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
    borderColor: '#A2B772',
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
});
