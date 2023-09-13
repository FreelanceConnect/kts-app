import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DriverInfoScreen = () => {
  // Sample data for demonstration
  const children = [
    {
      id: 1,
      name: 'Sherina',
      driver: {
        picture: 'driver1.jpg',
        name: 'Abada',
        phoneNumber: '+1234567890',
        carImmatriculation: 'ABC123',
        rating: 4.5,
        feedback: 'Great driver!',
      },
      pickTime: '08:00 AM',
      dropOffTime: '08:30 AM',
      schoolFinishTime: '03:00 PM',
    },
    {
      id: 2,
      name: 'Emily',
      driver: null, // No driver assigned yet
      pickTime: '09:00 AM',
      dropOffTime: '09:30 AM',
      schoolFinishTime: '03:00 PM',
    },
    // Add more children data as needed
  ];

  return (
    <View style={styles.container}>
      {children.map((child) => (
        <View key={child.id} style={styles.childContainer}>
          <Text style={styles.childName}>{child.name}</Text>
          <View style={styles.infoContainer}>
            <View style={styles.column}>
              <Text style={styles.infoLabel}>Student Info:</Text>
              <Text style={styles.infoText}>Pick Time: {child.pickTime}</Text>
              <Text style={styles.infoText}>Drop-Off Time: {child.dropOffTime}</Text>
              <Text style={styles.infoText}>School Finish Time: {child.schoolFinishTime}</Text>
            </View>
            <View style={[styles.column, styles.largeColumn]}>
              {child.driver ? (
                <>
                  <Text style={styles.infoLabel}>Driver Info:</Text>
                  <View style={styles.driverInfoContainer}>
                    <View style={styles.driverDetails}>
                      <Text style={styles.driverName}>{child.driver.name}</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    paddingHorizontal: 8,
  },
  largeColumn: {
    flex: 2,
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