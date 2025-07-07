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
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useUserInfo from '../../hooks/useUserInfo';
import {getAuth} from '@react-native-firebase/auth';
import {fetchDiaryEmojis, saveFCMToken} from '../../utils/supabaseFunctions';
import RecommendationCard from '../../components/RecommendationCard';
import {format, parseISO, isToday, isYesterday, subDays} from 'date-fns';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getFCMToken} from '../../services/MyFirebaseMessagingService';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
const QUOTE_KEY = 'cachedQuote';
const TIMESTAMP_KEY = 'quoteTimestamp';
const EXPIRY_TIME = 12 * 60 * 60 * 1000;
const {height} = Dimensions.get('window');
export default function HomeMain() {
  const {height} = useWindowDimensions();
  const {userInfo} = useUserInfo();
  const auth = getAuth();
  const userEmail = auth.currentUser?.email || userInfo?.user?.email || '';
  const name = userInfo?.user?.name || auth.currentUser?.displayName || 'Guest';
  const count = 3;
  const [quote, setQuote] = useState(
    'It is better to conquer yourself than to win a thousand battles',
  );
  const [isLoading, setIsLoading] = useState(true);
  const [moodSummary, setMoodSummary] = useState('Daily');

  const [diaryEntries, setDiaryEntries] = useState([]);

  const navigation = useNavigation();
  const moodEmojis = {
    'Very Sad': '😢',
    Sad: '😞',
    Neutral: '😐',
    Happy: '😊',
    'Very Happy': '😁',
  };

  const moodValues = {
    'Very Sad': 1,
    Sad: 2,
    Neutral: 3,
    Happy: 4,
    'Very Happy': 5,
  };

  // Get today’s and yesterday’s mood
  const todayEntry = diaryEntries[0] || {mood: 'Neutral', displayDate: 'Today'};
  const dayBeforeEntry = diaryEntries[1] || {
    mood: 'Neutral',
    displayDate: 'Yesterday',
  };

  const formattedTodayMood = todayEntry.mood.toLowerCase();
  const formattedDayBeforeMood = dayBeforeEntry.mood.toLowerCase();

  const moodEmojiToday = moodEmojis[todayEntry.mood] || '😐';
  const moodEmojiBefore = moodEmojis[dayBeforeEntry.mood] || '😐';

  const today = new Date();
  const lastWeekStart = subDays(today, 7);
  const weekBeforeStart = subDays(today, 14);

  const getAverageMood = (startDate, endDate) => {
    const filteredMoods = diaryEntries
      .filter(({parsedDate}) => parsedDate >= startDate && parsedDate < endDate)
      .map(({mood}) => moodValues[mood]);

    if (filteredMoods.length === 0) {
      return 'Neutral';
    }

    const avgMoodValue = Math.round(
      filteredMoods.reduce((a, b) => a + b, 0) / filteredMoods.length,
    );

    const avgMood = Object.keys(moodValues).find(
      mood => moodValues[mood] === avgMoodValue,
    );

    return avgMood || 'Neutral';
  };

  const currentWeekMood = getAverageMood(lastWeekStart, today);
  const pastWeekMood = diaryEntries.some(
    ({parsedDate}) => parsedDate < lastWeekStart,
  )
    ? getAverageMood(weekBeforeStart, lastWeekStart)
    : 'No Data';

  const formattedCurrentWeekMood = currentWeekMood.toLowerCase();
  const formattedPastWeekMood =
    pastWeekMood === 'No Data' ? 'No data' : pastWeekMood.toLowerCase();

  const moodEmojiCurrentWeek = moodEmojis[currentWeekMood] || '😐';
  const moodEmojiPastWeek =
    pastWeekMood === 'No Data' ? '😐' : moodEmojis[pastWeekMood] || '😐';

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 4 && hour < 12) {
      return 'Good Morning,';
    } else if (hour >= 12 && hour < 16) {
      return 'Good Afternoon,';
    } else if (hour >= 16 && hour < 21) {
      return 'Good Evening,';
    } else {
      return 'Good Night,';
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchDiaryEmojis(userEmail).then(entries => {
        const formattedEntries = entries.map(([mood, date]) => {
          const parsedDate = parseISO(date);

          let displayDate;
          if (isToday(parsedDate)) {
            displayDate = 'Today';
          } else if (isYesterday(parsedDate)) {
            displayDate = 'Yesterday';
          } else {
            displayDate = format(parsedDate, 'd MMMM');
          }

          return {mood, displayDate, parsedDate};
        });

        setDiaryEntries(formattedEntries);
      });
    }
  }, [userEmail]);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const storedQuote = await AsyncStorage.getItem(QUOTE_KEY);
        const storedTimestamp = await AsyncStorage.getItem(TIMESTAMP_KEY);
        const currentTime = Date.now();

        // If quote exists and is still valid (within 12 hours), use it
        if (
          storedQuote &&
          storedTimestamp &&
          currentTime - parseInt(storedTimestamp) < EXPIRY_TIME
        ) {
          setQuote(storedQuote);
        } else {
          // Fetch new quote
          const response = await fetch(
            'http://api.quotable.io/random?maxLength=65',
          );
          const data = await response.json();

          setQuote(data.content);

          // Store the new quote and timestamp in AsyncStorage
          await AsyncStorage.setItem(QUOTE_KEY, data.content);
          await AsyncStorage.setItem(TIMESTAMP_KEY, currentTime.toString());
        }
      } catch (error) {
        setQuote(
          'It is better to conquer yourself than to win a thousand battles',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, []);

  useEffect(() => {
    const saveTokenOnce = async () => {
      const tokenSaved = await AsyncStorage.getItem('fcm_token_saved');

      if (!tokenSaved) {
        const token = await getFCMToken();
        if (token) {
          const result = await saveFCMToken(userEmail, token);
          if (result.success) {
            await AsyncStorage.setItem('fcm_token_saved', 'true');
          }
        }
      }
    };

    saveTokenOnce();
  }, [userEmail]);

  const getUserCountry = async () => {
    try {
      const response = await fetch('http://ip-api.com/json');
      const data = await response.json();
      return data.countryCode; // Example: "IN" for India
    } catch (error) {
      console.error('Error fetching country:', error);
      return 'US'; // Default fallback
    }
  };

  const handleNavigation = async screenName => {
    const userCountry = await getUserCountry(); // Fetch country first
    navigation.navigate(String(screenName), {
      mood: formattedTodayMood,
      country: userCountry,
    });
  };

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

        <Header />

        {/* Title  */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{getGreeting()}</Text>
          <Text style={styles.subTitle}>{name}!</Text>
        </View>
        <ScrollView
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
          contentContainerStyle={styles.scrollViewContainer}>
          {/* Thought Title */}
          <View style={styles.thoughtTitleCotainer}>
            <Text style={styles.thoughtTitle}>Thought of the Day,</Text>
          </View>

          {/* Thought of the day */}
          <View style={styles.thoughtContainer}>
            <View style={styles.thoughtTextCont}>
              <Text style={styles.thought}>
                {isLoading ? 'Loading wisdom...' : `“${quote}”`}
              </Text>
            </View>
            <View style={styles.thoughtImageCont}>
              <Image
                source={require('../../assets/app/thought.png')}
                style={styles.thoughtImage}
              />
            </View>
          </View>

          {/* Thought of the day */}
          <View style={styles.moodContainer}>
            <View style={styles.moodTitle}>
              <Text style={styles.moodTitleText}>My Mood</Text>
            </View>

            <View style={styles.moodTimeline}>
              <TouchableOpacity onPress={() => setMoodSummary('Daily')}>
                <Text style={styles.moodTimelineText}>Daily</Text>
                {moodSummary === 'Daily' && (
                  <View style={styles.selectedBorder} />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setMoodSummary('Weekly')}>
                <Text style={styles.moodTimelineText}>Weekly</Text>
                {moodSummary === 'Weekly' && (
                  <View style={styles.selectedBorder} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.moodsText}>
              {moodSummary === 'Daily' ? (
                // Show Daily Mood
                <>
                  <Text style={styles.mood_1}>
                    {moodEmojiToday} You've felt {formattedTodayMood} mostly
                  </Text>
                  <Text style={styles.moodDay}>{todayEntry.displayDate}</Text>
                  <Text style={styles.mood_2}>
                    {moodEmojiBefore} You were feeling {formattedDayBeforeMood}
                  </Text>
                  <Text style={styles.moodDay}>
                    {dayBeforeEntry.displayDate}
                  </Text>
                </>
              ) : (
                // Show Weekly Mood
                <>
                  <Text style={styles.mood_1}>
                    {moodEmojiCurrentWeek} Your average mood this week is{' '}
                    {formattedCurrentWeekMood}
                  </Text>
                  <Text style={styles.moodDay}>This Week</Text>
                  <Text style={styles.mood_2}>
                    {moodEmojiPastWeek} Your mood last week was{' '}
                    {formattedPastWeekMood}
                  </Text>
                  <Text style={styles.moodDay}>Last Week</Text>
                </>
              )}
            </View>
          </View>

          {/* Title  */}
          <View style={[styles.thoughtTitleCotainer]}>
            <Text style={styles.thoughtTitle}>For better you!</Text>
          </View>

          <View style={styles.recommendationContainer}>
            <RecommendationCard
              title="Book Recommendation"
              subtitle="From Bestsellers"
              buttonText="Read"
              onPress={() => handleNavigation('BookRecommendation')}
              color="#FFE3B8"
            />
            <RecommendationCard
              title="Song Recommendation"
              subtitle="Mood Based"
              buttonText="Listen"
              onPress={() => handleNavigation('SongRecommendation')}
              color="#A4B8FE"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: height < 911 ? 70 : 50,
  },
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
    backgroundColor: 'orange',
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
  thoughtContainer: {
    marginTop: 10,
    position: 'relative',
    backgroundColor: '#FFE3B8',
    marginHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    height: '21.6%',
    borderColor: 'lightgrey',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thoughtImageCont: {
    position: 'absolute',
    right: moderateScale(20, 0.5),
    bottom: 0,
  },
  thoughtImage: {
    width: moderateScale(115, 0.8),
    height: moderateScale(130, 0.8),
    tintColor: '#2F5B48',
    resizeMode: 'contain',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F4F2',
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
