import React, {useState, useEffect, useRef} from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import Dropdown from '../components/Dropdown';

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


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

  const ZoneData = [
    { label: 'Bonamoussadi, Kotto,Mbangue,Sable, Denver,Makepe,Lendi', value: 'Zone 1' },
    { label: 'Rond-Point, Bonantone, Bessengue,Akwa-Nord, Deido, Bepanda,Ecole Publique, Ndogbong,Carrefour Agip,Benedict, Site Cicam,Ange Raphael, Bepanda', value: 'Zone 2' },
    { label: 'Cite des Palmiers, Beedi, Hopital General,PK8,PK9,PK10', value: 'Zone 3' },
    { label: 'Logbessou, Logpom,PK11,PK12,PK13,PK14,PK15,PK16,PK17', value: '4' },
    { label: 'Akwa,Bali,Bonapriso,Bonanjo, Bata Congo,Mboppi, Ndokoti,St.Michel ,Aeroport', value: 'Zone 5' },
    { label: 'Bonaberi , Mabanda , Ndobo,Bonassama,Bekoko', value: 'Zone 6' },
    { label: 'Japoma,Nyalla, Village', value: 'Zone 7' },
  ];

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token.data;
}



function DriverSCreen({driverID}) {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);





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

  const gotochildren = () => {
      navigation.navigate('children', {parent_id: parent_id} )
    };

    // Go back one screen
    const gotocars = () => {
      navigation.navigate('DriverInfo', {parent_id: parent_id} ) // or navigation.pop();
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
    const {name, email, phone, car} = formData;
    const myInit = {
      body: {
        parent_id: parent_id,
        numberOfKids: 0,
        ExponentPushToken: expoPushToken,
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
          const path = `/drivers/${driverID}`;
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
          console.log("driverIDIDI", data);
          console.log("driverID", driverID);
          if (data.driver_id) {

            setFormData((prevFormData) => ({
            ...prevFormData,
            name: data.driverName,
            email: data.email,
            phone: data.phone,
            car: data.car,
          }));

          AsyncStorage.setItem(userId, JSON.stringify(data))
          .then(() => {
            console.log('User data saved successfully');
            setShowOtherBtn(true);
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
        // fetchDataFromStorage(userID);
        fetchInfoFromAPI(driverID);
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
    <MyAppLogo />
      {isLoading ? (
            <ActivityIndicator size="small" color="#2196F3" />
          ) : (
      <>
        <Text style={styles.textField}>Your Informations</Text>
        <Text style={styles.label}>Name</Text>
        {formData.errors.name && <Text style={styles.error}>{formData.errors.name}</Text>}
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange('name', value)}
          value={formData.name}
          placeholder="Enter Your name"
          editable={false}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange('email', value)}
          value={formData.email}
          placeholder="Enter Your Email"
          editable={false}
        />
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange('email', value)}
          value={formData.email}
          placeholder="Phone"
          editable={false}
        />
        <Text style={styles.label}>Car</Text>
        {formData.errors.quarter && <Text style={styles.error}>{formData.errors.quarter}</Text>}
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange('quarter', value)}
          value={formData.quarter}
          placeholder="Ex: Andem, derrière pharmacie"
          editable={false}
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
                Submit
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
        <StickyFooter title="" children={gotochildren} cars={gotocars} screen="parent"/>
    </>
  );
}

const style = StyleSheet.create({
  container: { flex: 1, marginTop: 26, marginBottom: 60,},
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
    backgroundColor: '#f2f2f2',
    color: '#888',
    padding: 10,
    borderRadius: 4,
    fontSize: 16,
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

export default DriverSCreen;