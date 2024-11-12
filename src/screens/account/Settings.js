import { useTheme } from "@react-navigation/native";
import { View, Text, Button, TouchableOpacity } from "react-native";

const Settings = ({ navigation }) => {
  const theme = useTheme();
  return (
    <View>
      <Button
        title="Change password"
        onPress={() => {
          navigation.navigate("ChangePassword");
        }}
      ></Button>
      <Button
        title="Change username"
        onPress={() => {
          navigation.navigate("Username");
        }}
      ></Button>
    </View>
  );
};
export default Settings;
