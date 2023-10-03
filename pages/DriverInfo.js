import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyAppLogo from '../components/Logo';
import StickyFooter from '../components/StickyFooter';
import { Amplify, API } from 'aws-amplify';

const DriverInfoScreen = ({route}) => {
  const { parent_id } = route.params;

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
          schoolFinishTime: student.schoolFinishTime,
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
          schoolFinishTime: student.schoolFinishTime,
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
            return (
              <View key={child.id} style={styles.childContainer}>
                <View style={styles.infoContainer}>
                  <View style={styles.column}>
                    <Text style={styles.infoLabel}>Student</Text>
                    <Text style={styles.childName}>{child.name}</Text>
                    <>
                      <Text style={styles.infoText}>Pick Up: {child.pickTime ? child.pickTime : 'Waiting for admin'}</Text>
                      <Text style={styles.infoText}>Drop-Off: {child.dropOffTime ? child.dropOffTime : 'Waiting for admin'}</Text>
                      <Text style={styles.infoText}>School End: {child.schoolFinishTime}</Text>
                    </>
                  </View>
                  <View style={[styles.column, styles.largeColumn]}>
                    <Text style={styles.infoLabel}>Driver</Text>
                    <View style={styles.driverInfoContainer}>
                      <View style={styles.driverDetails}>
                        <Text style={styles.driverName}>{child.driver.name}</Text>
                        <Text style={styles.driverPhone}>{(child.driver.phoneNumber === '') ? 'Waiting for the admin' : child.driver.phoneNumber}</Text>
                        <Text style={styles.driverCar}>{(child.driver.carImmatriculation === '') ? 'Waiting for admin' : child.driver.carImmatriculation}</Text>
                        <Text style={styles.driverRating}>
                          Rating: {(child.driver.rating === '') ? 'Waiting for admin' : child.driver.rating} stars
                        </Text>
                        <Text style={styles.driverFeedback}>Feedback: {(child.driver.feedback === '') ? 'Waiting for admin' : child.driver.feedback}</Text>
                      </View>
                      <View style={styles.driverPicture}></View>
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
  <StickyFooter title="" />
  </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    height: 80,
    marginBottom: 8,
    backgroundColor: '#2196F3', // Blue color
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