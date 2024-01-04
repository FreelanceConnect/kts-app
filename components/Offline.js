import React from 'react';
import { View, Text,StyleSheet } from 'react-native';

const OfflineScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>You are offline.</Text>
      <Text style={styles.text}>Please check your internet connection and try again.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default OfflineScreen;