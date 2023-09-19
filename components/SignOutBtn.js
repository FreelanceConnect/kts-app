import React from 'react';
import { Button, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import {
  Authenticator,
  useAuthenticator,
} from '@aws-amplify/ui-react-native';

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
          <View style={styles.buttonContainer}>
         <TouchableOpacity style={[styles.button, { backgroundColor: '#e60000' }]} onPress={signOut}>
              <Text style={[styles.textStyle, { backgroundColor: '#e60000' }]}>LOGOUT</Text>
          </TouchableOpacity>
      </View>
  );
};



const style = StyleSheet.create({
  container: { flex: 1, marginTop: 26,},
});

const styles = StyleSheet.create({
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginVertical: 10,
    width: '40%',
  },
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
    borderRadius: 2,
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
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
});


export default SignOutButton;

