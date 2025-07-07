/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import useUserInfo from '../hooks/useUserInfo';
import {getAuth} from '@react-native-firebase/auth';
import {getUserProfile} from '../utils/supabaseFunctions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Header() {
  const {userInfo} = useUserInfo();
  const auth = getAuth();
  const userEmail = auth.currentUser?.email || userInfo?.user?.email || '';
  const count = '';
  const [profileImage, setProfileImage] = useState(
    require('../assets/logo.png'),
  );
  const navigation = useNavigation();
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const cachedImage = await AsyncStorage.getItem(
          `profile_picture_${userEmail}`,
        );
        if (cachedImage) {
          setProfileImage({uri: cachedImage});
        } else if (userEmail) {
          const userData = await getUserProfile(userEmail);
          if (userData && userData.profile_picture) {
            setProfileImage({uri: userData.profile_picture});
            await AsyncStorage.setItem(
              `profile_picture_${userEmail}`,
              userData.profile_picture,
            );
          }
        }
      } catch (error) {
        console.error('Error fetching or storing user profile:', error);
      }
    };

    fetchProfileImage();
  }, [userEmail]);
  return (
    <>
      {/* TOP Container */}
      <View style={styles.topContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Settings');
          }}>
          <Image source={profileImage} style={styles.logo} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.notifaction}
          onPress={() => {
            navigation.navigate('Notifications');
          }}>
          <Icon name="bell-outline" size={30} color="#f0a63e" />
          {count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  recommendationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  moodTimeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodTimelineText: {
    paddingHorizontal: 6,
    paddingVertical: 5,
    fontFamily: 'Urbanist-Bold',
  },
  selectedBorder: {
    width: '80%',
    height: 2,
    backgroundColor: '#000',
    alignSelf: 'center',
    borderRadius: 2,
  },
  moodContainer: {
    marginTop: 10,
    position: 'relative',
    backgroundColor: '#FFE3B8',
    marginHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'lightgrey',
    outlineWidth: 2,
    outlineColor: 'lightgrey',
  },
  moodTitle: {
    padding: 13,
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
  },
  moodTitleText: {fontFamily: 'Urbanist-Bold'},
  thoughtTitleCotainer: {
    paddingHorizontal: 22,
  },
  moodsText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  mood_1: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFE9C6',
    borderWidth: 1,
    borderRadius: 16,
    borderColor: 'grey',
    fontFamily: 'Urbanist-Bold',
  },
  mood_2: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 16,
    borderColor: 'grey',
    fontFamily: 'Urbanist-Bold',
  },
  moodDay: {
    paddingVertical: 4,
    fontFamily: 'Urbanist-Regular',
  },
  thoughtTitle: {
    color: '#000000',
    fontFamily: 'Urbanist-Bold',
    marginTop: 10,
    fontSize: 19,
  },
  thoughtContainer: {
    marginTop: 10,
    position: 'relative',
    backgroundColor: '#FFE3B8',
    marginHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    height: '18.6%',
    borderColor: 'lightgrey',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  thoughtTextCont: {
    width: '55%',
    paddingHorizontal: 15,
    textAlign: 'center',
    alignSelf: 'flex-start',

    marginLeft: 10,
  },
  thought: {
    color: '#707070',
    fontFamily: 'Urbanist-Bold',
    fontSize: 19,
  },
  thoughtImageCont: {
    position: 'absolute',
    right: '37',
    top: '17.6',
  },
  thoughtImage: {
    width: 80,
    height: 100,
    transform: [{scale: 1.55}],
    tintColor: '#2F5B48',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F4F2',
  },

  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 1,
    paddingHorizontal: 20,
  },
  logo: {
    height: 48,
    width: 48,
    borderWidth: 2,
    borderRadius: 24,
    borderColor: 'white',
    resizeMode: 'cover',
    outlineColor: '#f0a63e',
    outlineWidth: 3,
  },
  notifaction: {
    position: 'relative',
    padding: 10,
  },
  badge: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: '#FF6B00',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Urbanist-Bold',
  },
  titleContainer: {
    paddingHorizontal: 20,
  },
  title: {
    color: '#171B34',
    fontFamily: 'Urbanist-Bold',
    fontSize: 28,
  },
  subTitle: {
    color: '#371B34',
    fontFamily: 'Urbanist-Bold',
    fontSize: 26,
  },
});
