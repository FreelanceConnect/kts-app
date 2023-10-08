import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, ScrollView, ActivityIndicator } from 'react-native';

import { Amplify, API, Auth } from 'aws-amplify';
import { Picker } from '@react-native-picker/picker';
import { useAppContext } from '../src/AppContext';
import { useNavigation } from "@react-navigation/native";
import {
  Authenticator,
  useAuthenticator,
  useTheme,
} from '@aws-amplify/ui-react-native';

import Parents from './Parents'
import MyAppLogo from '../components/Logo';

function SignOutButton() {e
  const { signOut } = useAuthenticator();
  return <Button onPress={signOut} title="Sign Out" />;
}

function App() {
  const [phone, setPhone] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [parentId, setParentId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  const { data, setData } = useAppContext();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setPhone(user.attributes.phone_number);
        const cleanedNumber = user.attributes.phone_number.replace(/\D/g, '');
        const firstPart = cleanedNumber.substring(0, 3);
        const remainingPart = cleanedNumber.substring(3);
        const userID = `KTS-P-${remainingPart}`;
        const driverID = `KTS-D-${remainingPart}`;
         
        CheckIfDriver(driverID);
        setPhone(user.attributes.phone_number);
        setParentId(userID);
        setIsLoading(false);
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };
    const checkAuth = () => {
      return new Promise(async (resolve, reject) => {
        try {
          const user = await Auth.currentAuthenticatedUser();
          resolve(user);
        } catch (error) {
          reject(error);
        }
      });
    };

    checkAuth()
      .then((user) => {
        // Handle successful authentication
        fetchUserData();
        // console.log('User:', user);
      })
      .catch((error) => {
        // Handle authentication error
        setIsLoading(false)
        // console.error('Authentication error:', error);
      });
    
  }, []);

      const CheckIfDriver = async({driverID})=> {
          const apiName = 'ktsAPI';
          driverID="KTS-D-653099451";
          const path = `/drivers/${driverID}`;
          const myInit = {
             headers: { 
             // Allow POST method
              },
            response: true,
          };
          API.get(apiName, path, myInit)
          .then((response) => {
          const data = response.data;
          // Check if user exist in our Dynamo DB
          if (data.driver_id) {
            navigation.navigate('DriverScreen', {driver_id: driver_id} );
          }
          })
          .catch((error) => {
            console.log(error.response);
          });
      }

  const {
    tokens: { colors },
  } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <Authenticator.Provider>
      <Authenticator
        Container={(props) => (
          <Authenticator.Container {...props} />
        )}
        Header={MyAppLogo}
      >
      <Parents userId={parentId} phone={phone} />
      </Authenticator>
    </Authenticator.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default App;