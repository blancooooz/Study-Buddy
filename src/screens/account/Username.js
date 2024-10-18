import { useState } from "react";
import { Text, View, TextInput, Button } from "react-native";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, firebaseAuth } from "../../utils/DataHandler";

const Username = ({navigation,userData}) => {
  //get users username.
  async function SaveUsername() {
    const uid = firebaseAuth.currentUser.uid;
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      Username: username,
    });
  }

  let currentUsername = "No username yet";
  try{
    currentUsername=userData.Username
  }catch(e){
    console.log("No username yet")
  }

  const [username, setUsername] = useState("");
  return (
    <View style={{ marginTop: 40, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Current Username: {currentUsername}</Text>

      <Text>Enter new Username</Text>
      <TextInput
        value={username}
        onChangeText={(text) => {
          setUsername(text);
        }}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      ></TextInput>
      <Button
        title="Save"
        onPress={() => {
          SaveUsername();
        }}
      ></Button>
    </View>
  );
};
export default Username;
