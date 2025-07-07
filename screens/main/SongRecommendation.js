/* eslint-disable curly */
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
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Header from '../../components/Header';
import Geolocation from '@react-native-community/geolocation';
import {Buffer} from 'buffer';

// Spotify API Credentials
const SPOTIFY_CLIENT_ID = '014247a4e34a4a2b8fee632a7fc0640f';
const SPOTIFY_CLIENT_SECRET = 'ebe652aee8c54a03adac4bfdc6b1e8e3';

// OpenWeather API Key
const WEATHER_API_KEY = '69c299b8acecb6e381cc6ec85029cef8';

export default function SongRecommendation({route}) {
  const {mood, country} = route.params;
  const {height} = useWindowDimensions();
  const [playlists, setPlaylists] = useState([]);
  const [location, setLocation] = useState('...');
  const [weather, setWeather] = useState(null);
  const [weatherEmojis, setWeatherEmojis] = useState(null);
  const [city, setCity] = useState('');
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async position => {
        setLocationDenied(false); // Reset if location is retrieved
        const {latitude, longitude} = position.coords;

        try {
          // Fetch Location
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const locationData = await response.json();
          const currentCity =
            locationData.city || locationData.locality || 'Unknown';
          const state = locationData.principalSubdivision || 'Unknown';
          setLocation(state);
          setCity(currentCity);

          // Fetch Weather
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`,
          );
          const weatherData = await weatherResponse.json();
          const weatherCondition = weatherData.weather?.[0]?.main || 'Unknown';

          const emojiMap = {
            Clear: '☀️',
            Clouds: '☁️',
            Rain: '🌧️',
            Drizzle: '🌦️',
            Thunderstorm: '⛈️',
            Snow: '❄️',
            Mist: '🌫️',
            Fog: '🌫️',
          };
          setWeatherEmojis(emojiMap[weatherCondition] || '🧐');
          setWeather(weatherCondition);

          // Fetch Spotify Playlists
          fetchPlaylists(state, weatherCondition);
        } catch (error) {
          console.error('❌ Error fetching location/weather:', error);
          setLocation('Unknown');
        }
      },
      error => {
        if (error.code === 1) {
          // PERMISSION_DENIED
          setLocationDenied(true);
        }
        // console.error('❌ Geolocation error:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, [fetchPlaylists]);

  // Function to Get Spotify Access Token
  const getSpotifyToken = async () => {
    try {
      const authString = Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
      ).toString('base64');

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${authString}`,
        },
        body: 'grant_type=client_credentials',
      });

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('❌ Error fetching Spotify token:', error);
      return null;
    }
  };

  // Fetch Playlists from Spotify
  const fetchPlaylists = useCallback(
    async (detectedCountry, weatherCondition) => {
      try {
        const token = await getSpotifyToken();
        if (!token) {
          console.error('❌ No Spotify token received');
          return;
        }

        const currentYear = new Date().getFullYear();
        const randomYear =
          Math.floor(Math.random() * (currentYear - 2010 + 1)) + 2010;

        const baseQueries = [
          // Mood-specific queries
          `${mood} mood ${weatherCondition} weather ${detectedCountry} ${randomYear} songs`,
          `${mood} mood ${weatherCondition} weather ${detectedCountry} ${randomYear} playlists`,
          `Trending ${mood} songs ${weatherCondition} weather ${detectedCountry} ${randomYear}`,
          `Popular ${mood} songs ${weatherCondition} weather ${detectedCountry} ${randomYear}`,
          `Best ${randomYear} ${mood} mood songs for ${weatherCondition} weather in ${detectedCountry}`,

          `Ultimate ${detectedCountry} ${randomYear} hits for ${weatherCondition} days`,
          `Top ${randomYear} tracks to match ${weatherCondition} vibes in ${detectedCountry}`,
        ];

        if (!mood || mood.toLowerCase() === 'neutral') {
          baseQueries.splice(0, 2);
        }

        if (mood && mood.toLowerCase() !== 'neutral') {
          baseQueries.push(
            `Feel the ${mood} vibe with ${randomYear} songs for ${weatherCondition} days in ${detectedCountry}`,
          );
        }

        function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
        }

        shuffleArray(baseQueries);

        const randomQuery =
          baseQueries[Math.floor(Math.random() * baseQueries.length)];

        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            randomQuery,
          )}&type=playlist&limit=15`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );

        const data = await response.json();

        if (data.error) {
          console.error('❌ Spotify API Error:', data.error.message);
          return;
        }

        if (data.playlists?.items?.length > 0) {
          const recommendations = data.playlists.items
            .filter(item => item?.id && item?.name)
            .map(item => ({
              id: item.id,
              title: item.name,
              owner: item.owner?.display_name || 'Unknown Owner',
              thumbnail:
                item.images?.[0]?.url || 'https://via.placeholder.com/80',
              url: item.external_urls?.spotify || '#',
            }));

          setPlaylists(recommendations);
        } else {
          setPlaylists([
            {
              id: 'default1',
              title: 'Feel Good Vibes',
              owner: 'Spotify',
              thumbnail: 'https://via.placeholder.com/80',
              url: 'https://open.spotify.com/playlist/37i9dQZF1DX889U0CL85jj',
            },
          ]);
        }
      } catch (error) {
        console.error('❌ Error fetching playlists:', error);
      }
    },
    [mood],
  );
  return (
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

      {locationDenied ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{fontSize: 20, color: 'red', fontFamily: 'Urbanist-Bold'}}>
            Location Permission Denied
          </Text>
        </View>
      ) : (
        <>
          <>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Song Recommendations</Text>
              <Text style={styles.locationText}>
                Currently exploring {location} {''}|{' '}
                {mood
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </Text>
              {weather && (
                <Text style={styles.weatherText}>
                  The sky whispers {weatherEmojis} {weather} today in {city}
                </Text>
              )}
            </View>

            {playlists.length > 0 ? (
              <FlatList
                data={playlists}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.playlistContainer}
                    onPress={() => Linking.openURL(item.url)}>
                    <Image
                      source={{uri: item.thumbnail}}
                      style={styles.playlistImage}
                    />
                    <View style={{flex: 1}}>
                      <Text style={styles.playlistTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={styles.playlistOwner}>- {item.owner}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={styles.noPlaylistsContainer}>
                <Text style={styles.noPlaylistsText}>
                  🔎 Searching Spotify for this mood and weather
                </Text>
              </View>
            )}
          </>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#F7F4F2'},
  titleContainer: {paddingHorizontal: 20, marginBottom: 10},
  title: {
    fontSize: 28,
    color: '#171B34',
    fontFamily: 'Urbanist-Bold',
  },
  locationText: {
    fontSize: 16,
    paddingVertical: 10,
    fontFamily: 'Urbanist-Bold',
    color: 'darkorange',
  },
  weatherText: {
    fontSize: 16,
    color: '#555',
    margintop: 50,
    fontFamily: 'Urbanist-Bold',
  },
  playlistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
  },
  playlistImage: {width: 80, height: 80, borderRadius: 5, marginRight: 15},
  playlistTitle: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Urbanist-Bold',
  },
  playlistOwner: {fontSize: 12, color: '#555', fontFamily: 'Urbanist-Bold'},
  noPlaylistsContainer: {alignItems: 'center', marginTop: 10},
  noPlaylistsText: {
    fontSize: 16.5,
    fontWeight: 'bold',
    color: '#707070',
    fontFamily: 'Urbanist-Bold',
  },
});
