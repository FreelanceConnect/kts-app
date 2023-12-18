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

import User from './User';
import MyAppLogo from '../components/Logo';

function App() {

  const {
    tokens: { colors },
  } = useTheme();

  return (
    <Authenticator.Provider>
      <Authenticator
        Container={(props) => (
          <Authenticator.Container {...props} />
        )}
        Header={MyAppLogo}
      >

      <User />
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