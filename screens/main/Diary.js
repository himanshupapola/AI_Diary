import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DiaryMain from './DiaryMain';
import DiaryDetails from './DiaryDetails';
import Notifications from './Notifications';

const DiaryStack = createNativeStackNavigator();

const Diary = () => {
  return (
    <DiaryStack.Navigator>
      <DiaryStack.Screen
        name="DiaryMain"
        component={DiaryMain}
        options={{headerShown: false}}
      />
      <DiaryStack.Screen
        name="DiaryDetails"
        component={DiaryDetails}
        options={{headerShown: false}}
      />
    </DiaryStack.Navigator>
  );
};

export default Diary;
