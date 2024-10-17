import React from 'react';
import { Switch, View, Text, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';

const Preferences = ({ toggleTheme, isDarkTheme }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flexDirection: 'row', marginTop: 12, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 32, color: theme.colors.text }}>Light</Text>
      <Switch
        value={isDarkTheme}
        onValueChange={toggleTheme} // Toggle the theme
      />
      <Text style={{ fontSize: 32, color: theme.colors.text }}>Dark</Text>
    </SafeAreaView>
  );
};

export default Preferences;