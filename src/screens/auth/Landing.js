import { useTheme } from "@react-navigation/native";
import { TouchableOpacity, View, Text } from "react-native";

const Landing = ({ navigation }) => {
  const theme = useTheme();
  return (
    // Main container for the Landing screen with centered content
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: theme.colors.background,
      }}
    >
      {/* TouchableOpacity to navigate to the Register screen */}
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.button,
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          margin:12
        }}
        onPress={() => navigation.navigate("Register")} // Navigate to the Register screen when pressed
      >
        <Text style={{ color: theme.colors.background, fontWeight: "bold" }}>
          Register
        </Text>
      </TouchableOpacity>

      {/* TouchableOpacity to navigate to the Login screen */}
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.button,
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          margin:12
        }}
        onPress={() => navigation.navigate("Login")} // Navigate to the Login screen when pressed
      >
        <Text style={{ color: theme.colors.background, fontWeight: "bold" }}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Landing;
