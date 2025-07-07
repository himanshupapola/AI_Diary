import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Share,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Svg, {Ellipse} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import {launchImageLibrary} from 'react-native-image-picker';
import {getAuth} from '@react-native-firebase/auth';
import useUserInfo from '../../hooks/useUserInfo';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ActivityIndicator} from 'react-native-paper';
import {
  getUserProfile,
  updateUserProfile,
  generateUID,
  updateProfileImageInSupabase,
} from '../../utils/supabaseFunctions';
import uploadToCloudinary from '../../utils/cloudinary';
import COLORS from '../../constants/colors';
import Loading from '../../components/Loading';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GEONAMES_USERNAME = 'himanshu_singh_papol';
const {width, height} = Dimensions.get('window');

export default function Settings({navigation}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState('Male');
  const genderOptions = ['Male', 'Female'];
  const [query, setQuery] = useState('Tokyo, Japan');
  const [profileImage, setProfileImage] = useState(
    require('../../assets/logo.png'),
  );
  const [date, setDate] = useState(new Date(2005, 5, 24));
  const [showPicker, setShowPicker] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const {userInfo, loading} = useUserInfo();
  const [cities, setCities] = useState([]);
  const [loadings, setLoading] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);

  const auth = getAuth();
  const userEmail = auth.currentUser?.email || userInfo?.user?.email || '';

  // Fetch user profile from Supabase
  useEffect(() => {
    if (userEmail) {
      getUserProfile(userEmail).then(userData => {
        if (userData) {
          setSelectedGender(userData.gender || 'Male');
          setQuery(userData.city || 'Tokyo, Japan');
          setDate(
            userData.date ? new Date(userData.date) : new Date(2005, 5, 24),
          );

          setProfileImage(
            userData.profile_picture
              ? {uri: userData.profile_picture}
              : require('../../assets/logo.png'),
          );
        }
        setLoading(false);
      });
    }
    setFirstLoading(true);
  }, [userEmail]);

  const handleSaveProfile = async () => {
    const updatedData = {
      date: date,
      gender: selectedGender,
      city: query,
    };

    const result = await updateUserProfile(userEmail, updatedData);

    if (result.success) {
      setIsEdited(false);
    } else {
      console.error('Failed to update profile.');
    }
  };

  // Google Sign-Out Function
  const signOut = async () => {
    setFirstLoading(false);

    try {
      await AsyncStorage.clear();

      GoogleSignin.signOut().catch(() => {});
      auth.signOut().catch(() => {});
    } catch {}

    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });

    setFirstLoading(true);
  };
  const shareInvite = async () => {
    try {
      const result = await Share.share({
        title: 'Invite to My App',
        message: 'Hey! Check out this amazing app: https://example.com',
      });

      if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      console.error('Error sharing invite:', error);
    }
  };

  function handleEditImage() {
    const uid = generateUID(userEmail);

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
      },
      async response => {
        if (response.didCancel || !response.assets?.length) {
          return;
        }

        const asset = response.assets[0];
        const localUri = asset.uri;
        const fileType = asset.type;
        const fileSize = asset.fileSize; // Size in bytes

        // Set max file size (20MB)
        const MAX_SIZE = 20 * 1024 * 1024;

        if (fileSize > MAX_SIZE) {
          alert('⚠️ Image is too large! Please select an image under 20MB.');
          return;
        }

        const uploadUrl = await uploadToCloudinary(localUri, fileType, uid);

        if (uploadUrl) {
          setProfileImage({uri: uploadUrl});

          await updateProfileImageInSupabase(uid, uploadUrl);
          await AsyncStorage.setItem(`profile_picture_${userEmail}`, uploadUrl);
        } else {
          console.error('❌ Failed to upload image');
        }
      },
    );
  }

  const openDatePicker = () => {
    setShowPicker(true);
  };

  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setIsEdited(true);
    }
  };

  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectGender = gender => {
    setSelectedGender(gender);
    setIsEdited(true);
    setIsDropdownOpen(false);
  };

  const fetchCities = useCallback(
    async text => {
      if (isCitySelected) {
        return;
      }

      setQuery(text);
      setShowSave(true);

      if (text.length < 3) {
        setCities([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `http://api.geonames.org/searchJSON?name_startsWith=${text}&maxRows=3&username=${GEONAMES_USERNAME}&featureClass=P`,
        );
        const data = await response.json();
        if (data.geonames) {
          setCities(data.geonames);
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    },
    [isCitySelected],
  );

  const handleCitySelect = item => {
    const cityName = `${item.name}, ${item.countryName}`;
    setQuery(cityName);
    setCities([]); // Clear dropdown immediately
    setIsCitySelected(true); // Mark that a valid city was selected
    setIsEditing(false);
    setShowSave(false);
    setIsEdited(true);
  };
  return (
    <>
      {firstLoading ? (
        <ScrollView
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
          contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.outerContainer}>
            <LinearGradient
              style={styles.container}
              colors={['#EBE8E6', '#EBE8E6']}
            />
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
                  fill="#3b2111"
                />
              </Svg>
            </View>
            {/* Title */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>Settings</Text>
            </View>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={userInfo?.user?.photo ? profileImage : profileImage}
                style={styles.logo}
              />

              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditImage}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
            {/* Profile Section */}
            <View style={styles.profileContainer}>
              <Text style={styles.name}>
                <Text style={styles.name}>
                  {loading
                    ? 'Loading'
                    : userInfo?.user?.name ||
                      auth.currentUser?.displayName ||
                      'Guest'}
                </Text>
              </Text>
              <Text style={styles.email}>
                {loading
                  ? 'Loading'
                  : userInfo?.user?.email || auth.currentUser?.email || 'Guest'}
              </Text>
            </View>
            {/* Profile Fields */}
            <View style={styles.section}>
              <Text style={styles.label}>Date of Birth</Text>
              <View>
                <View style={styles.inputContainer}>
                  <Icon name="calendar" size={20} color="#412c1f" />
                  <TextInput
                    style={styles.input}
                    value={formatDate(date)}
                    editable={false}
                  />
                  <TouchableOpacity
                    onPress={openDatePicker}
                    style={styles.pencil}
                    hitSlop={{top: 20, bottom: 20, left: 15, right: 10}}>
                    <Icon name="pencil" size={18} color="#412c1f" />
                  </TouchableOpacity>
                </View>
                {showPicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    themeVariant="light"
                    onChange={onChange}
                  />
                )}
              </View>
            </View>
            {isEdited && (
              <TouchableOpacity
                onPress={handleSaveProfile}
                style={styles.floatingButton}>
                <Text style={styles.text}>Save</Text>
              </TouchableOpacity>
            )}
            <View style={styles.section}>
              <Text style={styles.label}>Gender</Text>
              <TouchableOpacity
                onPress={toggleDropdown}
                style={styles.inputContainer}>
                <View>
                  <Icon
                    name={
                      selectedGender === 'Male'
                        ? 'male-outline'
                        : 'female-outline'
                    }
                    size={20}
                    color="#412c1f"
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{position: 'absolute', left: 1, top: 1}}
                  />
                  <Icon
                    name={
                      selectedGender === 'Male'
                        ? 'male-outline'
                        : 'female-outline'
                    }
                    size={20}
                    color="#412c1f"
                  />
                </View>
                <TextInput
                  style={styles.input}
                  value={selectedGender}
                  editable={false}
                />
                <Icon name="chevron-down" size={20} color="#412c1f" />
              </TouchableOpacity>

              {isDropdownOpen && (
                <View style={styles.dropdown}>
                  {genderOptions.map(gender => (
                    <TouchableOpacity
                      key={gender}
                      onPress={() => selectGender(gender)}
                      style={styles.option}>
                      <Text style={styles.gender}>{gender}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Cities */}
            <View style={styles.section}>
              <Text style={styles.label}>Location</Text>

              <TouchableOpacity
                style={styles.container}
                activeOpacity={1}
                onPress={() => {
                  setIsEditing(true);
                  setIsCitySelected(false); // Allow typing after opening
                }}>
                <View style={styles.inputContainer}>
                  <Icon name="location" size={20} color="#412c1f" />

                  <TextInput
                    placeholder="Enter city name"
                    value={query}
                    onChangeText={fetchCities}
                    style={styles.input}
                    editable={isEditing}
                  />

                  {loadings && (
                    <ActivityIndicator size="small" color="#6D4C41" />
                  )}

                  {showSave ? (
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={() => {
                        setIsEditing(false);
                        setShowSave(false);
                      }}>
                      <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                  ) : (
                    <Icon
                      name="chevron-down"
                      size={20}
                      color="#412c1f"
                      onPress={() => {
                        setIsEditing(true);
                        setShowSave(true);
                        setIsCitySelected(false); // Allow re-editing
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>

              {cities.length > 0 && isEditing && !isCitySelected && (
                <FlatList
                  data={cities}
                  keyExtractor={item => item.geonameId.toString()}
                  style={styles.dropdown}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled={true}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.cityItem}
                      onPress={() => handleCitySelect(item)}>
                      <Text style={styles.cityText}>
                        {item.name}, {item.countryName}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>

            {/* Other Options */}
            <TouchableOpacity style={styles.button} onPress={shareInvite}>
              <Icon name="share-social-outline" size={20} color="#412c1f" />
              <Text style={styles.buttonText}>Invite Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => signOut()}>
              <Icon name="log-out-outline" size={20} color="#412c1f" />
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <Loading />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: '#f7f4f2',
    justifyContent: 'flex-start',
    padding: 20,
  },
  pencil: {
    zIndex: 999,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
    zIndex: 999,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    color: 'white',
    fontFamily: 'Urbanist-Bold',
  },
  editText: {
    fontFamily: 'Urbanist-Bold',
    color: '#6b331a',
  },
  logoContainer: {
    marginTop: height * 0.042,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  logo: {
    width: 140,
    height: 140,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 80,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    color: '#412c1f',
    fontFamily: 'Urbanist-Bold',
  },
  email: {
    fontSize: 14,
    color: '#7D7D7D',
    fontFamily: 'Urbanist-Bold',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#4B3425',
    marginBottom: 5,
    fontFamily: 'Urbanist-Bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#6F6064',
    fontFamily: 'Urbanist-Bold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBE8E6',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    fontFamily: 'Urbanist-Regular',
  },
  buttonText: {
    fontSize: 16,
    color: '#412c1f',
    marginLeft: 10,
    fontFamily: 'Urbanist-Bold',
  },
  curveContainer: {
    position: 'absolute',
    top: 0,
    width: width,
    alignItems: 'center',
    zIndex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    zIndex: 9999,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 11,
  },
  gender: {
    color: '#6F6064',
    marginLeft: 10,
    fontFamily: 'Urbanist-Bold',
  },

  cityItem: {
    margin: 2,
  },
  cityText: {
    fontFamily: 'Urbanist-Bold',
    borderBottomColor: '#ccc',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 99999,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.brown,
    justifyContent: 'center',
    alignItems: 'center',

    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});
