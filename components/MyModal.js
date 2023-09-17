import React, { useState } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const MyModal = ({ name, TransportPlan, Class,School }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState(name);
  const [transportPlan, setTransportPlan] = useState(TransportPlan);
  const [studentClass, setStudentClass] = useState(Class);
  const [school, setSchool] = useState(School);

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
            <TextInput
              style={[styles.input, { color: 'white', borderColor: 'white' }]}
              value={text}
              onChangeText={setText}
              placeholder="Enter name"
              placeholderTextColor="white"
              editable={true}
            />
            <TextInput
              style={[styles.input, { color: 'white', borderColor: 'white' }]}
              value={transportPlan}
              onChangeText={setTransportPlan}
              placeholder="Enter transport plan"
              placeholderTextColor="white"
              editable={true}
            />
            <TextInput
              style={[styles.input, { color: 'white', borderColor: 'white' }]}
              value={studentClass}
              onChangeText={setStudentClass}
              placeholder="Enter class"
              placeholderTextColor="white"
              editable={true}
            />
            <TextInput
              style={[styles.input, { color: 'white', borderColor: 'white' }]}
              value={school}
              onChangeText={setSchool}
              placeholder="Enter school"
              placeholderTextColor="white"
              editable={true}
            />
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
        style={[styles.button, { backgroundColor: '#2196F3' }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.textStyle, { backgroundColor: '#2196F3' }]}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalContainer: {
    backgroundColor: '#bfbfbf',
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
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'white',
  },
});

export default MyModal;