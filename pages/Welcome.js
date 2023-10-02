import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, ScrollView, ActivityIndicator } from 'react-native';

import { Amplify, API, Auth } from 'aws-amplify';
import { Picker } from '@react-native-picker/picker';
import { useAppContext } from '../src/AppContext';
import {
  Authenticator,
  useAuthenticator,
  useTheme,
} from '@aws-amplify/ui-react-native';

import Parents from './Parents'
import MyAppLogo from '../components/Logo';

function SignOutButton() {
  const { signOut } = useAuthenticator();
  return <Button onPress={signOut} title="Sign Out" />;
}

function App({ navigation }) {
  const [phone, setPhone] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [parentId, setParentId] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const { data, setData } = useAppContext();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await Auth.currentUserInfo();
        console.log("This is user on welcome page", user);
        setPhone(user.attributes.phone_number);
        const cleanedNumber = user.attributes.phone_number.replace(/\D/g, '');
        const firstPart = cleanedNumber.substring(0, 3);
        const remainingPart = cleanedNumber.substring(3);
        const userID = `KTS-P-${remainingPart}`;
        setParentId(userID);
        setIsLoading(false);
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

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