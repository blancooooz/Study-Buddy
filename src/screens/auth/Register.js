import { useState } from "react"; // Import useState hook from React for managing state
import { View, ScrollView, Button, Text } from "react-native"; // Import components from React Native
import { firebaseAuth, db } from "../../utils/DataHandler"; // Import Firebase authentication and Firestore database
import { TextInput } from "react-native"; // Import TextInput component for input fields
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import function to create a new user with email and password from Firebase Auth
import { collection, doc, setDoc } from "firebase/firestore"; // Import Firestore functions for working with collections and documents

const Register = () => {
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
    <View style={{ flex: 1 }}>
      {/* Header Section */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <Text>Header</Text>
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
            <Text>Name</Text>
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text); // Update the state with the new name
              }}
              style={{
                borderWidth: 1,
              }}
            />
          </View>

          {/* Email Input Field */}
          <View style={{ flex: 1, padding: 4 }}>
            <Text>Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text); // Update the state with the new email
              }}
              style={{
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
                setPassword(text); // Update the state with the new password
              }}
              style={{
                borderWidth: 1,
              }}
            />
          </View>

          {/* Sign Up Button */}
          <View>
            <Button title="Sign Up" onPress={onSignUp} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Register;
