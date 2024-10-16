import { useState } from "react";
import { Text, View, TextInput, Button } from "react-native";

const Username = ({ navigation }) => {
  function SaveUsername() {
    console.log("Pressed");
  }
  const [Username, setUsername] = useState("");

  return (
    <View style={{ marginTop: 40 }}>
      <Text style={{ fontSize: 20,marginBottom:20 }}>Current Username:</Text>

      <Text>Enter new Username</Text>
      <TextInput
        value={Username}
        onChangeText={(text) => {
          setUsername(text);
          console.log(Username);
        }}
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
