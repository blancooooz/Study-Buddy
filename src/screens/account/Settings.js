import { View,Text,Button } from "react-native";

const Settings = ({navigation})=>{

    return(
        <View>
        <Button
        title="Change password"
        onPress={() => {
            navigation.navigate("ChangePassword");
        }}
        ></Button>
         <Button
        title="Username"
        onPress={() => {
            navigation.navigate("Username");
        }}
        ></Button>
 

        </View>
    )
}
export default Settings;