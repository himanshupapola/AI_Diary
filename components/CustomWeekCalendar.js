import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomWeekCalendar = ({markedDates, selectedDate, setSelectedDate}) => {
  const [expanded, setExpanded] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(moment());

  const weekDaysLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const generateMonthDays = date => {
    const start = date.clone().startOf('month');
    const end = date.clone().endOf('month');

    let days = [];
    let firstDayIndex = start.day();
    const prevMonth = start.clone().subtract(1, 'month');
    const prevMonthDays = prevMonth.daysInMonth();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push(prevMonth.clone().date(prevMonthDays - i));
    }

    // Add all days of the current month
    for (
      let day = start.clone();
      day.isBefore(end) || day.isSame(end);
      day.add(1, 'day')
    ) {
      days.push(day.clone());
    }

    const remainingSlots = 7 - (days.length % 7);
    if (remainingSlots < 7) {
      for (let i = 1; i <= remainingSlots; i++) {
        days.push(end.clone().add(i, 'day'));
      }
    }

    return days;
  };

  const generateWeekDays = date => {
    const start = date.clone().startOf('week');
    return Array.from({length: 7}, (_, i) => start.clone().add(i, 'days'));
  };

  const handleDateChange = direction => {
    if (expanded) {
      // Move between months if in expanded mode
      const newMonth = currentMonth.clone().add(direction, 'months');

      // Prevent navigating to future months
      if (direction === 1 && newMonth.isAfter(moment(), 'month')) return;

      setCurrentMonth(newMonth);
    } else {
      const markedDatesSorted = markedDates
        .map(marked => moment(marked.date))
        .sort((a, b) => a - b);

      if (markedDatesSorted.length === 0) {
        return;
      }

      let newSelectedDate = selectedDate;

      if (direction === -1) {
        newSelectedDate =
          markedDatesSorted
            .slice()
            .reverse()
            .find(date => date.isBefore(selectedDate, 'day')) ||
          markedDatesSorted[0];
      } else {
        newSelectedDate =
          markedDatesSorted.find(date => date.isAfter(selectedDate, 'day')) ||
          markedDatesSorted[markedDatesSorted.length - 1];
      }

      setSelectedDate(newSelectedDate);
      setCurrentMonth(newSelectedDate.clone().startOf('month'));
    }
  };

  // Toggle between week view and month view
  const toggleExpanded = () => {
    setExpanded(prev => {
      if (!prev) {
        // When expanding, align selected date to the start of the month
        setSelectedDate(currentMonth.clone().startOf('month'));
      } else {
        // When collapsing, align selected date to the start of the current week
        setSelectedDate(selectedDate.clone().startOf('week'));
      }
      return !prev;
    });
  };

  const isMarked = date =>
    markedDates.some(marked => moment(marked.date).isSame(date, 'day'));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleDateChange(-1)}>
          <Icon name="chevron-left" size={20} color="black" />
        </TouchableOpacity>

        <Text style={styles.monthText}>
          <Icon name="calendar" size={20} color={'black'} />
          {'  '}
          {currentMonth.format('MMMM YYYY')}
        </Text>

        <TouchableOpacity
          onPress={() => handleDateChange(1)}
          disabled={!expanded && selectedDate.isSameOrAfter(moment(), 'week')}>
          <Icon
            name="chevron-right"
            size={20}
            color={
              !expanded && selectedDate.isSameOrAfter(moment(), 'week')
                ? '#ccc'
                : 'black'
            }
          />
        </TouchableOpacity>
      </View>
      {/* Weekday Labels */}
      <View style={styles.weekDaysContainer}>
        {weekDaysLabels.map((day, index) => (
          <Text key={index} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>
      {/* Calendar Grid */}
      <FlatList
        data={
          expanded
            ? generateMonthDays(currentMonth)
            : generateWeekDays(selectedDate)
        }
        numColumns={7}
        keyExtractor={item => item.format('YYYY-MM-DD')}
        renderItem={({item}) => {
          const isSelected = selectedDate.isSame(item, 'day');
          const isNotCurrentMonth = item.month() !== currentMonth.month();
          const isFuture = item.isAfter(moment(), 'day');
          const isHighlighted = isMarked(item);
          return (
            <TouchableOpacity
              disabled={isFuture}
              style={[
                styles.dayContainer,
                isSelected && styles.selectedDay,
                isNotCurrentMonth && styles.placeholderDay,
                isFuture && styles.futureDay,
                isHighlighted && styles.highlightedDay,
              ]}
              onPress={() => !isFuture && setSelectedDate(item)}>
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.selectedDayText,
                  isNotCurrentMonth && styles.placeholderDayText,
                  isFuture && styles.futureDayText,
                  isHighlighted && styles.highlightedDayText,
                ]}>
                {item.format('D')}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity onPress={toggleExpanded} style={styles.expandButton}>
        <Text style={styles.expandButtonText}>
          {expanded ? '    ' : '     '}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  monthText: {
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Urbanist-Bold',
    color: '#555',
  },
  dayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    padding: 10,
    borderRadius: 23,
    backgroundColor: '#eee',
  },
  dayText: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
  },
  selectedDay: {
    backgroundColor: '#007BFF',
  },
  selectedDayText: {
    color: '#fff',
  },
  placeholderDay: {
    backgroundColor: '#ddd',
  },
  placeholderDayText: {
    color: '#888',
  },
  futureDay: {
    backgroundColor: '#f2f2f2',
    opacity: 0.6,
  },
  futureDayText: {
    color: '#999',
  },
  expandButton: {
    marginTop: 13,
    width: '25%',
    height: 7,
    backgroundColor: '#E4E7ED',
    borderRadius: 5,
    margin: 'auto',
    alignItems: 'center',
  },
  expandButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  highlightedDay: {
    borderRadius: 23,
    borderWidth: 1,
    backgroundColor: 'orange',
  },

  highlightedDayText: {
    color: 'white',
  },
});

export default CustomWeekCalendar;
