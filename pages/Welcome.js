import React, {useState, useEffect} from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, ScrollView } from 'react-native';

import { Amplify, API, Auth } from 'aws-amplify';
import {Picker} from '@react-native-picker/picker';
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

      const { data, setData } = useAppContext();

    useEffect(() => {
      const fetchUserData = async () => {
        try {
            const user = await Auth.currentUserInfo();
            setPhone(user.attributes.phone_number);
            // Remove the leading "+" sign and any non-numeric characters
            const cleanedNumber = user.attributes.phone_number.replace(/\D/g, '');
            // Get the first part of the cleaned number
            const firstPart = cleanedNumber.substring(0, 3);
            const remainingPart = cleanedNumber.substring(3); // Remove the first part
            const userID = `KTS-P-${remainingPart}`;
            setParentId(userID);
          } catch (error) {
            console.log('Error fetching user data:', error);
          }
         };

        fetchUserData();
      },[]);

      const {
        tokens: { colors },
      } = useTheme();

  return (
    <Authenticator.Provider>
      <Authenticator
        // will wrap every subcomponent
        Container={(props) => (
          // reuse default `Container` and apply custom background
          <Authenticator.Container
            {...props}
          />
        )}
        // will render on every subcomponent
        Header={MyAppLogo}
      >
      <Parents userId={parentId} phone={phone}/>
      </Authenticator>
    </Authenticator.Provider>
  );
}

const style = StyleSheet.create({
  container: { flex: 1, marginTop: 26,},
});

const styles = StyleSheet.create({
    textField: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  imageContainer:{
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center'
    },
    image:{
    width:150,
    height:150
    },
    label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default App;