import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const StickyFooter = ({ title }) => {
  return (
    <View style={styles.footerContainer}>
      <MaterialCommunityIcons name="account" size={40} color="black" />

      <FontAwesome5 name="child" size={40} color="black" /> 
      <Feather name="truck" size={40} color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    elevation: 6, // for Android shadow
    shadowColor: 'rgba(0, 0, 0, 0.3)', // for iOS shadow
    shadowOffset: { width: 0, height: -2 }, // for iOS shadow
    shadowOpacity: 0.8, // for iOS shadow
    zIndex: 1, // to ensure the footer is above other components
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StickyFooter;