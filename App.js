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


export default function App() {
  const Stack= createNativeStackNavigator()
  return (
  <AppProvider>
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Kids Transportation Service" component={AuthScreens}/>
      <Stack.Screen  name="children" component={Children} /> 
    </Stack.Navigator>
  </NavigationContainer>
  </AppProvider>
  );
}

