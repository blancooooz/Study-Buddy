import { useState } from "react";
import { Text,View,TextInput,Button } from "react-native";

const Username = ({navigation}) =>{
    async function SaveUsername() {
        // changeUSername(Username)   
        navigation.goBack()
    }
    const[Username, setUsername]= useState("");

    return(
        <View>
            <Text style={({fontSize:2000})}>"Save"</Text>
            <Button
            title="Save"
        onPress={() => {
            navigation.navigate("Save");
        }}
           ></Button>
        </View>
    )
}
export default Username;