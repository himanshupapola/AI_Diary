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
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useUserInfo from '../../hooks/useUserInfo';
import {getAuth} from '@react-native-firebase/auth';
import {getUserProfile} from '../../utils/supabaseFunctions';

import DiaryModal from '../../components/DiaryModal';
import Journal from '../../components/Journal';
import Header from '../../components/Header';

export default function DiaryMain() {
  const {userInfo} = useUserInfo();
  const auth = getAuth();
  const userEmail = auth.currentUser?.email || userInfo?.user?.email || '';
  const count = 3;
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);

  const {height} = useWindowDimensions();

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
        <StatusBar barStyle="dark-content" />

        {/* TOP Container */}
        <Header />

        {isPostModalVisible && (
          <DiaryModal
            onClose={() => {
              setIsPostModalVisible(false);
            }}
          />
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Write New Journal</Text>
        </View>

        <View>
          <Journal email={userEmail} modal={isPostModalVisible} />
        </View>
      </SafeAreaView>
      <View>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setIsPostModalVisible(true)}>
          <Image
            source={require('../../assets/post.png')}
            style={styles.images}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F4F2',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
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
  calenderContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 100,
  },
  images: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: 'orange',
  },
});
