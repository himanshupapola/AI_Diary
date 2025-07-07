/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  SafeAreaView,
  useWindowDimensions,
  StatusBar,
  StyleSheet,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';

export default function BookRecommendation({route}) {
  const {mood, country} = route.params;
  const {height} = useWindowDimensions();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${mood}+subject:self-help&langRestrict=${country}&maxResults=10&printType=books&orderBy=relevance`,
        );

        const data = await response.json();
        if (data.items) {
          const recommendations = data.items.map(item => ({
            id: item.id,
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors
              ? item.volumeInfo.authors.join(', ')
              : 'Unknown Author',
            cover:
              item.volumeInfo.imageLinks?.thumbnail ||
              'https://via.placeholder.com/100',
          }));
          setBooks(recommendations);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, [mood, country]);

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
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Book Recommendations</Text>
        </View>
        {books.length > 0 ? (
          <FlatList
            data={books}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={styles.bookContainer}>
                <Image source={{uri: item.cover}} style={styles.bookImage} />
                <View style={{flex: 1}}>
                  <Text style={styles.bookTitle}>{item.title}</Text>
                  <Text
                    style={styles.bookAuthor}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    - {item.author}
                  </Text>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={styles.noBooksContainer}>
            <Text style={styles.noBooksText}>
              Looking through library based on your mood
            </Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F4F2',
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    color: '#171B34',
    fontFamily: 'Urbanist-Bold',
    fontSize: 28,
  },
  subTitle: {
    color: '#371B34',
    fontFamily: 'Urbanist-Bold',
    fontSize: 22,
  },
  bookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  bookImage: {
    width: 50,
    height: 75,
    borderRadius: 5,
    marginRight: 15,
  },
  bookTitle: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    color: '#000',
    flexShrink: 1, // Prevents overflow and shrinks if necessary
    flexWrap: 'wrap', // Ensures text wraps properly
    maxWidth: 200, // Adjust max width to fit layout
    marginVertical: 5,
  },

  bookAuthor: {
    fontSize: 12,
    fontFamily: 'Urbanist-Regular',
    color: '#555',
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: 200,
  },
  noBooksContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  noBooksText: {
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
    color: '#707070',
  },
});
