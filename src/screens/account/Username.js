// Import necessary libraries and hooks
import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native'; // React Native components
import { connect } from 'react-redux'; // Connect component to Redux store
import { updateUsername } from '../../redux/actions/index'; // Import the action to update username
import { useSelector } from 'react-redux'; // Redux hook to access the store's state
import { useTheme } from '@react-navigation/native';

/**
 * Component for updating the username.
 * It displays the current username and allows the user to input a new one.
 */
const Username = ({ updateUsername }) => {
  const theme = useTheme();
  // Local state to store the new username entered by the user
  const [username, setUsername] = useState('');

  // Default value for current username (in case none exists)
  let currentUsername = 'No username yet';

  try {
    // Use the Redux `useSelector` hook to access the `Username` from the global state (userData)
    currentUsername = useSelector((state) => state.userData?.Username || 'No username yet');
  } catch (e) {
    console.log('No username yet'); // Error handling for cases where userData or Username is undefined
  }

  return (
    // Container view with some styling for padding and spacing
    <View style={{ marginTop: 40, paddingHorizontal: 20, paddingVertical: 30, backgroundColor:theme.colors.background }}>
      {/* Display the current username */}
      <Text style={{ marginBottom: 40, color:theme.colors.text }}>
        Current Username: {currentUsername}
      </Text>

      {/* Input field for entering a new username */}
      <Text style={{ marginBottom: 20, color:theme.colors.text }}>
        Enter new Username
      </Text>
      <TextInput
        placeholder="Username"
        placeholderTextColor={theme.colors.text}
        value={username} // Bind the value of the input to the local `username` state
        onChangeText={(text) => setUsername(text)} // Update state when the user types
        style={{
          color:theme.colors.text,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: 12,
          borderRadius: 10,
          marginBottom: 40, // Increased margin for more space below the input
          backgroundColor: theme.colors.inputBackground,
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          
        }}
      />

      {/* Button to save the new username */}
      <TouchableOpacity
      onPress={() => {
        updateUsername(username);
      }}
      style={{
        backgroundColor: theme.colors.button,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
      }}
    >
      <Text style={{ color: theme.colors.background, fontWeight: "bold" }}>Save changes</Text>
    </TouchableOpacity>

    </View>
  );
};

/**
 * Map the Redux actions to component props.
 * This function makes the `updateUsername` action available as a prop.
 */
const mapDispatchToProps = (dispatch) => {
  return {
    // Dispatch the `updateUsername` action when called
    updateUsername: (username) => dispatch(updateUsername(username)),
  };
};

// Use the `connect` function to link the Redux store and actions to the component
export default connect( mapDispatchToProps)(Username);