import { Button, View } from "react-native";

const Daily = ({ navigation }) => {
  return (
    <View>
      <Button
        title="Prefs"
        onPress={() => {
          navigation.navigate("Preferences");
        }}
      ></Button>
      <Button
        title="Settings"
        onPress={() => {
          navigation.navigate("Settings");
        }}
      ></Button>
    </View>
  );
};

export default Daily;
