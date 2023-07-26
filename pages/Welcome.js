import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, KeyboardAvoidingView, ScrollView} from 'react-native';

import { Auth } from 'aws-amplify';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';

import SignOutButton from '../components/SignOut';

const AuthScreens = ({ navigation }) => {
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
        console.log(Auth);
    };

    const navigate = () => {
        navigation.navigate("Sign_In")
    }


    return (

    <KeyboardAvoidingView
        behavior="padding"
        style={{flex: 1}}>
        <ScrollView style={styles.scrollView}>
            <Text>Amplify welcome page</Text>
            {/* <Pressable onPress={signOut} style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Hello, {user.username}! Click here to sign out!</Text>
            </Pressable> */}

            <SignOutButton />

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

export default withAuthenticator(AuthScreens);