import React, { useState } from "react";
import { Text, View, TextInput, Button, Alert } from "react-native";
import { firebaseAuth } from "../../utils/DataHandler"; // Firebase authentication handler
import {
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from "firebase/auth"; // Firebase authentication functions
import { useSelector } from "react-redux"; // Import useSelector to access Redux store

/**
 * Component for changing the user's password.
 * Allows the user to enter their current password and update to a new one.
 */
const ChangePassword = ({ navigation }) => {
  // Local state variables for storing input values
  const [currentPassword, setCurrentPassword] = useState(""); // Current password input
  const [password, setPassword] = useState(""); // New password input
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm new password input

  const user = firebaseAuth.currentUser; // Get the currently logged-in user

  // Access the user's email from Redux store (userData fetched from Firebase)
  const email = useSelector((state) => state.userData?.email);

  /**
   * Function to handle saving the new password.
   * This reauthenticates the user and then updates their password in Firebase.
   */
  async function SavePassword() {
    // Check if the new password and confirm password match
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match"); // Show an error if passwords don't match
      return;
    }

    try {
      // Create Firebase credentials using the email and current password
      const credential = EmailAuthProvider.credential(email, currentPassword);

      // Reauthenticate the user with the current password
      await reauthenticateWithCredential(user, credential);

      // Update the user's password
      await updatePassword(user, password);

      Alert.alert("Success", "Password updated successfully"); // Show success message
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      console.log(error); // Log any errors that occur
      Alert.alert("Error", error.message); // Show an error message
    }
  }

  return (
    <View style={{ marginTop: 40, padding: 20 }}>
      <Text style={{ marginBottom: 20 }}>Enter Current Password:</Text>
      <TextInput
        secureTextEntry
        value={currentPassword}
        onChangeText={(text) => setCurrentPassword(text)} // Update the currentPassword state
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      
      <Text style={{ marginBottom: 20 }}>Enter New Password:</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)} // Update the password state
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Text style={{ marginBottom: 20 }}>Enter New Password Again:</Text>
      <TextInput
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)} // Update the confirmPassword state
        style={{ borderWidth: 1, padding: 10, marginBottom: 40 }}
      />

      <Button title="Save changes" onPress={SavePassword}></Button> 
    </View>
  );
};

export default ChangePassword;