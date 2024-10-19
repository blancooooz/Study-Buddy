import React from "react";
import { View, Text, Button } from "react-native";
import { useTheme } from "@react-navigation/native"; // Use theme for light/dark mode

const StudyPlan = ({ navigation }) => {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: theme.colors.text,
          marginBottom: 20,
        }}
      >
        Study Plan
      </Text>
      <Text
        style={{
          fontSize: 18,
          color: theme.colors.text,
          marginBottom: 30,
        }}
      >
        Coming Soon!
      </Text>
    </View>
  );
};

export default StudyPlan;