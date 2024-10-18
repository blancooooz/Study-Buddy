import React from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux"; // Import useSelector hook

const Daily = () => {

  let name = "";
  try {
    name = useSelector((state) => state.userData.name);
  } catch (e) {
    console.log(e);
  }

  return (
    <View>
      <Text>Welcome, {name}!</Text>
      {/* Your screen content */}
    </View>
  );
};

export default Daily;
