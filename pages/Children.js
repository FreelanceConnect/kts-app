import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Amplify, API } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';
import Modal from '../components/MyModal';

function StudentForm() {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
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
      const newStudent = { name, transportPlan, class: studentClass, school };
      setStudents([...students, newStudent]);
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
    } else {
      setFormData({ ...formData, errors });
    }
  };

  const handleSubmit = (later) => {
    const { name, transportPlan, class: studentClass, school } = formData;
    let isValid = true;
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

    if (isValid || later) {
      // API request logic here
      // ...

      navigation.navigate('DriverInfo');
    } else {
      setFormData({ ...formData, errors });
    }
  };

  console.log(students.lentgh);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require("../assets/KTSLogo.png")} />
        </View>
          {students.length ? (
            <Text style={styles.studentInfo}>
              Click on each student to see or update information
            </Text>
          ) : null}
        {students.map((student, index) => (
          <View style={styles.Modalcontainer} key={index}>
            <Modal name={student.name} TransportPlan={student.transportPlan} Class={student.class} School={student.school}/>
          </View>
        ))}

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



        {students.length ? (

                <View style={styles.containerContinue}>
      <View style={styles.element1}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2196F3' }]}
          >
        <Text style={[styles.textStyle, { backgroundColor: '#2196F3' }]} onPress={handleAddStudent}>Add Another student</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.element2}>
       <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2196F3' }]}
          >
         <Text style={[styles.textStyle, { backgroundColor: '#2196F3' }]} onPress={() => handleSubmit(true)}>Continue</Text>
      </TouchableOpacity>
      </View>
    </View>
        ) : (
        <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2196F3' }]}
          >
        <Text style={[styles.textStyle, { backgroundColor: '#2196F3' }]} onPress={handleAddStudent} >Add Student</Text>
          </TouchableOpacity>
        </View>

        )}
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
});

export default StudentForm;