import { useState } from "react";
import { Text, View, TextInput, Button } from "react-native";

const ChangePassword = () =>{
    //new password
    async function SavePassword() {
        // functionality .. 
        console.log("Password Change Pressed");
      }
    return (
        <View style={{ marginTop: 40 }}>
          <Text style={{marginBottom: 40}}>Current Password:</Text>
          
          <Text style={{marginBottom: 20}}>Enter New Password:</Text>
          <TextInput
            value={ChangePassword}
            onChangeText={(text) => {
              setPassword(text);
              console.log(Password);
            }}
          ></TextInput>

           <Text style={{marginBottom: 100}}>Enter New Password Again:</Text>
          <TextInput
            value={ChangePassword}
            onChangeText={(text) => {
              setUsername(text);
              console.log(Password);
            }}
          ></TextInput>
          <Button
            title="Save changes"
            onPress={() => {
              SavePassword();
            }}
          ></Button>
        </View>
      );
}
export default ChangePassword;