import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyAppLogo from '../components/Logo';
import StickyFooter from '../components/StickyFooter';
import { Amplify, API } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';

const DriverInfoScreen = ({route}) => {
  const { parent_id } = route.params;
  const navigation = useNavigation();

  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const apiName = 'ktsAPI';
  const path = `/students`;
  const myInit = {
       headers: { 
       // Allow POST method
        },
      response: true,
  };

    const gotoprofile = () => {
      navigation.goBack();
      navigation.goBack();
    };

    // Go back one screen
    const gotoChidren = () => {
      navigation.goBack();
    };

  useEffect(() => {
    console.log("Here is parent_id in driver info", parent_id);
    fetchData();
    fetchChildrenData();
    fetchInfoFromAPI();
  }, []);



    const fetchData = async () => {
      try {
        const parentdata = await AsyncStorage.getItem('parentData');
        if (parentdata !== null) {
          const data= JSON.parse(parentdata);
          setParentName(data.name);
          setParentQuarter(data.quarter);
          setParentZone(data.zone);
          setParent_id(data.parent_id);
        }
        else console.log('no Parent data yet');
      } catch (error) {
        console.log('Error retrieving data:', error);
      }
    };

  const fetchInfoFromAPI = () => {
        setIsLoading(true);
        API.get(apiName, path, myInit)
        .then((response) => {
          // Add your code here
        const dataFromAPI = response.data;
        const childObjects = dataFromAPI.map((student, index) => {
        const currentTime = new Date().getHours(); // Get the current hour
        if (currentTime < 12) {
          student.driver = student.driverMorning; // Assign driverMorning if it's before noon
        } else {
          student.driver = student.driverEvening; // Assign driverEvening if it's noon or later
        }
        return {
          id: index + 1,
          name: student.student,
          parent_id: student.parent_id,
          driver: {
            picture: student.driver.picture,
            name: student.driver.name,
            phoneNumber: student.driver.phoneNumber,
            carImmatriculation: student.driver.carImmatriculation,
            rating: student.driver.rating,
            feedback: student.driver.feedback,
          },
          pickTime: student.pickTime,
          dropOffTime: student.dropOffTime,
          schoolOffTime: student.schoolOffTime,
        };
      });
      setChildren(childObjects);
      setIsLoading(false);

        })
        .catch((error) => {
          console.log(error.response);
          setIsLoading(false);
        });
  }


  // Fetch driver's data from Async storage
  const fetchChildrenData = async () => {
    try {
      const storedChildren = await AsyncStorage.getItem('studentsData');
      if (storedChildren) {
        const updateChildren = JSON.parse(storedChildren);
        const storedData = updateChildren.updatedStudents;
        const childObjects = storedData.map((student, index) => {

        return {
          id: index + 1,
          name: student.student,
          driver: {
            picture: student.driver.picture,
            name: student.driver.name,
            phoneNumber: student.driver.phoneNumber,
            carImmatriculation: student.driver.carImmatriculation,
            rating: student.driver.rating,
            feedback: student.driver.feedback,
          },
          pickTime: student.pickTime,
          dropOffTime: student.dropOffTime,
          schoolFinishTime: student.schoolOffTime,
        };
      });
      setChildren(childObjects);



      }
      else {
       console.log("No data yet");      }
    } catch (error) {
      console.log('Error fetching children data:', error);
    }
  };

  return (
    <>
    <ScrollView>
    <MyAppLogo />
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#2196F3" />
      ) : (
        children.map((child) => {
          if (child.parent_id === parent_id) {
            if (child.schoolOffTime === '1') {
              schoolClosingTime = '1:30PM';
            } else if (child.schoolOffTime === '2') {
              schoolClosingTime = '2PM';
            } else if (child.schoolOffTime === '3') {
              schoolClosingTime = '2:30PM';
            } else {
              schoolClosingTime = 'Not Specified';
            }

            return (
              <View key={child.id} style={styles.childContainer}>
                <View style={styles.infoContainer}>
                  <View style={styles.column}>
                    <Text style={styles.infoLabel}>Student</Text>
                    <Text style={styles.childName}>{child.name}</Text>
                    <>
                      <Text style={styles.infoText}>Pick Up: {child.pickTime ? child.pickTime : 'Waiting for admin'}</Text>
                      <Text style={styles.infoText}>Drop-Off: {child.dropOffTime ? child.dropOffTime : 'Waiting for admin'}</Text>
                      <Text style={styles.infoText}>School closing time: {schoolClosingTime}</Text>
                    </>
                  </View>
                  <View style={[styles.column, styles.largeColumn]}>
                    <Text style={styles.infoLabel}>Driver</Text>
                      <View style={styles.driverInfoContainer}>
                        {(child.driver.name==="") ? (
                          <Text style={styles.waitingText}>Waiting for the admin</Text>
                        ) : (
                          <>
                            <View style={styles.driverDetails}>
                              <Text style={styles.driverName}>Name: {child.driver.name}</Text>
                              <Text style={styles.driverPhone}>Phone: {child.driver.phoneNumber}</Text>
                              <Text style={styles.driverCar}>Car: {child.driver.carImmatriculation}</Text>
                              <Text style={styles.driverRating}>Rating: {child.driver.rating} stars</Text>
                              <Text style={styles.driverFeedback}>Feedback: {child.driver.feedback}</Text>
                            </View>
                            <View style={styles.driverPicture}>
                               <Image source={{ uri: child.driver.picture }} style={{ width: 100, height: 120, marginTop: 10 }} resizeMode="contain" />
                            </View>
                          </>
                        )}
                      </View>
                  </View>
                </View>
              </View>
            );
          } else {
            return null; // Skip rendering for other children
          }
        })
      )}
    </View>
  </ScrollView>
    <StickyFooter title="" profile={gotoprofile} children={gotoChidren}/>
  </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 40,
  },
  childContainer: {
    marginBottom: 30,
  },
  childName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
  },
  column: {
    flex: 2,
    paddingHorizontal: 8,
  },
  largeColumn: {
    flex: 3,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
  },
  driverInfoContainer: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  driverPicture: {
    width: 80,
    // Blue color
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  driverPhone: {
    marginBottom: 4,
  },
  driverCar: {
    marginBottom: 4,
  },
  driverRating: {
    marginBottom: 4,
  },
  driverFeedback: {
    fontStyle: 'italic',
  },
  waitingText: {
    fontStyle: 'italic',
  },
});

export default DriverInfoScreen;