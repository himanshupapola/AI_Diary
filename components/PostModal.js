import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {overlay, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import useUserInfo from '../hooks/useUserInfo';
import {getAuth} from '@react-native-firebase/auth';
import {createPost, generateUID} from '../utils/supabaseFunctions';
import FlashModal from './FlashModal';

const height = Dimensions.get('window').height;

export default function PostModal({onClose}) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Thoughts');
  const [selectedCategory, setSelectedCategory] = useState('Thoughts');
  const {userInfo} = useUserInfo();
  const auth = getAuth();
  const userEmail = auth.currentUser?.email || userInfo?.user?.email || '';
  const userName = userInfo?.user?.name || auth.currentUser?.displayName;
  const uid = generateUID(userEmail);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleCategorySelect = category => {
    setSelectedCategory(category);
    setCategory(category);
  };

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Content cannot be empty');
      return;
    }

    if (content.trim().length < 40) {
      Alert.alert('Error', 'Content must be at least 40 characters long');
      return;
    }

    await createPost(uid, userName, content, category);

    setContent('');
    setCategory('');
    setSelectedCategory('');
    setShowAnimation(true);
  };

  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <>
      {showAnimation && (
        <FlashModal
          message="Your Post was Successful!"
          lottieFile={require('../assets/lottie/Posted.json')}
          buttonMsg="Okay"
          onPress={() => {
            setShowAnimation(false);
            onClose();
          }}
        />
      )}
      <View style={[styles.overlay, showAnimation ? styles.overlayHide : null]}>
        <Animated.View
          style={[
            styles.modalOuterContainer,
            {transform: [{translateY: slideAnim}]},
          ]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Post</Text>
            <TouchableOpacity onPress={closeModal}>
              <Icon name="times" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.tagsCotainer}>
            <Text style={styles.tagsTitle}>Select Category</Text>

            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tagsScrollView}>
                {[
                  'Thoughts',
                  'Wellness',
                  'Relationships',
                  'Goals',
                  'Memories',
                  'Other',
                ].map(category => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => handleCategorySelect(category)}>
                    <Text
                      style={[
                        styles.scrollViewChilds,
                        selectedCategory === category ? '' : styles.inactiveTag,
                      ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          <View style={styles.modalBody}>
            <TextInput
              style={styles.modalPost}
              placeholder="What's on your mind?"
              placeholderTextColor="#aaa"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              selectionColor="orange"
              cursorColor="orange"
              multiline
              maxLength={500}
              value={content}
              onChangeText={setContent}
            />
          </View>
          <View style={styles.buttonCotainer}>
            <TouchableOpacity style={styles.button} onPress={handlePost}>
              <Text style={styles.text}>Post</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: 0,
    backgroundColor: 'rgba(53, 28, 2, 0.48)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999999,
  },
  overlayHide: {
    display: 'none',
  },
  modalOuterContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '65%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 0.8,
    borderColor: 'lightgrey',
    zIndex: 10000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
  tagsCotainer: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tagsScrollView: {
    padding: 0,
  },
  scrollViewChilds: {
    backgroundColor: '#FE8235',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    color: 'white',
    fontSize: 15,
    fontFamily: 'Urbanist-Bold',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    paddingHorizontal: 10,
    color: 'rgba(32, 17, 2, 0.85)',
    fontFamily: 'Urbanist-Bold',
  },
  modalBody: {
    padding: 15,
    maxHeight: '29%',
  },
  modalPost: {
    color: 'black',
    padding: 5,
    backgroundColor: '#f5f2f2',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    minHeight: '39%',

    marginBottom: 14,
    borderRadius: 15,
    borderColor: 'lightgrey',
    fontFamily: 'Urbanist-Regular',
  },
  tagsTitle: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    marginVertical: 8,
    color: 'grey',
    marginBottom: 18,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a271b',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '50%',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 19,
    fontFamily: 'Urbanist-Bold',
    marginRight: 8,
  },
  buttonCotainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 20,
    left: '0%',
  },
  inactiveTag: {
    backgroundColor: '#F4F2F1',
    color: 'grey',
    fontFamily: 'Urbanist-Bold',
  },
});
