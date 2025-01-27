import { useState } from "react"; // Import useState hook for managing state
import { View, ScrollView, Button, Text } from "react-native"; // Import basic UI components from React Native
import { firebaseAuth, db } from "../../utils/DataHandler"; // Import Firebase authentication and Firestore database utilities
import { TextInput } from "react-native"; // Import TextInput for form input fields
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase function to sign in users with email and password
import { TouchableOpacity } from "react-native";
import { doc, setDoc,getDoc } from "firebase/firestore"; // Import Firestore functions for working with collections and documents
import { useTheme } from "@react-navigation/native";

const Login = () => {
  const theme = useTheme();

  // State variables for storing email and password input from user
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  // Function to handle user sign-in
  onSignUp = async () => {
    // Firebase authentication function to sign in using email and password
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((result) => {
        console.log("User signed in with email"); // Log success message
        initializeUserData(result.user.uid);
      })
      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          setErrorMessage("Incorrect password. Please try again.");
        } else if (error.code === "auth/user-not-found") {
          setErrorMessage("User not found. Please check the email.");
        } else if (error.code === "auth/invalid-credential") {
          setErrorMessage("Invalid email or password.");
        } else {
          setErrorMessage("Error signing in: " + error.message);
        }
      });
  };

  // Function to check and initialize user data if fields are missing
  const initializeUserData = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const defaultUserData = {
        name: "",
        email: "",
        Username: "",
        image: "",
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
    <View
      style={{ flex: .7, justifyContent: "center", paddingHorizontal: 20 }}
    >
      {/* Header Section */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
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
            <Text style={{ color: theme.colors.text, marginBottom: 20 }}>
              Enter your Email
            </Text>
            <TextInput
              value={email}
              placeholder="Email"
              placeholderTextColor={theme.colors.placeholderText}
              onChangeText={(text) => {
                setEmail(text); // Update email state on text change
              }}
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
            <Text style={{ color: theme.colors.text, marginBottom: 20 }}>
              Password
            </Text>
            <TextInput
              placeholder="Password"
              placeholderTextColor={theme.colors.placeholderText}
              value={password}
              onChangeText={(text) => setPassword(text)}
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
          {errorMessage && (
            <Text style={{ color: "red", marginBottom: 20 }}>
              {errorMessage}
            </Text>
          )}

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
              <Text
                style={{ color: theme.colors.background, fontWeight: "bold" }}
              >
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;
