import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const RecommendationCard = ({ title, subtitle, buttonText, onPress, color }) => {
  const [isPressed, setIsPressed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsPressed(false); // Reset button state when screen is focused
    }, [])
  );

  const handlePress = () => {
    if (!isPressed) {
      setIsPressed(true);
      onPress();
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress} disabled={isPressed}>
        <Text style={[styles.buttonText, isPressed && { opacity: 0.5 }]}>{buttonText} ↗</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 170,
    padding: 15,
    borderRadius: 20,
    margin: 5,
    borderWidth: 2,
    borderColor: 'lightgrey',
    outlineWidth: 1,
    outlineColor: 'lightgrey',
  },
  title: {
    fontSize: 15,
    marginBottom: 10,
    fontFamily: 'Urbanist-Bold',
  },
  subtitle: {
    fontSize: 14,
    marginVertical: 5,
    fontFamily: 'Urbanist-Regular',
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 11,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#c9c9c9',
    fontFamily: 'Urbanist-Bold',
  },
});

export default RecommendationCard;
