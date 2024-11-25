import React from 'react';
import { Switch, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as Icons from 'react-native-vector-icons'
const Preferences = ({ toggleTheme, isDarkTheme }) => {
  const theme = useTheme();
  console.log('dark theme', isDarkTheme)
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.preferenceContainer}>
        <Icons.MaterialIcons name={isDarkTheme ? 'dark-mode' : 'light-mode'} size={32} color={theme.colors.primary}/>
        <Switch
          style={{marginLeft:8,}}
          value={isDarkTheme}
          onValueChange={toggleTheme} // Toggle the theme
        />

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
    justifyContent:'center',
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
});

export default Preferences;