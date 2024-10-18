import { useState } from "react";
import { Text, View, TextInput, Button, Alert } from "react-native";
import { firebaseAuth } from "../../utils/DataHandler";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const ChangePassword = ({ navigation, userData }) => {
  // States to hold the current password, new password, and its confirmation
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Function to save the new password
  async function SavePassword() {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const email = userData.email; // Assuming userData contains the user's email
      const user = firebaseAuth.currentUser; // Get the currently logged-in user

      // Get credentials from the current email and password
      const credential = EmailAuthProvider.credential(email, currentPassword);

      // Reauthenticate the user with the current password
      await reauthenticateWithCredential(user, credential);

      // Update the user's password
      await updatePassword(user, password);

      Alert.alert("Success", "Password updated successfully");
      navigation.goBack(); // Navigate back after successful password change
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    }
  }

  return (
    <View style={{ marginTop: 40, padding: 20 }}>
      <Text style={{ marginBottom: 20 }}>Enter Current Password:</Text>
      <TextInput
        secureTextEntry
        value={currentPassword}
        onChangeText={(text) => setCurrentPassword(text)}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <Text style={{ marginBottom: 20 }}>Enter New Password:</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Text style={{ marginBottom: 20 }}>Enter New Password Again:</Text>
      <TextInput
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        style={{ borderWidth: 1, padding: 10, marginBottom: 40 }}
      />

      <Button title="Save changes" onPress={SavePassword}></Button>
    </View>
  );
};

export default ChangePassword;