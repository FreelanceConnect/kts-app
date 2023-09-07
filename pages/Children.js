// import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Image, ScrollView } from 'react-native';
// import { useAppContext } from '../src/AppContext';


// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Children = () => {
//   const [inputFields, setInputFields] = useState([{ id: 1, value: '' }]);
//   const [transportPlan, setTransportPlan] = useState('');
//   const [additionalFields, setAdditionalFields] = useState({
//     class: '',
//     school: ''
//   });
//   const { data, setData } = useAppContext();

//   const handleInputChange = (id, text) => {
//     const updatedFields = inputFields.map(field => {
//       if (field.id === id) {
//         return { ...field, value: text };
//       }
//       return field;
//     });
//     setInputFields(updatedFields);
//   };

//   const handleAddMore = () => {
//     const newField = {
//       id: inputFields.length + 1,
//       value: ''
//     };
//     setInputFields([...inputFields, newField]);
//   };

//   const handleRemove = (id) => {
//     const updatedFields = inputFields.filter(field => field.id !== id);
//     setInputFields(updatedFields);
//   };

//   const handleTransportPlanChange = (text) => {
//     setTransportPlan(text);
//   };

//   const handleAdditionalFieldChange = (fieldName, text) => {
//     setAdditionalFields(prevState => ({
//       ...prevState,
//       [fieldName]: text
//     }));
//   };

//   const handleSubmit = () => {
//     console.log(data);
//     // Perform form submission logic here
//     // console.log('Submitted Input Fields:', inputFields);
//     // console.log('Selected Transport Plan:', transportPlan);
//     // console.log('Home Address:', additionalFields.homeAddress);
//     // console.log('School:', additionalFields.school);
//   };

//     useEffect(() => {
//     const fetchData = async () => {
//       try {
//       const parentdata = await AsyncStorage.getItem('parentData');
//         if (parentdata !== null) {
//           console.log('Parent retrieved data:', parentdata);
//           if (parentdata !== null) {
//             // setData(parentdata);
//             // navigation.navigate('children');
//           }
//         }
//         else console.log('no user data yet');
//       } catch (error) {
//         console.log('Error retrieving data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//   <ScrollView>
//     <View style={styles.container}>
//       <View style={styles.imageContainer}>
//         <Image style={styles.image} source={require("../assets/KTSLogo.png")} />
//       </View>

//       <Text style={styles.textField}>Please enter your information here</Text>
//       {inputFields.map(field => (
//         <View style={styles.inputContainer} key={field.id}>
//           <TextInput
//             style={styles.input}
//             onChangeText={(text) => handleInputChange(field.id, text)}
//             value={field.value}
//             placeholder="Enter value"
//           />
//           {inputFields.length > 1 && (
//             <TouchableOpacity onPress={() => handleRemove(field.id)} style={styles.deleteButton}>
//               <Text style={styles.deleteButtonText}>X</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       ))}
//       <TouchableOpacity onPress={handleAddMore} style={styles.addButton}>
//         <Text style={styles.addButtonText}>Add More</Text>
//       </TouchableOpacity>

//       <TextInput
//         style={styles.transportPlanInput}
//         onChangeText={handleTransportPlanChange}
//         value={transportPlan}
//         placeholder="Enter transport plan"
//       />

//       <TextInput
//         style={styles.additionalFieldInput}
//         onChangeText={(text) => handleAdditionalFieldChange('class', text)}
//         value={additionalFields.homeAddress}
//         placeholder="Enter Class"
//       />

//       <TextInput
//         style={styles.additionalFieldInput}
//         onChangeText={(text) => handleAdditionalFieldChange('school', text)}
//         value={additionalFields.school}
//         placeholder="Enter school"
//       />
//       <Button title="Submit" onPress={handleSubmit} />
//     </View>
//   </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     paddingHorizontal: 10,
//   },
//   deleteButton: {
//     paddingHorizontal: 12,
//     marginLeft: 10,
//     backgroundColor: 'red',
//     borderRadius: 50,
//   },
//   deleteButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   addButton: {
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   addButtonText: {
//     color: 'blue',
//     textDecorationLine: 'underline',
//   },
//   transportPlanInput: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
//   additionalFieldInput: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
// });

// export default Children;



import React, { useState } from 'react';

function StudentForm() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [studentInfo, setStudentInfo] = useState({});
  const [selectedName, setSelectedName] = useState('');

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleInfoChange = (key, value) => {
    setStudentInfo({ ...studentInfo, [key]: value });
  };

  const handleAddStudent = () => {
    const newStudent = { name, ...studentInfo };
    setStudents([...students, newStudent]);
    setName('');
    setStudentInfo({});
  };

  const handleNameClick = (student) => {
    setSelectedName(student.name);
    setName(student.name);
    setStudentInfo({ ...student });
  };

  const handleDelete = (name) => {
    const updatedStudents = students.filter((student) => student.name !== name);
    setStudents(updatedStudents);
    if (selectedName === name) {
      setSelectedName('');
      setName('');
      setStudentInfo({});
    }
  };

  return (
   <ScrollView> 
    <View style={styles.container}>
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={require("../assets/KTSLogo.png")} />
    </View>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={handleNameChange}
        placeholder="Student Name"
      />
      <TextInput
        style={styles.input}
        value={studentInfo.age}
        onChangeText={(text) => handleInfoChange('age', text)}
        placeholder="Age"
      />
      <TextInput
        style={styles.input}
        value={studentInfo.grade}
        onChangeText={(text) => handleInfoChange('grade', text)}
        placeholder="Grade"
      />
      <TextInput
        style={styles.input}
        value={studentInfo.address}
        onChangeText={(text) => handleInfoChange('address', text)}
        placeholder="Address"
      />
      <Button title="Add Student" onPress={handleAddStudent} />
      {students.map((student, index) => (
        <View key={index} style={styles.studentContainer}>
          <TouchableOpacity
            onPress={() => handleNameClick(student)}
            style={[
              styles.studentNameContainer,
              selectedName === student.name && styles.selectedNameContainer,
            ]}
          >
            <Text
              style={[
                styles.studentName,
                selectedName === student.name && styles.selectedNameText,
              ]}
            >
              {student.name}
            </Text>
            <TouchableOpacity onPress={() => handleDelete(student.name)}>
              <Text style={styles.deleteButton}>X</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  studentContainer: {
    marginBottom: 10,
  },
  studentNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  selectedNameContainer: {
    backgroundColor: '#cce6ff',
  },
  studentName: {
    flex: 1,
    fontSize: 16,
  },
  selectedNameText: {
    fontWeight: 'bold',
  },
  deleteButton: {
    color: 'red',
    marginLeft: 10,
  },
 imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 150,
    height: 150    },
});

export default StudentForm;