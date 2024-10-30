import { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { firebaseAuth, db } from "../../utils/DataHandler";
import { TextInput } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useTheme } from "@react-navigation/native";

const Login = () => {
  const theme = useTheme();

  // State variables for storing email and password input from user
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle user sign-in
  const onSignUp = async () => {
    try {
      const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
      console.log("User signed in with email");
      await initializeUserData(result.user.uid); // Check and initialize user data
    } catch (e) {
      console.log("Error signing in user:", e);
    }
  };

  // Function to check and initialize user data if fields are missing
  const initializeUserData = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const defaultUserData = {
        name: '',
        email: '',
        username: '',
        tasks: [],
        events: [],
        image: '',
        achievements: {
          badges: [],
          level: 0,
        },
        progress: {
          tasksCompleted: 0,
          dailyStreak: 0,
        },
      };

      // Merge missing fields with default values
      const updatedData = { ...defaultUserData, ...userData };

      // Update the Firestore document only if there are missing fields
      await setDoc(userDocRef, updatedData, { merge: true });
      console.log("User document updated with missing fields, if any.");
    } else {
      console.log("User document not found.");
    }
  };

  return (
    <View style={{ flex: 0.6, justifyContent: "center", paddingHorizontal: 20 }}>
      {/* Header Section */}
      <View style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}>
        <Text style={{ color: theme.colors.text }}>Login</Text>
      </View>

      {/* Scrollable form section for input fields */}
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
          {/* Email Input Field */}
          <View style={{ flex: 1, padding: 4 }}>
            <Text>Email</Text>
            <TextInput
              value={email}
              placeholder="Email"
              placeholderTextColor={theme.colors.placeholderText}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: theme.colors.text,
                borderWidth: 1,
              }}
            />
          </View>

          {/* Password Input Field */}
          <View style={{ flex: 1, padding: 4 }}>
            <Text>Password</Text>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
              style={{
                color: theme.colors.text,
                borderWidth: 1,
              }}
            />
          </View>

          {/* Sign In Button */}
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
              <Text style={{ color: theme.colors.background, fontWeight: "bold" }}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;