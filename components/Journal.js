import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Emoji from './EmojiCard';
import {
  fetchDiaryDateEntry,
  fetchDiaryEntries,
} from '../utils/supabaseFunctions';
import CustomWeekCalendar from './CustomWeekCalendar';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';

const Journal = ({email, modal}) => {
  const [data, setData] = useState([]);
  const [markedDates, setMarkedDates] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());

  const getDiaryEntries = useCallback(async () => {
    setRefreshing(true);
    const dataDiary = await fetchDiaryEntries(email);
    setData(dataDiary);

    setRefreshing(false);
  }, [email]);

  const getDiaryDateEntries = useCallback(async () => {
    const dataDiaryDate = await fetchDiaryDateEntry(email);
    setMarkedDates(dataDiaryDate);
  }, [email]);

  useEffect(() => {
    getDiaryEntries();
    getDiaryDateEntries();
  }, [getDiaryDateEntries, getDiaryEntries, modal]);

  const currentDate = moment().format('YYYY-MM-DD'); // Get today's date
  let filteredData = data.filter(
    item => item.date === selectedDate.format('YYYY-MM-DD'),
  );

  // if (selectedDate.format('YYYY-MM-DD') === currentDate) {
  //   filteredData = data;
  // }

  return (
    <>
      <CustomWeekCalendar
        markedDates={markedDates}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      {filteredData.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No Diary Entery</Text>
        </View>
      ) : (
        ''
      )}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.diary_id}
        renderItem={({item}) => <CardItem {...item} />}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
        updateCellsBatchingPeriod={50}
        scrollEventThrottle={16}
        refreshing={refreshing}
        onRefresh={getDiaryEntries}
      />
    </>
  );
};

const CardItem = ({emoji, date, title, content}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Emoji mood={emoji} size={40} />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('DiaryDetails', {emoji, date, title, content})
          }>
          <Icon name="arrow-right-thin" size={30} color="darkbrown" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.dateButton}>
        <Text style={styles.dateText}>🕒 {date}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content} numberOfLines={2} ellipsizeMode="tail">
        {content}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {padding: 20},
  emptyText: {fontFamily: 'Urbanist-Bold'},
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    marginBottom: 0,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'grey',
    outlineWidth: 1,
    outlineColor: 'lightgrey',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 24,
  },
  dateButton: {
    width: '31.5%',
    backgroundColor: '#ff8f45',
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'grey',
    outlineColor: '#f0a63e',
    outlineWidth: 0.4,
  },
  dateText: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Urbanist-Regular',
  },
  title: {
    fontSize: 16,
    color: '#29191d',
    marginBottom: 6,
    fontFamily: 'Urbanist-Bold',
  },
  content: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Urbanist-Regular',
  },
  container: {
    paddingBottom: 300,
  },
});

export default Journal;
