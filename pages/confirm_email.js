import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ConfirmEmailScreen = ({navigation}) => {
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleConfirm = () => {
    // Perform confirmation logic with the confirmationCode
    console.log('Confirmation Code:', confirmationCode);
    navigation.navigate("Sign_In")
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Confirm Your Email</Text>
      <Text style={styles.message}>
        An email with a confirmation code has been sent to your email address.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Confirmation Code"
        value={confirmationCode}
        onChangeText={(text) => setConfirmationCode(text)}
        keyboardType="numeric"
      />
      <Button title="Confirm" onPress={handleConfirm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
});

export default ConfirmEmailScreen;