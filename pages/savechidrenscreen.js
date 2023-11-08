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
  const [btnText, setBtnText] = useState("Add Another Child");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [students, setStudents] = useState([]);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    transportPlan: "",
    class: "",
    school: "",
    schoolOffTime: "",
    errors: {
      nameError: "",
      transportPlanError: "",
      classError: "",
      schoolError: "",
      schoolOffTime: "",
    },
  });

  const transportPlanData = [
    { label: 'Both Ways', value: '1' },
    { label: 'House to School', value: '2' },
    { label: 'School to House', value: '3' },
  ];

  const SchoolData = [
    { label: 'Canadian School', value: '1' },
    { label: 'Paypirus Logpom', value: '2' },
  ];

  const schoolOffTimeData = [
    { label: '1:30PM', value: '1' },
    { label: '2PM', value: '2' },
    { label: '2:30PM', value: '2' },
  ];

    const gotoprofile = () => {
      navigation.goBack();
    };

    // Go back one screen
    const gototocars = () => {
      navigation.navigate('DriverInfo', {parent_id: parent_id} ) // or navigation.pop();
    };



  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNum = Math.random().toString(36).substring(2);
    return `${timestamp}-${randomNum}`;
  };


  // Validate and submit data
  const handleAddStudent = (later) => {
    let isValid = true;
    const { name, transportPlan, class: studentClass, school, schoolOffTime } = formData;
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
      setBtnText("Hide Form");
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

            return {
              student_id: student.student_id,
              student: student.student,
              parent_id: student.parent_id,
              parentName: student.parentName,
              transportPlan: student.transportPlan,
              school: student.school,
              class: student.class,
              schoolOffTime: student.schoolOffTime,
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

  return (
    <>
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../assets/KTSLogo.png")}
          />
        </View>
{isLoading ? (
  <ActivityIndicator size="large" color="#2196F3" />
) : (
  <>
    {students.map((student, index) => {
      console.log("here is school finish timest", student.schoolOffTime);
      if (student.parent_id === parent_id) {
        const studentTime = student.schoolOffTime;
        if (student.school === '1') {
          schoolName = "Canadian School";
        } else if (student.school === '2') {
          schoolName = "Paypirus Logpom";
        } else {
          schoolName = student.school;
        }

        if (student.transportPlan === '1') {
          transportPlan = 'Both Ways';
        } else if (student.transportPlan === '2') {
          transportPlan = 'House to School';
        } else if (student.transportPlan === '3') {
          transportPlan = 'School to House';
        } else {
          transportPlan = 'Not Specified';
        }

       if (student.schoolOffTime === '1') {
          schoolClosingTime = '1:30PM';
        } else if (student.schoolOffTime === '2') {
          schoolClosingTime = '2PM';
        } else if (student.schoolOffTime === '3') {
          schoolClosingTime = '2:30PM';
        } else {
          schoolClosingTime = 'Not Specified';
        }
        return (
          <View key={index}>
            <View style={styles.cardContainer}>
              <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: '', borderWidth: 1, borderColor: '#2196F3', padding: 10, margin: 5, borderRadius: 5 }}>
                      <Text style={styles.infoLabel}>
                        Student Name: {'\n'}{student.student}
                      </Text>
                      <View style={{ marginLeft: -10 }}>
                        <Modal
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
                <View style={styles.studentInfoContainer}>
                  <View style={styles.studentDetails}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: '', borderWidth: 0.3, borderColor: '#000', padding: 10, margin: 5, borderRadius: 5 }}>
                    <Text style={styles.studentGrade}>
                      Class: {'\n'}{student.class}
                    </Text>
                      <View style={{ marginLeft: -10 }}>
                        <Modal
                          name={student.student}
                          TransportPlan={transportPlan}
                          Class={student.class}
                          School={schoolName}
                          EndTime={schoolClosingTime}
                          transportPlanData={transportPlanData}
                          SchoolData={SchoolData}
                          schoolOffTimeData={schoolOffTimeData}
                          handleInputChange={handleInputChange}
                          isClass={true}
                        />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: '', borderWidth: 0.3, borderColor: '#000', padding: 10, margin: 5, borderRadius: 5 }}>
                    <Text style={styles.studentPhone}>
                      Transport Plan: {'\n'}{transportPlan}
                    </Text>
                      <View style={{ marginLeft: -10 }}>
                        <Modal
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
                        />
                      </View>
                    </View>
                  </View>
                  <View style={styles.studentPicture}></View>
                </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: '', borderWidth: 0.3, borderColor: '#2196F3', padding: 10, margin: 5, borderRadius: 5 }}>
                    <Text style={styles.studentID}>
                      School: {'\n'}{schoolName}
                    </Text>
                      <View style={{ marginLeft: -10 }}>
                        <Modal
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
                        />
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: '', borderWidth: 0.3, borderColor: '#2196F3', padding: 10, margin: 5, borderRadius: 5 }}>
                      <Text style={styles.studentFeedback}>
                        School closing time: {'\n'}{schoolClosingTime}
                      </Text>
                      <View style={{ marginLeft: -10 }}>
                        <Modal
                          name={student.student}
                          TransportPlan={transportPlan}
                          Class={student.class}
                          School={schoolName}
                          EndTime={schoolClosingTime}
                          transportPlanData={transportPlanData}
                          SchoolData={SchoolData}
                          schoolOffTimeData={schoolOffTimeData}
                          handleInputChange={handleInputChange}
                          isEndTime={true}
                        />
                      </View>
                    </View>
              </>
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

        <View>
         <Text style={styles.label}>School Closing Time</Text>
        {formData.errors.schoolOffTimeError && (
          <Text style={styles.error}>{formData.errors.schoolOffTimeError}</Text>
        )}
         <Dropdown data= {schoolOffTimeData} label="schoolOffTime" handleValueChange={handleInputChange}/>
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
                style={[styles.button, { backgroundColor: "#2196F3" }]}
                onPress={toggleForm}
              >
                <Text
                  style={[styles.textStyle, { backgroundColor: "#2196F3" }]}
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
    <StickyFooter title="" profile={gotoprofile} cars={gototocars}/>
  </>
  );
}

const styles = StyleSheet.create({
  infoLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  studentInfoContainer: {
    flexDirection: "row",
  },
  studentDetails: {
    flex: 1,
    marginRight: 20,
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
  },
  studentID: {
    fontSize: 14,
    marginBottom: 5,
  },
  studentGrade: {
    fontSize: 14,
    marginBottom: 5,
  },
  studentFeedback: {
    fontSize: 14,
  },
  studentPicture: {
    width: 100,
    height: 100,
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
    padding: 10, margin: 5, 
    borderRadius: 5
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
