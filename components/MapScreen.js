import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const MapScreen = () => {
  return (
    <View style={styles.container}>
      <MapView 
        provider={MapView.PROVIDER_GOOGLE}
        style={styles.map} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapScreen;
