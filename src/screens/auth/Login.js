import { useState } from "react"; // Import useState hook for managing state
import { View, ScrollView, Button, Text } from "react-native"; // Import basic UI components from React Native
import { firebaseAuth, db } from "../../utils/DataHandler"; // Import Firebase authentication and Firestore database utilities
import { TextInput } from "react-native"; // Import TextInput for form input fields
import { colors } from "../../theme/colors"; // Import theme colors for styling
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase function to sign in users with email and password

const Login = () => {
  // Function to handle user sign-in
  onSignUp = async () => {
    // Firebase authentication function to sign in using email and password
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((result) => {
        console.log("User signed in with email"); // Log success message
      })
      .catch((e) => {
        console.log("Error signing in user: ", e); // Log error message in case of failure
      });
  };

  // State variables for storing email and password input from user
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header Section */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignSelf: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text>Header</Text>
      </View>

      {/* Scrollable form section for input fields */}
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: colors.background,
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
          padding: 16,
        }}
      >
        <View>
          {/* Email Input Field */}
          <View style={{ flex: 1, padding: 4 }}>
            <Text>Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text); // Update email state on text change
              }}
              style={{
                backgroundColor: colors.white,
                borderColor: colors.black,
                borderWidth: 1,
              }}
            />
          </View>

          {/* Password Input Field */}
          <View style={{ flex: 1, padding: 4 }}>
            <Text>Password</Text>
            <TextInput
              value={password}
              onChangeText={(text) => {
                setPassword(text); // Update password state on text change
              }}
              style={{
                backgroundColor: colors.white,
                borderColor: colors.black,
                borderWidth: 1,
              }}
            />
          </View>

          {/* Sign In Button */}
          <View>
            <Button title="Sign In" onPress={onSignUp} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;