import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { View, Modal, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Dropdown from './Dropdown';

const MyModal = ({ name, TransportPlan, Class,School, EndTime, schoolOffTimeData, SchoolData, transportPlanData, handleInputChange, isName, isTransportPlan, isClass, isSchool, isEndTime }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState(name);
  const [transportPlan, setTransportPlan] = useState(TransportPlan);
  const [studentClass, setStudentClass] = useState(Class);
  const [school, setSchool] = useState(School);
  const [endTime, setEndTime] = useState(EndTime);

  const handleUpdate = () => {
    // Handle the update logic here
    console.log('Updated name:', text);
    console.log('Updated transport plan:', transportPlan);
    console.log('Updated class:', studentClass);
    console.log('Updated school:', school);

    // Close the modal after updating
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalContainer}>
           { isName && <TextInput
              style={[styles.input, { color: 'white', borderColor: 'white' }]}
              value={text}
              onChangeText={setText}
              placeholder="Enter Name"
              placeholderTextColor="white"
              editable={true}
            /> }
            { isClass &&
            <TextInput
              style={[styles.input, { color: 'white', borderColor: 'white' }]}
              value={Class}
              onChangeText={setSchool}
              placeholder="Enter Class"
              placeholderTextColor="white"
              editable={true}
            />
             }
            { isTransportPlan &&
            <Dropdown data= {transportPlanData} label="transportPlan" handleValueChange={handleInputChange} position="modal"/>
          }
          { isSchool &&
            <Dropdown data= {SchoolData} label="school" handleValueChange={handleInputChange} position="modal"/>
          }
          { isEndTime &&
            <Dropdown data= {schoolOffTimeData} label="schoolOffTime" handleValueChange={handleInputChange} position="modal"/>
          }
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#2196F3' }]}
              onPress={handleUpdate}
            >
            <Text style={[styles.textStyle, { backgroundColor: '#2196F3' }]}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#2196F3' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.textStyle, { backgroundColor: '#2196F3' }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={[styles.buttonModal]}
        onPress={(e) => {
          setModalVisible(true)
        }
      }
      >
        <FontAwesome5 name="pencil-alt" size={20} color="#2196F3" />
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#404040',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    maxHeight: '70%',
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginVertical: 10,
    width: '80%',
  },
  buttonModal: {
    borderRadius: 3,
    padding: 10,
    elevation: 2,
    marginVertical: 2,
    width: '100%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 5,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'white',
  },
});

export default MyModal;