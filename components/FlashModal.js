import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import LottieView from 'lottie-react-native';

const FlashModal = ({message, lottieFile, buttonMsg = 'Dismiss', onPress}) => {
  const [visible, setVisible] = useState(true);

  if (!message || !lottieFile || !visible) {
    return null;
  }

  const handleDismiss = () => {
    setVisible(false);
    if (onPress) {
      onPress();
    }
  };

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LottieView
            source={lottieFile}
            autoPlay
            loop={true}
            style={styles.lottie}
          />
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={handleDismiss} style={styles.button}>
            <Text style={styles.buttonText}>{buttonMsg}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(53, 28, 2, 0.48)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 320,
    padding: 16,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    elevation: 10,
  },
  lottie: {
    width: 120,
    height: 110,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Urbanist-Bold',
    marginVertical: 10,
  },
  button: {
    width: '90%',
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
  },
});

export default FlashModal;
