import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const MyAppLogo = () => {
    return (
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require("../assets/KTSLogo.png")} />
      </View>
    );
  };

  export default MyAppLogo;

  const styles = StyleSheet.create({
    imageContainer:{
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center'
    },
    image:{
      width:150,
      height:150
  },
  })