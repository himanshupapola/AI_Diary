import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeMain from './HomeMain';
import BookRecommendation from './BookRecommendation ';
import SongRecommendation from './SongRecommendation';

const HomeStack = createNativeStackNavigator();

const Home = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeMain}
        options={{headerShown: false}}
      />

      <HomeStack.Screen
        name="BookRecommendation"
        component={BookRecommendation}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="SongRecommendation"
        component={SongRecommendation}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

export default Home;
