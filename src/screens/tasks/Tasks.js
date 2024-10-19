import { View,Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app"; // Import Firebase for compatibility mode (older SDK version)
import "firebase/compat/auth"; // Import Firebase authentication for compatibility mode
import "firebase/compat/firestore"; // Import Firestore for compatibility mode
import { add_task } from "../../utils/DataHandler";
const Tasks = ({ }) => {
//pull tasks from database, and display them
 const get_all_tasks = () => {
    try{
      const userId = firebaseAuth.currentUser.uid;
      const docRef = firebase.firestore().collection('users').doc(userId);
      docRef.get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          return data.tasks;
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    }catch(error){
      console.log("error getting tasks: "+error)
    }
  }
  return (
    /* main screen view */
    <View style={{backgroundColor:'transparent',flex:1,paddingHorizontal:16,}}>
      <View style={styles.container}>
        <View style={{flex:1, }}><Text style={{color:'white', fontSize:24,marginLeft:8}}>Task Title</Text></View>
        <View style={{flex:1, }}><Text style={{color:'white', fontSize:24,marginLeft:8}}>Description</Text></View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container:{
    width:'100%',
    height:100,
    borderRadius:12,
    backgroundColor:'gray',
  }
});





export default Tasks;
