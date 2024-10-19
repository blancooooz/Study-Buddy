import { useState } from "react"; // Import useState hook from React for managing state
import { View, ScrollView, TouchableOpacity, Text } from "react-native"; // Import components from React Native
import { firebaseAuth, db } from "../../utils/DataHandler"; // Import Firebase authentication and Firestore database
import { TextInput } from "react-native"; // Import TextInput component for input fields
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import function to create a new user with email and password from Firebase Auth
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions for working with collections and documents
import { useTheme } from "@react-navigation/native";

const Register = () => {
  const theme = useTheme();
  // Function to handle sign-up action
  onSignUp = async () => {
    // Use Firebase auth to create a user with email and password
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((result) => {
        uid = result.user.uid;
        console.log("User signed up with email"); // Log success message
        addDocument(uid); // Call function to add user details to Firestore
      })
      .catch((e) => {
        console.log("Error signing up user: ", e); // Log any errors during sign-up
      });
  };

  // Function to add user information to Firestore after successful sign-up
  const addDocument = async (uid) => {
    try {
      // Add a new document with user details in the 'users' collection
      await setDoc(doc(db, "users", `${uid}`), {
        uid: uid, // Store user ID from the result
        name: name, // Store user's name
        email: email, // Store user's email
      });
    } catch (e) {
      console.log(e); // Log any errors when adding document to Firestore
    }
  };

  // State variables to store user input for name, email, and password
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 20 }}>
      {/* Header Section */}
      <View
        style={{
          flex: .6,
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <Text style={{color:theme.colors.text}}>Refister</Text>
      </View>

      {/* Scrollable form section for user input */}
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
          padding: 16,
        }}
      >
        <View>
          {/* Name Input Field */}
          <View style={{ flex: 1, padding: 4 }}>
          <Text style={{ color: theme.colors.text, marginBottom: 20 }}>
          Enter your Name</Text>
            <TextInput
              value={name}
              placeholderTextColor={theme.colors.placeholderText}
              placeholder="Name"
              onChangeText={(text) => {
                setName(text); // Update the state with the new name
              }}
              style={{
                color:theme.colors.text,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: 12,
                borderRadius: 10,
                marginBottom: 20,
              }}
            />
          </View>

          {/* Email Input Field */}
          <View style={{ flex: 1, padding: 4 }}>
            <Text style={{ color: theme.colors.text, marginBottom: 20 }}>
              Enter your Email
            </Text>
            <TextInput
              value={email}
              placeholderTextColor={theme.colors.placeholderText}
              placeholder="Email"
              onChangeText={(text) => {
                setEmail(text); // Update email state on text change
              }}
              style={{
                color:theme.colors.text,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: 12,
                borderRadius: 10,
                marginBottom: 20,
              }}
            />
          </View>

          {/* Password Input Field */}
          <View style={{ flex: 1, padding: 4 }}>
            <Text style={{ color: theme.colors.text, marginBottom: 20 }}>
              Password
            </Text>
            <TextInput
              placeholder="Password"
              placeholderTextColor={theme.colors.placeholderText}
              value={password}
              onChangeText={(text) => {
                setPassword(text); // Update password state on text change
              }}
              style={{
                color:theme.colors.text,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: 12,
                borderRadius: 10,
                marginBottom: 20,
              }}
            />
          </View>

          {/* Sign Up Button */}
          <View>
            <TouchableOpacity
              onPress={onSignUp}
              style={{
                backgroundColor: theme.colors.button,
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: theme.colors.background, fontWeight: "bold" }}
              >
                Log in
              </Text>
            </TouchableOpacity></View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Register;
