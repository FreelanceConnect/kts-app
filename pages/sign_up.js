import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, KeyboardAvoidingView, ScrollView} from 'react-native';

import { Auth } from 'aws-amplify';

const SignUpScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSignUp = async () => {
        // Perform signup logic here with the formData object
        const {firstName,lastName, phoneNumber, email, confirmEmail, password, confirmPassword } = formData;
        Username=email;
        try {
            const { user } = await Auth.signUp({
            Username,
              password,
              attributes: {
                firstName,
                lastName,          // optional
                phoneNumber,   // optional - E.164 number convention
                // other custom attributes 
              },
              autoSignIn: { // optional - enables auto sign in after user is confirmed
                enabled: true,
              }
            });
            console.log(user);
            console.log(formData);
            navigation.navigate("confirm_email")
          } catch (error) {
            console.log('error signing up:', error);
          }
    };

    const navigate = () => {
        navigation.navigate("Sign_In")
    }


    return (

    <KeyboardAvoidingView
        behavior="padding"
        style={{flex: 1}}>


        <ScrollView style={styles.scrollView}>

           
                <View style={styles.imageContainer}>
                <Image style={styles.image} source={require("../assets/KTSLogo.png")} />
                </View>
            
            <View>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={(text) => handleChange('firstName', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={(text) => handleChange('lastName', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Email"
                value={formData.confirmEmail}
                onChangeText={(text) => handleChange('confirmEmail', text)}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                secureTextEntry
            />
            <Button title="Sign Up" onPress={handleSignUp} />
            </View>
            <Text style={styles.text}>already have an account? <Text onPress={navigate} style={styles.textChild}>Sign In</Text></Text>
        </ScrollView>
     </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
       paddingHorizontal: 10
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    text: {
        marginTop: 20
    },
    textChild: {
        color: "skyblue"
    },
    scrollView: {
        marginHorizontal: 20,
        marginVertical: 150,
      },
});

export default SignUpScreen;