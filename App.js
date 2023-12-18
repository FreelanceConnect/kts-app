import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/AppContext';

import { Amplify,  Auth } from 'aws-amplify';
import awsExports from './src/aws-exports';
Amplify.configure(awsExports);

Auth.configure(awsExports);
import AuthScreens from './pages/Welcome';
import Children from './pages/Children';
import DriverInfo from './pages/DriverInfo';
import DriverProfile from './pages/DriverProfile';
import ChildrenDriver from './pages/ChildrenDriver';
import MessagesDriver from './pages/MessagesDriver';


export default function App() {

  const Stack= createNativeStackNavigator()
  return (
  <AppProvider>
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Welcome to KTS" component={AuthScreens}/>
      <Stack.Screen  name="children" component={Children} /> 
      <Stack.Screen  name="DriverInfo" component={DriverInfo} /> 
      <Stack.Screen  name="DriverScreen" component={DriverProfile} /> 
      <Stack.Screen  name="Your Students" component={ChildrenDriver} />
      <Stack.Screen  name="Your Messages" component={MessagesDriver} />
    </Stack.Navigator>
  </NavigationContainer>
  </AppProvider>
  );
}

