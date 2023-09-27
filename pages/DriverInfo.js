import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyAppLogo from '../components/Logo';
import StickyFooter from '../components/StickyFooter';
import { Amplify, API } from 'aws-amplify';

const DriverInfoScreen = () => {

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
    fetchChildrenData();
    fetchInfoFromAPI();
  }, []);

  const fetchInfoFromAPI = () => {
        setIsLoading(true);
        API.get(apiName, path, myInit)
        .then((response) => {
          // Add your code here
        const dataFromAPI = response.data;
        console.log("here is data from API", dataFromAPI);
        const childObjects = dataFromAPI.map((student, index) => {
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
      {children.map((child) => (
        <View key={child.id} style={styles.childContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.column}>
              <Text style={styles.infoLabel}>Student</Text>
              <Text style={styles.childName}>{child.name}</Text>
               {isLoading ? (
                <ActivityIndicator size="small" color="#2196F3" />
               ) : (
               <>
               <Text style={styles.infoText}>Pick Time: {child.pickTime ? child.pickTime : 'Waiting for admin'}</Text>
               <Text style={styles.infoText}>Drop-Off Time: {child.dropOffTime ? child.dropOffTime : 'Waiting for admin'}</Text>
              <Text style={styles.infoText}>School Finish Time: {child.schoolFinishTime}</Text>
              </>
              )}
            </View>
            <View style={[styles.column, styles.largeColumn]}>
            <Text style={styles.infoLabel}>Driver</Text>
              {child.driver.name !=="" ? (
                <>
                  <View style={styles.driverInfoContainer}>
                    <View style={styles.driverDetails}>
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#2196F3" />
                      ) : (
                        <Text style={styles.driverName}>{child.driver.name}</Text>
                      )}
                      <Text style={styles.driverPhone}>{child.driver.phoneNumber}</Text>
                      <Text style={styles.driverCar}>{child.driver.carImmatriculation}</Text>
                      <Text style={styles.driverRating}>
                        Rating: {child.driver.rating} stars
                      </Text>
                      <Text style={styles.driverFeedback}>{child.driver.feedback}</Text>
                    </View>
                    <View style={styles.driverPicture}></View>
                  </View>
                </>
              ) : (
                <Text style={styles.waitingText}>Waiting for Admin</Text>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  </ScrollView>
  <StickyFooter title="Your Footer Title" />
  </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  childContainer: {
    marginBottom: 16,
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