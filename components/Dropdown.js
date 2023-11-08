 import React, { useState } from 'react';
  import { StyleSheet, Text, View } from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
  import AntDesign from '@expo/vector-icons/AntDesign';


  const DropdownComponent = ({data, label, handleValueChange, position, otherSchool}) => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
      if (value || isFocus) {
        return (
          <Text style={[styles.label, isFocus && { color: 'blue' }]}>
            {label}
          </Text>
        );
      }
      return null;
    };
      let containerStyle = {};
      let condStyle = {};
       if (position === "modal") {
          containerStyle.backgroundColor = '#404040';
          condStyle.borderColor = '#fff';
          condStyle.color = 'white';
        } else if (position === 'right') {
          containerStyle.backgroundColor = 'blue';
        } else {
          containerStyle.backgroundColor = 'white';
          containerStyle.marginLeft = -16;
        }

    return (
      <View style={[styles.container, containerStyle]}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }, condStyle]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={[styles.selectedTextStyle, condStyle]}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={[styles.iconStyle, condStyle]}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange = {(text) => {
            setValue(text.value);
            setIsFocus(false);
            handleValueChange(label, text.value)
            }
          }
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>
    );
  };

  export default DropdownComponent;

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      width: '110%',
    },
    dropdown: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 8,
      borderWidth: 1,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });