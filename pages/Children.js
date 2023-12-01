import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { MaterialCommunityIcons } from '@expo/vector-icons';

import MyAppLogo from '../components/Logo';

import React, { useState, useEffect } from "react";
import { Amplify, API } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import Modal from "../components/MyModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import StickyFooter from '../components/StickyFooter';
import Dropdown from '../components/Dropdown';

function StudentForm({ route }) {
  const { parent_id, parentName, parentQuarter, parentZone} = route.params;
  const navigation = useNavigation();
  const apiName = "ktsAPI";
  const [showForm, setShowForm] = useState(true);
  const [shownext, setShowNext] = useState(false);
  const [otherSchool, setShowOtherSchool] = useState(false);
  const [btnText, setBtnText] = useState("Add Another Child");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [students, setStudents] = useState([]);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    transportPlan: "",
    class: "",
    school: "",
    schoolOffTime: "",
    schoolOffTimeWednesday: "",
    schoolOffTimeFriday: "",
    errors: {
      nameError: "",
      transportPlanError: "",
      classError: "",
      schoolError: "",
      schoolOffTime: "",
      schoolOffTimeWednesday: "",
      schoolOffTimeFriday: "",
    },
  });

  const transportPlanData = [
    { label: 'Both Ways', value: '1' },
    { label: 'House to School', value: '2' },
    { label: 'School to House', value: '3' },
  ];

  const SchoolData = [
    { label: 'Anderson International School - Bonamoussadi', value: '1' },
    { label: 'British Isles International School-Makepe', value: '2' },
    { label: 'College Duvaal - Beedi', value: '3' },
    { label: 'College Laval - Bonamoussadi', value: '4' },
    { label: 'College Libermann - Akwa', value: '4' },
    { label: 'Dewey International School of Arts & Science - Denver', value: '5' },
    { label: 'Divine International Nursery & Primary School - Denver', value: '6' },
    { label: 'Duvaal International School - Beedi', value: '7' },
    { label: 'Ecole la Difference - Santa Barbara', value: '8' },
    { label: 'Ecole Maternelle & Primaire L Aubaine-Makepe', value: '9' },
    { label: 'Ecole Maternelle et Primaire Sira - Makepe', value: '10' },
    { label: 'Gifted Kids Christian Academy - Makepe', value: '11' },
    { label: 'Integrity For All Nursery & Primary School- Bssasi', value: '12' },
    { label: 'Kathy Nursery and Primary School - Bssadi', value: '13' },
    { label: 'New Vision International Kindergarten Nursery & Primary School (NEVIKAPS)', value: '14' },
    { label: 'Russian Inernational School- Makepe', value: '15' },
    { label: 'Other', value: 'Enter new School' },
  ];

  const schoolOffTimeData = [
    { label: '12:00PM', value: '1' },
    { label: '12:30PM', value: '2' },
    { label: '1:00PM', value: '3' },
    { label: '1:30PM', value: '4' },
    { label: '2:00PM', value: '5' },
    { label: '2:30PM', value: '6' },
    { label: '3:00PM', value: '7' },
    { label: '3:30PM', value: '8' },
    { label: '4:00PM', value: '9' },
    { label: '4:30PM', value: '10' },
    { label: '5:00PM', value: '11' },
    { label: '5:30PM', value: '12' },
    { label: '6:00PM', value: '13' },
    { label: 'Week-end', value: '14' },
  ];

    const gotoprofile = () => {
       navigation.navigate('Welcome to KTS' );
    };

    // Go back one screen
    const gotocars = () => {
      navigation.navigate('DriverInfo', {parent_id: parent_id} ) // or navigation.pop();
    };
     

    useEffect(() => {
    if (formData.school === 'Enter new School') {
      setShowOtherSchool(true);
    } 
  }, [formData]);


  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value }); 
    if (formData.school === 16) {
      setShowOtherSchool(true);
    }
  };

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNum = Math.random().toString(36).substring(2);
    return `${timestamp}-${randomNum}`;
  };


  // Validate and submit data
  const handleAddStudent = (later) => {
    let isValid = true;
    const { name, transportPlan, class: studentClass, school, schoolOffTime, schoolOffTimeWednesday, schoolOffTimeFriday } = formData;
    const errors = {};

    if (name.trim() === "") {
      errors.nameError = "Name is required";
      isValid = false;
    }

    if (transportPlan.trim() === "") {
      errors.transportPlanError = "Please select a transport plan";
      isValid = false;
    }

    if (studentClass.trim() === "") {
      errors.classError = "Class is required";
      isValid = false;
    }

    if (school.trim() === "") {
      errors.schoolError = "Please select a school";
      isValid = false;
    }

    if (schoolOffTime.trim() === "") {
      errors.schoolOffTimeError = "Please select school closing time";
      isValid = false;
    }
    if (schoolOffTimeWednesday.trim() === "") {
      errors.schoolOffTimeErrorWednesday = "Please select Wednesday school closing time";
      isValid = false;
    }
    if (schoolOffTimeFriday.trim() === "") {
      errors.schoolOffTimeErrorFriday = "Please select Friday school closing time";
      isValid = false;
    }
    // Validate form Data
    if (isValid) {
     setIsAddingChild(true);
      const student_id = generateUniqueId();
      const path = `/students`;
      const myInit = {
        body: {
          student_id: student_id,
          student: name,
          parent_id: parent_id,
          parentName: parentName,
          transportPlan: transportPlan,
          school: school,
          class: studentClass,
          address: {
            quarter: parentQuarter,
            zone: parentZone,
          },
          driver: {
            picture: "",
            name: "",
            phoneNumber: "",
            carImmatriculation: "",
            rating: "",
            feedback: "",
          },
          driverMorning: {
            picture: "",
            name: "",
            phoneNumber: "",
            carImmatriculation: "",
            rating: "",
            feedback: "",
          },
          driverEvening: {
            picture: "",
            name: "",
            phoneNumber: "",
            carImmatriculation: "",
            rating: "",
            feedback: "",
          },
          pickTime: "",
          dropOffTime: "",
          schoolOffTime: schoolOffTime,
          schoolOffTimeWednesday: schoolOffTimeWednesday,
          schoolOffTimeFriday: schoolOffTimeFriday,
        },
        headers: {}, // OPTIONAL
      };

      API.post(apiName, path, myInit)
        .then((response) => {
          const newStudent = myInit.body;
          setStudents((prevStudents) => {
            const updatedStudents = [...prevStudents, newStudent];
            const studentsObject = { updatedStudents };
            AsyncStorage.setItem("studentsData", JSON.stringify(studentsObject))
              .then(() => {
                console.log("User data saved successfully");
                setIsAddingChild(false);
                setShowNext(true);
              })
              .catch((error) => {
                console.log("Error saving user data:", error);
                setIsLoading(false);
              });
            return updatedStudents;
          });
          toggleForm();
          setFormData({
            name: "",
            transportPlan: "",
            class: "",
            school: "",
            errors: {
              nameError: "",
              transportPlanError: "",
              classError: "",
              schoolError: "",
            },
          });
          // Add your code here
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    } else {
      setFormData({ ...formData, errors });
    }
  };
  const updateButtonText = () => {
    if (showForm) {
      setBtnText("Add Another Child");
    } else {
      setBtnText("Show Chidren");
    }
  };

  const toggleForm = () => {
    setShowForm((prevState) => !prevState);
    updateButtonText();
  };

  // Fetch Parents data from async storage
  useEffect(() => {

    const fetchInfoFromAPI = () => {
      setIsLoading(true);
      const apiName = "ktsAPI";
      const path = `/students`;
      const myInit = {
        headers: {
          // Allow POST method
        },
        response: true,
      };
      API.get(apiName, path, myInit)
        .then((response) => {
          // Add your code here
          const data = response.data;
          setIsLoading(false);
          const students = data.map((student) => {
            const myparent_id = student.parent_id;
            if (parent_id===myparent_id) {
              setShowForm(false);
              setShowNext(true);
            }

           const currentTime = new Date().getHours(); // Get the current hour
            if (currentTime < 12) {
              student.driver = student.driverMorning; // Assign driverMorning if it's before noon
            } else {
              student.driver = student.driverEvening; // Assign driverEvening if it's noon or later
            }

            return {
              student_id: student.student_id,
              student: student.student,
              parent_id: student.parent_id,
              parentName: student.parentName,
              transportPlan: student.transportPlan,
              school: student.school,
              class: student.class,
              schoolOffTime: student.schoolOffTime,
              schoolOffTimeWednesday: student.schoolOffTimeWednesday,
              schoolOffTimeFriday: student.schoolOffTimeFriday,
              address: {
                quarter: student.parentQuarter,
                zone: student.parentZone,
              },
              driver: {
                picture: student.driver.picture,
                name: student.driver.name,
                phoneNumber: student.driver.phoneNumber,
                carImmatriculation: student.driver.carImmatriculation,
                rating: student.driver.rating,
                feedback: student.driver.feedback,
              },
              driverMorning: {
                picture: student.driverMorning.picture,
                name: student.driverMorning.name,
                phoneNumber: student.driverMorning.phoneNumber,
                carImmatriculation: student.driverMorning.carImmatriculation,
                rating: student.driverMorning.rating,
                feedback: student.driverMorning.feedback,
              },
              driverEvening: {
                picture: student.driverEvening.picture,
                name: student.driverEvening.name,
                phoneNumber: student.driverEvening.phoneNumber,
                carImmatriculation: student.driverEvening.carImmatriculation,
                rating: student.driverEvening.rating,
                feedback: student.driverEvening.feedback,
              },
              pickTime: student.pickTime,
              dropOffTime: student.dropOffTime,
            };
          
          });
          setStudents(students);

        })
        .catch((error) => {
          console.log(error.response);
        });
    };

    // Fetch student data from Async Storage
    const fetchStudentData = async () => {
      try {
        const studentData = await AsyncStorage.getItem("studentsData");
        if (studentData && studentData.length !== 0) {
          const parsedData = JSON.parse(studentData);
          const updatedStudents = parsedData.updatedStudents;
          const students = updatedStudents.map((student) => ({
            student_id: student.student_id,
            student: student.student,
            parent_id: student.parent_id,
            parentName: student.parentName,
            transportPlan: student.transportPlan,
            school: student.school,
            class: student.class,
            schoolOffTime: student.schoolOffTime,
            schoolOffTimeWednesday: student.schoolOffTimeWednesday,
            schoolOffTimeFriday: student.schoolOffTimeFriday,
            address: {
              quarter: student.parentQuarter,
              zone: student.parentZone,
            },
            driver: {
              picture: student.driver.picture,
              name: student.driver.name,
              phoneNumber: student.driver.phoneNumber,
              carImmatriculation: student.driver.carImmatriculation,
              rating: student.driver.rating,
              feedback: student.driver.feedback,
            },
            driverMorning: {
              picture: student.driverMorning.picture,
              name: student.driverMorning.name,
              phoneNumber: student.driverMorning.phoneNumber,
              carImmatriculation: student.driverMorning.carImmatriculation,
              rating: student.driverMorning.rating,
              feedback: student.driverMorning.feedback,
            },
            driverEvening: {
              picture: student.driverEvening.picture,
              name: student.driverEvening.name,
              phoneNumber: student.driverEvening.phoneNumber,
              carImmatriculation: student.driverEvening.carImmatriculation,
              rating: student.driverEvening.rating,
              feedback: student.driverEvening.feedback,
            },
            pickTime: student.pickTime,
            dropOffTime: student.dropOffTime,
          }));

          setShowForm(false);
          setStudents(students);
            navigation.navigate('DriverInfo', {parent_id: parent_id} );
        } else {
          console.log("No student data yet");
        }
      } catch (error) {
        console.log("Error retrieving data:", error);
      }
    };

    const deleteDataFromAsyncStorage = async (key) => {
      try {
        await AsyncStorage.removeItem(key);
        console.log("Data successfully deleted from async storage.");
      } catch (error) {
        console.log("Error deleting data from async storage:", error);
      }
    };

    // fetchStudentData();
    fetchInfoFromAPI();
    // deleteDataFromAsyncStorage("KTS-P-671515042");
    // deleteDataFromAsyncStorage("studentsData");
  }, []);

  const openModal = () => {
    setModalVisible(true);
  };

const dynamicStyle = {
  backgroundColor: btnText === "Add Another Child" ? "#2196F3" : "#ff1a1a",
};

  return (
    <>
    <ScrollView>
      <View style={styles.container}>
      <MyAppLogo />
{isLoading ? (
  <ActivityIndicator size="large" color="#2196F3" />
) : (
  <>
    {students.map((student, index) => {
      if (student.parent_id === parent_id && !showForm) {
        const studentTime = student.schoolOffTime;
        const currentDate = new Date();
        const dayOfWeek = currentDate.getDay();

        let ComputedSchoolOffTime = student.schoolOffTime;
        if (dayOfWeek===3) {
          ComputedSchoolOffTime = student.schoolOffTimeWednesday;
        }
        if (dayOfWeek===5) {
          ComputedSchoolOffTime = student.schoolOffTimeFriday;
        }
        if (dayOfWeek===6 || dayOfWeek=== 0) {
          ComputedSchoolOffTime = '14';
        }


       const schoolName = SchoolData.find(item => item.value === student.school)?.label || student.school;


       const transportPlan = transportPlanData.find(item => item.value === student.transportPlan)?.label || 'Not Specified';

        const schoolClosingTime = schoolOffTimeData.find(item => item.value === ComputedSchoolOffTime)?.label || 'Not Specified';
        return (
          <View key={index}>
            <View style={styles.cardContainer}>
                <TouchableOpacity>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#2196F3', padding: 10, margin: 5, borderRadius: 5, }}>
                      <Text style={styles.infoLabel}>
                        <Text style={{ fontWeight: 'bold' }}>Name:</Text> {student.student}
                      </Text>
                      <View style={{ marginLeft: -10 }}>
                        <Modal
                          modalVisible={modalVisible}
                          setModalVisible={setModalVisible}
                          name={student.student}
                          TransportPlan={transportPlan}
                          Class={student.class}
                          School={schoolName}
                          EndTime={schoolClosingTime}
                          transportPlanData={transportPlanData}
                          SchoolData={SchoolData}
                          schoolOffTimeData={schoolOffTimeData}
                          handleInputChange={handleInputChange}
                          isName={true}
                        />

                      </View>
                    </View>
                  </TouchableOpacity>
                <View style={styles.studentInfoContainer}>
                 <TouchableOpacity>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0.3, borderColor: '#000', padding: 10, margin: 5, borderRadius: 5 }}>
                   <Text style={styles.studentPhone}>
                      <Text style={{ fontWeight: 'bold', }}>Transport Plan: </Text>
                      {transportPlan}{'\n'}
                      <Text style={{ fontWeight: 'bold', }}>Status: </Text>
                      Pending{'\n'}
                      <Text style={styles.infoText}><Text style={{ fontWeight: 'bold', }}>Pick-UP Time: </Text> {student.pickTime ? student.pickTime : 'Waiting for admin'}</Text>
                    <Text style={styles.studentGrade}>{'\n'}
                      <Text style={{ fontWeight: 'bold', }}>Class: </Text>{student.class}
                    </Text>

                    </Text>
                      <View style={{ marginLeft: 10 }}>
                        <Modal
                          modalVisible={modalVisible}
                          setModalVisible={setModalVisible}
                          name={student.student}
                          TransportPlan={transportPlan}
                          Class={student.class}
                          School={schoolName}
                          EndTime={schoolClosingTime}
                          transportPlanData={transportPlanData}
                          SchoolData={SchoolData}
                          schoolOffTimeData={schoolOffTimeData}
                          handleInputChange={handleInputChange}
                          isTransportPlan={true}
                          isClass={true}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                <TouchableOpacity>
                  <View>
                   <MaterialCommunityIcons name="account-box" size={70} color="#2196F3" /> 
                  </View>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0.3, borderColor: '#2196F3', padding: 10, margin: 5, borderRadius: 5 }}>
                  <View style={styles.schoolClass}>
                    <Text style={styles.studentID}>
                      School: {schoolName}
                    </Text>
                      <Text style={styles.studentID}>
                        School closing time: {schoolClosingTime}
                      </Text>
                  </View>
                      <View>
                        <Modal
                          modalVisible={modalVisible}
                          setModalVisible={setModalVisible}
                          name={student.student}
                          TransportPlan={transportPlan}
                          Class={student.class}
                          School={schoolName}
                          EndTime={schoolClosingTime}
                          transportPlanData={transportPlanData}
                          SchoolData={SchoolData}
                          schoolOffTimeData={schoolOffTimeData}
                          handleInputChange={handleInputChange}
                          isSchool={true}
                          isEndTime={true}
                        />
                      </View>
                    </View>
                    </TouchableOpacity>

                      <View>
                  <View>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0.3, borderColor: '#000', padding: 10, margin: 5, borderRadius: 5 }}>
                        {(student.driver.name==="") ? (
                          <View>
                          <Text style={styles.waitingText}>Please Wait for the admin to assign drivers to this child</Text>
                          </View>
                        ) : (
                          <>
                            <View>
                              <Text style={styles.driverName}>Name: {student.driver.name}</Text>
                              <Text style={styles.driverPhone}>Phone: {student.driver.phoneNumber}</Text>
                              <Text style={styles.driverCar}>Car: {student.driver.carImmatriculation}</Text>
                              <Text style={styles.driverRating}>Rating: {student.driver.rating} stars</Text>
                              <Text style={styles.driverFeedback}>Feedback: {student.driver.feedback}</Text>
                            </View>
                            <View style={styles.driverPicture}>
                               <Image source={{ uri: student.driver.picture }} style={{ width: 100, height: 120, marginTop: 10, marginTop: -2 }} resizeMode="contain" />
                            </View>
                          </>
                        )}
                    </View>
                  </View>
                </View>

            </View>
          </View>
        );
      }
    })}
    {showForm && (
      <>
        <Text style={styles.label}>Name of child</Text>
        {formData.errors.nameError && (
          <Text style={styles.error}>{formData.errors.nameError}</Text>
        )}
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleInputChange("name", text)}
          placeholder="Name"
        />

        <Text style={styles.label}>Class</Text>
        {formData.errors.classError && (
          <Text style={styles.error}>{formData.errors.classError}</Text>
        )}
        <TextInput
          style={styles.input}
          value={formData.class}
          onChangeText={(text) => handleInputChange("class", text)}
          placeholder="Class"
        />

        <Text style={styles.label}>Transport Plan</Text>
        {formData.errors.transportPlanError && (
          <Text style={styles.error}>
            {formData.errors.transportPlanError}
          </Text>
        )}
        <Dropdown data= {transportPlanData} label="transportPlan" handleValueChange={handleInputChange}/>


        <Text style={styles.label}>School</Text>
        {formData.errors.schoolError && (
          <Text style={styles.error}>{formData.errors.schoolError}</Text>
        )}
        <Dropdown data= {SchoolData} label="school" handleValueChange={handleInputChange}/>
      { otherSchool && 
      (<>
      <Text style={styles.label}>If other, Enter the School</Text>
      <TextInput
          style={styles.input}
          value={formData.school}
          onChangeText={(text) => handleInputChange("school", text)}
          placeholder="Ex: Canadian School"
        />
        </>
        ) }

        <View>
         <Text style={styles.label}>School Closing Time (Regular Days)</Text>
        {formData.errors.schoolOffTimeError && (
          <Text style={styles.error}>{formData.errors.schoolOffTimeError}</Text>
        )}
         <Dropdown data= {schoolOffTimeData} label="schoolOffTime" handleValueChange={handleInputChange}/>
        </View>

        <View>
         <Text style={styles.label}>School Closing Time (Wednesday)</Text>
        {formData.errors.schoolOffTimeErrorWednesday && (
          <Text style={styles.error}>{formData.errors.schoolOffTimeErrorWednesday}</Text>
        )}
         <Dropdown data= {schoolOffTimeData} label="schoolOffTimeWednesday" handleValueChange={handleInputChange}/>
        </View>

        <View>
         <Text style={styles.label}>School Closing Time (Friday)</Text>
        {formData.errors.schoolOffTimeErrorFriday && (
          <Text style={styles.error}>{formData.errors.schoolOffTimeErrorFriday}</Text>
        )}
         <Dropdown data= {schoolOffTimeData} label="schoolOffTimeFriday" handleValueChange={handleInputChange}/>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#2196F3" }]}
            onPress={handleAddStudent}
            disabled={isAddingChild} // Disable the button while adding child
          >
            {isAddingChild ? (
              <ActivityIndicator color="#ffffff" /> // Show loading indicator while adding child
            ) : (
              <Text style={[styles.textStyle, { backgroundColor: "#2196F3" }]}>
                Add Child
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </>
    )}
            {shownext ? (
          <View style={styles.containerContinue}>
            <View style={styles.element1}>
              <TouchableOpacity
                style={[styles.button, dynamicStyle]}
                onPress={toggleForm}
              >
                <Text
                  style={[styles.textStyle, dynamicStyle]}
                >
                  {btnText}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.element2}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#008000" }]}
                onPress={() => navigation.navigate('DriverInfo', {parent_id: parent_id} )}
              >
                <Text
                  style={[styles.textStyle, { backgroundColor: "#008000" }]}
                >
                  NEXT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
  </>
)}

      </View>
    </ScrollView>
    <StickyFooter title="" profile={gotoprofile} cars={gotocars} screen="children"/>
  </>
  );
}

const styles = StyleSheet.create({

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
  infoLabel: {
    fontSize: 18,
    marginBottom: 10,
    width: 240
  },
  studentInfoContainer: {
    flex: 1,
    flexDirection: "row",
  },
  studentDetails: {
    flex: 1,
    marginRight: 0,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  studentPhone: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    width: 155,
  },
  studentID: {
    fontSize: 14,
    marginBottom: 5,
    padding: 5,
  },
  studentGrade: {
    fontSize: 14,
    marginBottom: 5,
    padding: 5,
  },
  studentFeedback: {
    fontSize: 14,
  },
 waitingText: {
    fontStyle: 'italic',
    color: '#2196F3'
  },
  studentPicture: {
    width: 80,
    height: 90,
    backgroundColor: "#ccc",
  },
  students: {
    fontWeight: "bold",
    fontSize: "25",
    textAlign: "center",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  containerContinue: {
    flexDirection: "row",
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 60,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  schoolClass: {
    width: 220,
  },
  imageContainer: { 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginVertical: 10,
    width: "100%",
  },
  cardContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderWidth: 2, 
    borderColor: '#2196F3', 
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
    fontWeight: "bold",
    marginBottom: 5,
  },
  transportPlan: {
    fontSize: 16,
    marginBottom: 2,
    fontWeight: "bold",
  },
  class: {
    fontSize: 16,
    marginBottom: 2,
    fontWeight: "bold",
  },
  school: {
    fontSize: 16,
    marginBottom: 2,
    fontWeight: "bold",
  },
});

export default StudentForm;
