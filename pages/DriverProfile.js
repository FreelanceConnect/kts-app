import React, {useState, useEffect, useRef} from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
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
    car: '',
    zone: '',
    picture: '',
    phone: phone,
    parent_id: parent_id,
    errors: {
    name: '',
    email: '',
    quarter: '',
    zone: '',
  },
  });

  const gotochildren = () => {
      navigation.navigate('Your Students', {driver_id: driverID} )
    };

    // Go back one screen
    const gotocars = () => {
      navigation.navigate('Your Messages', {driver_id: driverID}) // or navigation.pop();
    };

  useEffect(() => {
         const fetchInfoFromAPI = () => {
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
          if (data.driver_id) {

            setFormData((prevFormData) => ({
            ...prevFormData,
            name: data.driverName,
            email: data.email,
            phone: data.phone,
            car: data.car,
            picture: data.picture,
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

     const fetchData = async () => {
        try {
          await fetchInfoFromAPI();
        } catch (error) {
          console.log('Error fetching data:', error);
        }
      };

      fetchData();
  }, []);
  const windowHeight = Dimensions.get('window').height;

  return (
  <>
    <ScrollView>
    <View style={[styles.container, { minHeight: windowHeight }]}>
    <MyAppLogo />
      {isLoading ? (
            <ActivityIndicator size="small" color="#2196F3" />
          ) : (
      <>
          <>
           <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0.3, borderColor: '#000', padding: 10, margin: 5, borderRadius: 5 }}>
             <View>
                    <Text style={styles.driverName}><Text style={styles.boldText}>Name:</Text> {formData.name} </Text>
                    <Text style={styles.driverPhone}><Text style={styles.boldText}>Phone:</Text> {formData.phone} </Text>
                    <Text style={styles.driverCar}><Text style={styles.boldText}>Car:</Text> {formData.car}</Text>
                   <Text style={styles.driverFeedback}>
                    <Text style={styles.boldText}>Rating:</Text> 5 stars
                  </Text>
                  <Text style={styles.driverFeedback}>
                    <Text style={styles.boldText}>Feedback:</Text> Great driver
                  </Text>
                  </View>
                  <View style={styles.driverPicture}>
                    <Image source={{ uri: formData.picture }} style={{ width: 100, height: 120, marginTop: 10, marginTop: -2 }} resizeMode="contain" />
                  </View>
                </View>
                </>

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
    boldText: {
    fontWeight: 'bold',
  },
      driverPicture: {
    marginTop: -5,
    width: 100,
    height: 100,
    borderRadius: 75,
    overflow: 'hidden',
  },
  picture: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    marginTop: -150,

  },
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