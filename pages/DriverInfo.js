import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyAppLogo from '../components/Logo';
import MapScreen from '../components/MapScreen';
import StickyFooter from '../components/StickyFooter';
import { Amplify, API } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';

const DriverInfoScreen = ({route}) => {
  const { parent_id } = route.params;
  const navigation = useNavigation();

    const gotoprofile = () => {
      navigation.navigate('Welcome to KTS' ); 
    };

    // Go back one screen
    const gotoChidren = () => {
      navigation.navigate('children', {parent_id: parent_id} )
    };

  return (
    <>
    <ScrollView>
    <MyAppLogo />
    <View >
     <MapScreen />
    </View>
  </ScrollView>
    <StickyFooter title="" profile={gotoprofile} children={gotoChidren} screen="driver"/>
  </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 40,
    backgroundColor: 'red',
  },
   map: {
    width: '100%',
    height: '100%',
  },
});

export default DriverInfoScreen;