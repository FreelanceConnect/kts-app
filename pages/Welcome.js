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
  SignIn,
} from '@aws-amplify/ui-react-native';
import NetInfo from '@react-native-community/netinfo';

import User from './User';
import MyAppLogo from '../components/Logo';
import OfflineScreen from '../components/Offline';

function App() {
  const {
    tokens: { colors },
  } = useTheme();

  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    const checkInternetConnectivity = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
      setIsLoading(false);
    };

    checkInternetConnectivity();

    return () => {
      unsubscribe();
    };
  }, []);

  

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isConnected) {
    return <OfflineScreen />;
  }

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default App;