import React, {useState, useEffect} from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAppContext } from '../src/AppContext';

import { Amplify, API, Auth } from 'aws-amplify';

import AsyncStorage from '@react-native-async-storage/async-storage';

import MyAppLogo from '../components/Logo';
import SignOutButton from '../components/SignOutBtn';
import StickyFooter from '../components/StickyFooter';
import {  
  Authenticator,
  useAuthenticator,
  useTheme,
} from '@aws-amplify/ui-react-native';

function Parents() {
  const navigation = useNavigation();
  const {
    tokens: { colors },
  } = useTheme();
  const apiName = 'ktsAPI'; // replace this with your api name.
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { data, setData } = useAppContext();

  const [showForm, setShowForm] = useState(false);
  const [showOtherBtn, setShowOtherBtn] = useState(false);
  const [phone, setPhone] = useState('');
  const [isAddingParent, setIsAddingParent] = useState(false);
  const [parent_id, setParentId] = useState();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    quarter: '',
    zone: '',
    phone: phone,
    parent_id: parent_id,
    errors: {
    name: '',
    email: '',
    quarter: '',
    zone: '',
  },
  });

const handleChange = (field, value) => {
  setFormData((prevState) => ({
    ...prevState,
    [field]: value,
    errors: {
      ...prevState.errors,
      [field]: '', // Clear the corresponding error state
    },
  }));
};

   const handleSubmit = () => {

    let isValid = true;
    const errors = {};

      // Validate name field
    if (formData.name.trim() === '') {
        isValid = false;
        errors.name = 'Name is required';
    }
    if (formData.quarter.trim() === '') {
        isValid = false;
        errors.quarter = 'Quarter is required';
    }
   if (formData.zone.trim() === '') {
        isValid = false;
        errors.zone = 'Zone is required';
    }
    // Update the state with validation errors
    setFormData((prevState) => ({
      ...prevState,
      errors,
    }));
    

    if (isValid) {
    const apiName = 'ktsAPI'; // replace this with your api name.
    const path = `/parents`;
    const {name, email, quarter, zone} = formData;
    const myInit = {
      body: {
        parent_id: parent_id,
        numberOfKids: 0,
        address: {
          quarter: quarter,
          zone: zone,
        },
        children: {},
        phone: phone,
        AO: 0,
        TA: 0,
        AP: 0,
        CustomerName: name,
        email: email,
      },
      headers: {} // OPTIONAL
    };
    setIsAddingParent(true);
    API.post(apiName, path, myInit)
      .then((response) => {
        // Add your code here

          AsyncStorage.setItem(parent_id, JSON.stringify(myInit.body))
          .then(() => {
            console.log('User data saved successfully');
            setShowOtherBtn(true);
            setIsAddingParent(false);
          navigation.navigate('children', {parentName: formData.name, parent_id: parent_id, 
            parentZone: formData.zone, parentQuarter: formData.quarter} );
          })
          .catch((error) => {
             setIsAddingParent(false);
            console.log('Error saving user data:', error);
          });
      })
      .catch((error) => {
        setIsAddingParent(false);
        console.log(error.response);
      });

    }
  };

  useEffect(() => {
         const fetchInfoFromAPI = (userId) => {
          const apiName = 'ktsAPI';
          const path = `/parents/${userId}`;
          const myInit = {
             headers: { 
             // Allow POST method
              },
            response: true,
          };
          setIsLoading(true);
          API.get(apiName, path, myInit)
          .then((response) => {
          const data = response.data;
          setIsLoading(false);
          // Check if user exist in our Dynamo DB
          if (data.parent_id) {

            setFormData((prevFormData) => ({
            ...prevFormData,
            name: data.CustomerName,
            email: data.email,
            quarter: data.address.quarter,
            zone: data.address.zone,
          }));

          AsyncStorage.setItem(userId, JSON.stringify(data))
          .then(() => {
            console.log('User data saved successfully');
            setShowOtherBtn(true);
            setIsLoading(false);
            navigation.navigate('children', {parentName: formData.name, parent_id: userId, 
            parentZone: formData.zone, parentQuarter: formData.quarter} );
          })
          .catch((error) => {
             setIsLoading(false);
            console.log('Error saving user data:', error);
          });
          }

          })
          .catch((error) => {
            console.log(error.response);
          });
      }

            // check User data from our Local storage

    const fetchDataFromStorage = async (parentData) => {
      try {
        const parentdata = await AsyncStorage.getItem(parentData);
        if (parentdata !== null) {
        const data= JSON.parse(parentdata);
        setFormData((prevFormData) => ({
            ...prevFormData,
            name: data.CustomerName,
            email: data.email,
            quarter: data.address.quarter,
            zone: data.address.zone,
        }));
          setShowOtherBtn(true);
          navigation.navigate('children', {parentName: formData.name, parent_id: parentData, 
            parentZone: formData.zone, parentQuarter: formData.quarter} );
        }
        else {
          console.log('no user data yet');
          //get the data from API if no data from our Localstorage
          fetchInfoFromAPI(parentData);
        }
      } catch (error) {
        console.log('Error retrieving data:', error);
      }
    };


    const fetchUserData = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setPhone(user.attributes.phone_number);
        const cleanedNumber = user.attributes.phone_number.replace(/\D/g, '');
        const firstPart = cleanedNumber.substring(0, 3);
        const remainingPart = cleanedNumber.substring(3);
        const userID = `KTS-P-${remainingPart}`;
        const driverID = `KTS-D-${remainingPart}`;
        setPhone(user.attributes.phone_number);
        setParentId(userID);
        console.log("here is ID", userID);
        fetchDataFromStorage(userID);
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };
     const fetchData = async () => {
        try {
          await fetchUserData();
        } catch (error) {
          console.log('Error fetching data:', error);
        }
      };

      fetchData();

    // fetchInfoFromAPI();
  }, []);

  return (
  <>
    <ScrollView>
    <View style={styles.container}>

    <View style={styles.imageContainer}>
      <Image style={styles.image} source={require("../assets/KTSLogo.png")} />
    </View>
      {isLoading ? (
            <ActivityIndicator size="small" color="#2196F3" />
          ) : (
      <>
        <Text style={styles.textField}>Please enter your information here</Text>
        <Text style={styles.label}>Name</Text>
        {formData.errors.name && <Text style={styles.error}>{formData.errors.name}</Text>}
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange('name', value)}
          value={formData.name}
          placeholder="Enter Your name"
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange('email', value)}
          value={formData.email}
          placeholder="Enter Your Email"
        />
        <Text style={styles.label}>Zone</Text>
        {formData.errors.zone && <Text style={styles.error}>{formData.errors.zone}</Text>}
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange('zone', value)}
          value={formData.zone}
          placeholder="Ex: Logpom"
        />
        <Text style={styles.label}>Quarter</Text>
        {formData.errors.quarter && <Text style={styles.error}>{formData.errors.quarter}</Text>}
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange('quarter', value)}
          value={formData.quarter}
          placeholder="Ex: Andem, derrière pharmacie"
        />

      {showOtherBtn ? (
        <View style={styles.containerContinue}>
          <View style={styles.element1}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#2196F3' }]}>
              <Text style={[styles.textStyle, { backgroundColor: '#2196F3' }]} >Update</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.element2}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#008000' }]} onPress={() => navigation.navigate('children', {parentName: formData.name, parent_id: parent_id, 
            parentZone: formData.zone, parentQuarter: formData.quarter})}>
              <Text style={[styles.textStyle, { backgroundColor: '#008000' }]} >NEXT</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#2196F3" }]}
            onPress={handleSubmit}
            disabled={isAddingParent} // Disable the button while adding child
          >
            {isAddingParent ? (
              <ActivityIndicator color="#ffffff" /> // Show loading indicator while adding child
            ) : (
              <Text style={[styles.textStyle, { backgroundColor: "#2196F3" }]}>
                Add Child
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

        <View style={style.container}>
          <SignOutButton />
        </View>
   </>
   )}
        
    </View>
    </ScrollView>
    </>
  );
}

const style = StyleSheet.create({
  container: { flex: 1, marginTop: 26,},
});

const styles = StyleSheet.create({
   containerContinue: {
    flexDirection: 'row',
  },
    element1: {
    flex: 3,
    marginRight: 4,
    // Additional styling for Element 1
  },
  element2: {
    flex: 2,
    marginLefrt: 4,
    // Additional styling for Element 2
  },
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
    width: '100%',
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

export default Parents;