import { useState } from "react"; 
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { firebaseAuth, db } from "../../utils/DataHandler"; 
import { TextInput } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth"; 
import { doc, setDoc } from "firebase/firestore"; 
import { useTheme } from "@react-navigation/native";

const Register = () => {
  const theme = useTheme();

  // State variables to store user input for name, email, and password
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle sign-up action
  const onSignUp = async () => {
    try {
      const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const uid = result.user.uid;
      console.log("User signed up with email");
      await addDocument(uid);
    } catch (e) {
      console.log("Error signing up user:", e);
    }
  };

  // Function to add user information to Firestore after successful sign-up
  const addDocument = async (uid) => {
    try {
      await setDoc(doc(db, "users", `${uid}`), {
        uid: uid,
        name: name || '', // Ensures name has a default value if empty
        email: email || '',
        username: '',
        tasks: [{}, {}], // Initialize with empty task objects if needed
        events: [{}, {}], // Initialize with empty event objects if needed
        image: '',
        achievements: {
          badges: [],
          level: 0, // Set initial level
        },
        progress: {
          tasksCompleted: 0, // Initial task completion count
          dailyStreak: 0, // Initial daily streak
        },
      });
      console.log("User document created in Firestore");
    } catch (e) {
      console.log("Error adding document to Firestore:", e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header Section */}
      <View style={{ flex: 0.6, justifyContent: "center", alignSelf: "center" }}>
        <Text style={{ color: theme.colors.text }}>Register</Text>
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
        {/* Name Input Field */}
        <View style={{ flex: 1, padding: 4 }}>
          <Text style={{ color: theme.colors.text, marginBottom: 20 }}>Enter your Name</Text>
          <TextInput
            value={name}
            placeholderTextColor={theme.colors.placeholderText}
            placeholder="Name"
            onChangeText={setName}
            style={{
              color: theme.colors.text,
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
          <Text style={{ color: theme.colors.text, marginBottom: 20 }}>Enter your Email</Text>
          <TextInput
            value={email}
            placeholderTextColor={theme.colors.placeholderText}
            placeholder="Email"
            onChangeText={setEmail}
            style={{
              color: theme.colors.text,
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
          <Text style={{ color: theme.colors.text, marginBottom: 20 }}>Password</Text>
          <TextInput
            placeholder="Password"
            placeholderTextColor={theme.colors.placeholderText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              color: theme.colors.text,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: 12,
              borderRadius: 10,
              marginBottom: 20,
            }}
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={onSignUp}
          style={{
            backgroundColor: theme.colors.button,
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme.colors.background, fontWeight: "bold" }}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Register;
