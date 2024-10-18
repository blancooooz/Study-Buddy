import { Button, View } from "react-native";

const Landing = ({ navigation }) => {
  return (
    // Main container for the Landing screen with centered content
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      {/* Button to navigate to the Register screen */}
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")} // Navigate to the Register screen when pressed
      />

      {/* Button to navigate to the Login screen */}
      <Button
        title="Login"
        onPress={() => navigation.navigate("Login")} // Navigate to the Login screen when pressed
      />
    </View>
  );
};

export default Landing;
