import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, ScrollView, ActivityIndicator } from 'react-native';

import { Amplify, API, Auth } from 'aws-amplify';
import { Picker } from '@react-native-picker/picker';
import { useAppContext } from '../src/AppContext';
import { useNavigation } from "@react-navigation/native";
import DriverProfile from './DriverProfile';

import {
  Authenticator,
  useAuthenticator,
  useTheme,
} from '@aws-amplify/ui-react-native';

import ParentsProfile from './ParentsProfile'
import MyAppLogo from '../components/Logo';

function User() {
  const [phone, setPhone] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [parentId, setParentId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isDriver, setIsDriver] = useState(false);
  const  [driverID, setDriverid]= useState();
  const navigation = useNavigation();


useEffect(() => {
  const fetchUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setPhone(user.attributes.phone_number);
      console.log("looking for token", user.attributes.phone_number);
      const cleanedNumber = user.attributes.phone_number.replace(/\D/g, '');
      const firstPart = cleanedNumber.substring(0, 3);
      const remainingPart = cleanedNumber.substring(3);
      const parentId = `KTS-P-${remainingPart}`;
      const driverId = `KTS-D-${remainingPart}`;
      setPhone(user.attributes.phone_number);
      setParentId(parentId);
      setDriverId(driverId);
    } catch (error) {
      console.log('Error fetching user data:', error);
      setIsLoading(false);
    }
    
    setIsLoading(false);
  };

  fetchUserData();
}, []);



return (

  isLoading ? 
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View> :
   <View >
     { isDriver ? <DriverProfile driverID={driverID} phone={phone} /> : <ParentsProfile parent_id={parentId} phone={phone} /> }
    </View >

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default User;