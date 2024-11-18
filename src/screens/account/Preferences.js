import React from 'react';
import { Switch, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const Preferences = ({ toggleTheme, isDarkTheme }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.preferenceContainer}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Light</Text>
        <Switch
          value={isDarkTheme}
          onValueChange={toggleTheme} // Toggle the theme
        />
        <Text style={[styles.label, { color: theme.colors.text }]}>Dark</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:20
  },
  preferenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
});

export default Preferences;