import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../constants/colors';
export default function Button({title, onPress, style}) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <MaterialIcons name="arrow-forward" size={20} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.darkBrown,
    width: 85,
    height: 85,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
