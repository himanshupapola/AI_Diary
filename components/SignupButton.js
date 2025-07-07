import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
export default function SignupButton({title, onPress, style}) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <View style={styles.buttonWrapper}>
        <Text style={styles.buttonText}>{title}</Text>
        <MaterialIcons name="arrow-forward" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#412c1f',
    width: '95%',
    height: 55,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
  buttonText: {
    fontFamily: 'Urbanist-Bold',
    color: 'white',
    fontSize: 18,
  },
});
