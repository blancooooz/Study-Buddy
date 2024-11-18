import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { firebaseAuth } from "../../utils/DataHandler"; // Firebase authentication handler
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth"; // Firebase authentication functions
import { useSelector } from "react-redux"; // Import useSelector to access Redux store
import { useTheme } from "@react-navigation/native";

/**
 * Component for changing the user's password.
 * Allows the user to enter their current password and update to a new one.
 */
const ChangePassword = ({ navigation }) => {
  const theme = useTheme();
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
    <View
      style={{ flex: 0.6, justifyContent: "center", paddingHorizontal: 20 }}
    >
      <Text style={{ marginBottom: 20,color:theme.colors.text  }}>Enter Current Password:</Text>
      <TextInput
        secureTextEntry
        placeholder="Current Password"
        placeholderTextColor={theme.colors.text}
        value={currentPassword}
        onChangeText={(text) => setCurrentPassword(text)}
        style={{
          color:theme.colors.text,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: 12,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      <Text style={{ marginBottom: 20, color: theme.colors.text }}>
        Enter New Password:
      </Text>
      <TextInput
        secureTextEntry
        placeholder="New Password"
        placeholderTextColor={theme.colors.text}
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={{
          color:theme.colors.text,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: 12,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      <Text style={{ marginBottom: 20, color: theme.colors.text }}>
        Enter New Password Again:
      </Text>
      <TextInput
        secureTextEntry
        placeholder="Confirm New Password"
        placeholderTextColor={theme.colors.text}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        style={{
          color:theme.colors.text,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: 12,
          borderRadius: 10,
          marginBottom: 40,
        }}
      />
      {password !== confirmPassword && confirmPassword.length > 0 ? (
        <Text style={{ color: "red", marginBottom: 20 }}>
          Passwords do not match
        </Text>
      ) : null}

      <TouchableOpacity
        onPress={SavePassword}
        style={{
          backgroundColor: theme.colors.button,
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: theme.colors.background, fontWeight: "bold" }}>
          Save Changes
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;
