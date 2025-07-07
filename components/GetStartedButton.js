import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function GetStartedButton({onPress}) {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.8}
      onPress={onPress}>
      <Text style={styles.text}>Get Started</Text>
      <MaterialIcons name="arrow-forward" size={20} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B2C1A',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  text: {
    color: 'white',
    fontSize: 19,
    fontFamily: 'Urbanist-Bold',
    marginRight: 8,
  },
  icon: {
    marginLeft: 4,
  },
});
