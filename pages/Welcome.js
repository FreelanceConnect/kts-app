import React, {useState} from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image } from 'react-native';

import { Amplify } from 'aws-amplify';
import {
  Authenticator,
  useAuthenticator,
  useTheme,
} from '@aws-amplify/ui-react-native';

import MyAppLogo from '../components/Logo';

function SignOutButton() {
  const { signOut } = useAuthenticator();
  return <Button onPress={signOut} title="Sign Out" />;
}

function App({ navigation }) {
  const {
    tokens: { colors },
  } = useTheme();

    const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    region: '',
    country: ''
  });

  const handleChange = (field, value) => {
    setFormData({...formData, [field]: value});
  };

  const handleSubmit = () => {
    // Perform form submission logic here
    navigation.navigate("children")
  };

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
    <View style={styles.container}>

    <View style={styles.imageContainer}>
      <Image style={styles.image} source={require("../assets/KTSLogo.png")} />
    </View>

      <Text style={styles.textField}>Please enter your information here</Text>
      <TextInput
        style={styles.input}
        onChangeText={(value) => handleChange('name', value)}
        value={formData.name}
        placeholder="Name"
      />

      <TextInput
        style={styles.input}
        onChangeText={(value) => handleChange('email', value)}
        value={formData.email}
        placeholder="Email"
      />

      <TextInput
        style={styles.input}
        onChangeText={(value) => handleChange('address', value)}
        value={formData.address}
        placeholder="Address"
      />

      <TextInput
        style={styles.input}
        onChangeText={(value) => handleChange('city', value)}
        value={formData.city}
        placeholder="City"
      />

      <TextInput
        style={styles.input}
        onChangeText={(value) => handleChange('region', value)}
        value={formData.region}
        placeholder="Region"
      />

      <TextInput
        style={styles.input}
        onChangeText={(value) => handleChange('country', value)}
        value={formData.country}
        placeholder="Country"
      />

      <Button title="Submit" onPress={handleSubmit} />
        <View style={style.container}>
          <SignOutButton />
        </View>
    </View>


      </Authenticator>
    </Authenticator.Provider>
  );
}

const style = StyleSheet.create({
  container: { flex: 1, marginTop: 26,},
});

const styles = StyleSheet.create({
    textField: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderRadius: '2',
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
});

export default App;