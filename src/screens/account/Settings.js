import { useTheme } from "@react-navigation/native";
import { View, Text, Button, TouchableOpacity } from "react-native";

const Settings = ({ navigation }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: theme.colors.background,
        paddingBottom:45
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.button,
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          margin: 12,
        }}
        onPress={() => {
          navigation.navigate("ChangePassword");
        }}
      >
        <Text style={{ color: theme.colors.background, fontWeight: "bold" }}>
          Change Password
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.button,
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          margin: 12,
        }}
        onPress={() => {
          navigation.navigate("Username");
        }}
      >
        <Text style={{ color: theme.colors.background, fontWeight: "bold" }}>
          Change Username
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default Settings;
