import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Amplify, API } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';
import Modal from '../components/MyModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

function StudentForm() {
  const navigation = useNavigation();
  const apiName = 'ktsAPI';
  const [showForm, setShowForm] = useState(true);
  const [btnText, setBtnText] = useState('Add Another Student')
  const [students, setStudents] = useState([]);
  const [parentName, setParentName]=useState('');
  const [parent_id, setParent_id]=useState('');
  const [parentZone, setParentZone]=useState('');
  const [parentQuarter, setParentQuarter]=useState('');
  const [formData, setFormData] = useState({
    name: '',
    transportPlan: '',
    class: '',
    school: '',
    errors: {
      nameError: '',
      transportPlanError: '',
      classError: '',
      schoolError: '',
    },
  });

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleAddStudent = (later) => {
    let isValid = true;
    const { name, transportPlan, class: studentClass, school } = formData;
    const errors = {};

    if (name.trim() === '') {
      errors.nameError = 'Name is required';
      isValid = false;
    }

    if (transportPlan.trim() === '') {
      errors.transportPlanError = 'Transport Plan is required';
      isValid = false;
    }

    if (studentClass.trim() === '') {
      errors.classError = 'Class is required';
      isValid = false;
    }

    if (school.trim() === '') {
      errors.schoolError = 'School is required';
      isValid = false;
    }

    if (isValid) {
    const path = `/students`;
    const myInit = {
      body: {
        student_id: "787978787878kk",
        parent_id: "11111111112",
        parentName: parentName,
        address: {
          quarter: parentQuarter,
          zone: parentZone,
        },
        student: name,
        transportPlan: transportPlan,
        school: school,
      },
      headers: {} // OPTIONAL
    };

    API.post(apiName, path, myInit)
      .then((response) => {
      const newStudent = { name, transportPlan, class: studentClass, school };
      setStudents(prevStudents => {
        const updatedStudents = [...prevStudents, newStudent];
        const studentsObject = { updatedStudents };
        AsyncStorage.setItem('studentsData', JSON.stringify(studentsObject))
          .then(() => {
            console.log('User data saved successfully');
          })
          .catch((error) => {
            console.log('Error saving user data:', error);
          });
        return updatedStudents;
      });
      toggleForm();
      setFormData({
        name: '',
        transportPlan: '',
        class: '',
        school: '',
        errors: {
          nameError: '',
          transportPlanError: '',
          classError: '',
          schoolError: '',
        },
      });
        // Add your code here
      })
      .catch((error) => {
        console.log(error.response);
      });
    } else {
      setFormData({ ...formData, errors });
    }
  };
  const updateButtonText = () => {
    if (showForm) {
      setBtnText('Add Another Student');
    } else {
      setBtnText('Hide Form');
    }
  };

  const toggleForm = () => {
    setShowForm(prevState => !prevState);
    updateButtonText();
  };


// Fetch Parents data from async storage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const parentdata = await AsyncStorage.getItem('parentData');
        if (parentdata !== null) {
          console.log("this is parent's data",parentdata);
          const data= JSON.parse(parentdata);
          setParentName(data.name);
          setParentQuarter(data.quarter);
          setParentZone(data.zone);
        }
        else console.log('no Parent data yet');
      } catch (error) {
        console.log('Error retrieving data:', error);
      }
    };


// Fetch student data from Async Storage
    const fetchStudentData = async () => {
      try {
        const studentdata = await AsyncStorage.getItem('studentsData');
        if (studentdata.lentgh !== 0 && studentdata !== null) {
          const datas= JSON.parse(studentdata);
          console.log("this is student's data", datas);
          // Update the students array
          const updatedStudents = datas.updatedStudents;
          const students = updatedStudents.map(student => ({
            class: student.class,
            name: student.name,
            school: student.school,
            transportPlan: student.transportPlan
          }));

          // Use setStudents to update the state
          setStudents(students);
        }
        else console.log('no Student data yet');
      } catch (error) {
        console.log('Error retrieving data:', error);
      }
    };

    fetchData();
    fetchStudentData();
  }, []);

  return (
   <ScrollView>
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require("../assets/KTSLogo.png")} />
      </View>
      {students.map((student, index) => (
    <View key={index}>
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.transportPlan}>Transport Plan: {student.transportPlan}</Text>
        <Text style={styles.class}>Class: {student.class}</Text>
        <Text style={styles.school}>School: {student.school}</Text>
          <View style={styles.Modalcontainer} key={index}>
            <Modal name={student.name} TransportPlan={student.transportPlan} Class={student.class} School={student.school} />
          </View>
      </View>
    </View>

        </View>
      ))}
      {showForm && (
        <>
          <Text style={styles.label}>Name</Text>
          {formData.errors.nameError && <Text style={styles.error}>{formData.errors.nameError}</Text>}
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            placeholder="Name"
          />

          <Text style={styles.label}>Transport Plan</Text>
          {formData.errors.transportPlanError && <Text style={styles.error}>{formData.errors.transportPlanError}</Text>}
          <TextInput
            style={styles.input}
            value={formData.transportPlan}
            onChangeText={(text) => handleInputChange('transportPlan', text)}
            placeholder="EX: Aller et Retour"
          />

          <Text style={styles.label}>Class</Text>
          {formData.errors.classError && <Text style={styles.error}>{formData.errors.classError}</Text>}
          <TextInput
            style={styles.input}
            value={formData.class}
            onChangeText={(text) => handleInputChange('class', text)}
            placeholder="Class"
          />

          <Text style={styles.label}>School</Text>
          {formData.errors.schoolError && <Text style={styles.error}>{formData.errors.schoolError}</Text>}
          <TextInput
            style={styles.input}
            value={formData.school}
            onChangeText={(text) => handleInputChange('school', text)}
            placeholder="School"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#2196F3' }]} onPress={handleAddStudent}>
              <Text style={[styles.textStyle, { backgroundColor: '#2196F3' }]}>Add Student</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {students.length ? (
        <View style={styles.containerContinue}>
          <View style={styles.element1}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#2196F3' }]} onPress={toggleForm}>
              <Text style={[styles.textStyle, { backgroundColor: '#2196F3' }]} >{btnText}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.element2}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#2196F3' }]} onPress={() => navigation.navigate('DriverInfo')}>
              <Text style={[styles.textStyle, { backgroundColor: '#2196F3' }]} >Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  </ScrollView>
  );
}

const styles = StyleSheet.create({
   students: {
     fontWeight: 'bold',
     fontSize: '25',
     textAlign: 'center',
   },
    textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 150,
    height: 150
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
    button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginVertical: 10,
    width: '100%',
  },
    cardContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  cardImageContainer: {
    marginRight: 10,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  transportPlan: {
    fontSize: 16,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  class: {
    fontSize: 16,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  school: {
    fontSize: 16,
    marginBottom: 2,
    fontWeight: 'bold',
  },
});

export default StudentForm;