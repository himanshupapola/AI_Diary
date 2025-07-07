/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  Platform,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import useUserInfo from '../../hooks/useUserInfo';
import {getAuth} from '@react-native-firebase/auth';
import {getUserProfile} from '../../utils/supabaseFunctions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

export default function DiaryDetails({route}) {
  const [isDisabled, setIsDisabled] = useState(false);
  const {userInfo} = useUserInfo();
  const auth = getAuth();
  const userEmail = auth.currentUser?.email || userInfo?.user?.email || '';
  const [profileImage, setProfileImage] = useState(
    require('../../assets/logo.png'),
  );
  const {height} = useWindowDimensions();
  const {emoji, date, title, content} = route.params;
  const navigation = useNavigation();
  const userMessage = content;
  const [aiResponse, setAiResponse] = useState('Hold on, we’re thinking...');

  const messages = [
    {id: '1', text: userMessage, sender: 'bot', time: date},
    {
      id: '2',
      text: aiResponse,
      sender: 'user',
      time: 'Now',
    },
  ];

  const url = 'https://aidiary-7ffb773d9a93.herokuapp.com/generate_response';

  const fetchResponse = useCallback(async () => {
    try {
      const postData = {entry: content};
      let response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(postData),
      });

      let data = await response.json();

      if (data.response.trim().toLowerCase() === 'safe') {
        console.log('Retrying request...');
        response = await fetch(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(postData),
        });
        data = await response.json();
      }

      setAiResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      setAiResponse('Error fetching response.');
    } finally {
    }
  }, [content]);

  useEffect(() => {
    if (content) {
      fetchResponse();
    }
  }, [content, fetchResponse]);

  useEffect(() => {
    if (userEmail) {
      getUserProfile(userEmail)
        .then(userData => {
          if (userData && userData.profile_picture) {
            setProfileImage({uri: userData.profile_picture});
          }
        })
        .catch(error => console.error('Error fetching user profile:', error));
    }
  }, [userEmail]);

  return (
    <>
      <SafeAreaView
        style={[
          styles.safeArea,
          {
            paddingTop:
              Platform.OS === 'android'
                ? StatusBar.currentHeight || height * 0.05
                : 0,
          },
        ]}>
        <View style={{flex: 1, backgroundColor: '#F7F4F2'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 7,
              borderBottomWidth: 0.6,
              borderColor: 'lightgrey',
              borderTopWidth: 0.6,
            }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{padding: 10}}>
              <Icon name="arrow-left-thin" size={30} color="black" />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 10,
              }}>
              <Image
                source={require('../../assets/smriti.png')}
                style={styles.logo}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Urbanist-Bold',
                  marginLeft: 10,
                }}>
                Smriti AI
              </Text>
            </View>
          </View>
          <ImageBackground
            source={require('../../assets/diary.png')}
            style={{flex: 1}}
            resizeMode="cover">
            <FlatList
              data={messages}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <View
                  style={{
                    alignSelf:
                      item.sender === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor:
                      item.sender === 'user'
                        ? 'rgba(52, 211, 153, 0.72)'
                        : 'rgba(236, 127, 31, 0.71)',
                    padding: 18,
                    paddingHorizontal: 20,
                    marginTop: 20,
                    maxWidth: '80%',
                    textAlign: 'left',
                    borderTopRightRadius: item.sender === 'user' ? 0 : 40,
                    borderBottomRightRadius: item.sender === 'user' ? 0 : 40,
                    borderTopLeftRadius: item.sender === 'user' ? 40 : 0,
                    borderBottomLeftRadius: item.sender === 'user' ? 40 : 0,
                    fontFamily: 'Urbanist-Regular',
                  }}>
                  <Text
                    style={{
                      color:
                        item.sender === 'user'
                          ? 'white'
                          : 'rgba(0, 0, 0, 0.77)',
                      fontSize: 16,
                      fontFamily: 'Urbanist-Bold',
                    }}>
                    {item.text}
                  </Text>
                </View>
              )}
            />
            <View style={styles.wrapper}>
              <TouchableOpacity
                style={[
                  styles.regenButton,
                  isDisabled && styles.disabledButton,
                ]}
                onPress={
                  isDisabled
                    ? null
                    : async () => {
                        setIsDisabled(true);
                        await fetchResponse();
                      }
                }
                disabled={isDisabled}>
                <View style={styles.buttonContent}>
                  <Icon name="refresh-circle" size={20} color="white" />
                  <Text style={styles.regenText}> Regenerate</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                textAlign: 'center',
                color: 'gray',
                marginTop: 10,
                fontFamily: 'Urbanist-Bold',
              }}>
              {date}
            </Text>
          </ImageBackground>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F4F2',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 25 : 0,
  },

  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
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
  disabledButton: {
    backgroundColor: '#A0A0A0', // Change color when disabled
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
    marginBottom: 10,
  },
  title: {
    color: '#171B34',
    fontFamily: 'Urbanist-Bold',
    fontSize: 26,
    marginTop: 4,
    marginBottom: 8,
  },

  wrapper: {
    alignItems: 'center',
  },
  regenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 13,
    borderRadius: 10,
    width: '50%',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'lightgrey',
  },
  buttonContent: {
    flexDirection: 'row',
  },
  regenText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
    fontFamily: 'Urbanist-Bold',
  },
});
