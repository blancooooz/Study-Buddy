import { useState } from "react";
import { View, ScrollView, Button, Text } from "react-native";
import { firebaseAuth, db } from "../../utils/DataHandler";
import { TextInput } from "react-native";
import { colors } from "../../theme/colors";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

const Register = () => {
  onSignUp = async () => {
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((result) => {
        console.log("User signed up with email");
        addDocument(result);
      })
      .catch((e) => {
        console.log("Error signing up user: ", e);
      });
  };

  const addDocument = async (result) => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        uid: result.user.uid,
        name: name,
        email: email,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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
          <View style={{ flex: 1, padding: 4 }}>
            <Text>Name</Text>
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
              }}
              style={{
                backgroundColor: colors.white,
                borderColor: colors.black,
                borderWidth: 1,
              }}
            />
          </View>
          <View style={{ flex: 1, padding: 4 }}>
            <Text>Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
              }}
              style={{
                backgroundColor: colors.white,
                borderColor: colors.black,
                borderWidth: 1,
              }}
            />
          </View>
          <View style={{ flex: 1, padding: 4 }}>
            <Text>Password</Text>
            <TextInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
              }}
              style={{
                backgroundColor: colors.white,
                borderColor: colors.black,
                borderWidth: 1,
              }}
            />
          </View>
          <View>
            <Button title="Sign Up" onPress={onSignUp} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default Register;
