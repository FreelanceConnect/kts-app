import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



// import { Amplify,  Auth } from 'aws-amplify';
// import awsExports from './src/aws-exports';
// Amplify.configure(awsExports);

// Auth.configure(awsExports);

import SignIn from './pages/singn_in';
import SignUp from './pages/sign_up';
import ConfirmEmailScreen from './pages/confirm_email';


export default function App() {
  const Stack= createNativeStackNavigator()
  return (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="sign_Up" component={SignUp} />
      <Stack.Screen  name="Sign_In" component={SignIn} /> 
      <Stack.Screen name="confirm_email" component={ConfirmEmailScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

