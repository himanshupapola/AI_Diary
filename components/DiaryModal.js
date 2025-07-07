/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import useUserInfo from '../hooks/useUserInfo';
import {getAuth} from '@react-native-firebase/auth';
import {createDiaryEntry} from '../utils/supabaseFunctions';
import {format, subDays, isToday} from 'date-fns';
import FlashModal from './FlashModal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Emoji from './EmojiCard';

const height = Dimensions.get('window').height;

export default function DiaryModal({onClose}) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const {userInfo} = useUserInfo();
  const auth = getAuth();
  const userEmail = auth.currentUser?.email || userInfo?.user?.email || '';
  const [showAnimation, setShowAnimation] = useState(false);
  const slideAnim = useRef(new Animated.Value(500)).current;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState('neutral');

  const moods = [
    {mood: 'Very Sad', color: '#FFB6A6'},
    {mood: 'Sad', color: '#FFCF55'},
    {mood: 'Neutral', color: '#FFF731'},
    {mood: 'Happy', color: '#00FFFF'},
    {mood: 'Very Happy', color: '#00FF94'},
  ];

  const handlePost = async () => {
    if (!content.trim() || !title.trim()) {
      Alert.alert('Error', "Content and Title can't be empty");
      return;
    }

    if (content.trim().length < 40) {
      Alert.alert('Error', 'Content must be at least 20 characters long');
      return;
    }

    await createDiaryEntry(
      userEmail,
      title,
      content,
      selectedMood,
      format(new Date(), 'yyyy-MM-dd'),
    );

    setContent('');
    setTitle('');
    setShowAnimation(true);
  };

  const getPastDays = numDays => {
    return Array.from({length: numDays}, (_, i) =>
      subDays(new Date(), i),
    ).reverse();
  };

  const pastDays = getPastDays(15);

  const handlePrev = () => {
    const currentIndex = pastDays.findIndex(
      date => format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'),
    );
    if (currentIndex > 0) {
      setSelectedDate(pastDays[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (
      format(selectedDate, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
    ) {
      const currentIndex = pastDays.findIndex(
        date =>
          format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'),
      );
      setSelectedDate(pastDays[currentIndex + 1]);
    }
  };

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
          message="Your Entery was Successful!"
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
            <Text style={styles.modalTitle}>Add Memories</Text>
            <TouchableOpacity onPress={closeModal}>
              <Icon name="times" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.daySelector}>
            <View style={styles.dayContainer}>
              <TouchableOpacity
                onPress={handlePrev}
                disabled={selectedDate <= pastDays[0]}>
                <FontAwesome
                  name="chevron-left"
                  size={18}
                  color={selectedDate > pastDays[0] ? 'black' : 'gray'}
                />
              </TouchableOpacity>

              <View style={styles.day}>
                <FontAwesome name="calendar" size={18} color="black" />
                <Text style={styles.dayText}>
                  {isToday(selectedDate)
                    ? 'Today'
                    : format(selectedDate, 'MMMM dd')}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleNext}
                disabled={
                  format(selectedDate, 'yyyy-MM-dd') ===
                  format(new Date(), 'yyyy-MM-dd')
                }>
                <FontAwesome
                  name="chevron-right"
                  size={18}
                  color={
                    format(selectedDate, 'yyyy-MM-dd') !==
                    format(new Date(), 'yyyy-MM-dd')
                      ? 'black'
                      : 'gray'
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.title}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.titleText}
              placeholder="Headline"
              placeholderTextColor="#aaa"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              selectionColor="orange"
              cursorColor="orange"
              maxLength={200}
            />
          </View>

          <View style={styles.modalBody}>
            <ScrollView
              style={{maxHeight: 350}} // Ensures a scrollable area
              keyboardShouldPersistTaps="handled">
              <TextInput
                style={styles.modalPost}
                placeholder="Start typing..."
                placeholderTextColor="#aaa"
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                selectionColor="orange"
                cursorColor="orange"
                multiline
                maxLength={1200}
                value={content}
                onChangeText={setContent}
                scrollEnabled
                textAlignVertical="top"
              />
            </ScrollView>
          </View>

          <View style={styles.outerMood}>
            <View style={styles.moodBox}>
              {moods.map(({mood, color}) => (
                <TouchableOpacity
                  key={mood}
                  activeOpacity={1}
                  onPress={() => setSelectedMood(mood)}
                  style={[
                    styles.moodContainer,
                    {backgroundColor: color},
                    selectedMood === mood && styles.selectedMood,
                  ]}>
                  <Emoji mood={mood} backgroundColor={'orange'} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonCotainer}>
            <TouchableOpacity style={styles.button} onPress={handlePost}>
              <Text style={styles.text}>Save</Text>
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
    backgroundColor: '#f6f3f1',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '99.999%',
    zIndex: 10000,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 25,
    borderBottomWidth: 0.2,
    borderColor: 'lightgrey',
  },

  modalTitle: {
    fontSize: 22,
    paddingHorizontal: 10,
    color: '#fffff',
    fontFamily: 'Urbanist-Bold',
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 7,
    width: '97%',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 19,
    fontFamily: 'Urbanist-Bold',
    marginRight: 8,
  },
  buttonCotainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 18,

    backgroundColor: 'white',
    borderRadius: 10,
  },
  day: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  dayText: {
    fontSize: 18,
    fontFamily: 'Urbanist-Regular',
    marginLeft: 10,
  },
  daySelector: {
    padding: 20,
  },
  modalBody: {
    paddingHorizontal: 20,
  },
  modalPost: {
    minHeight: height,
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
  },
  title: {
    paddingHorizontal: 20,
  },
  titleText: {
    backgroundColor: 'white',
    fontFamily: 'Urbanist-Bold',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f3f1',
    paddingHorizontal: 25,
    paddingVertical: 5,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    fontSize: 16,
  },
  moodContainer: {
    borderWidth: 2,
    paddingVertical: 8,
    borderRadius: 3,
  },
  selectedMood: {
    outlineColor: 'orange',
    outlineWidth: 3.5,
  },
  moodBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#f5f3f1',
    outlineWidth: 1,
    outlineColor: '#f9f3f1',
    paddingHorizontal: 4,
    justifyContent: 'space-evenly',
  },

  outerMood: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
