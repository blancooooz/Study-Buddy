// Import necessary libraries and hooks
import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native'; // React Native components
import { connect } from 'react-redux'; // Connect component to Redux store
import { updateUsername } from '../../redux/actions/index'; // Import the action to update username
import { useSelector } from 'react-redux'; // Redux hook to access the store's state

/**
 * Component for updating the username.
 * It displays the current username and allows the user to input a new one.
 */
const Username = ({ updateUsername }) => {
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
    <View style={{ marginTop: 40, paddingHorizontal: 20, paddingVertical: 30 }}>
      {/* Display the current username */}
      <Text style={{ marginBottom: 40 }}>
        Current Username: {currentUsername}
      </Text>

      {/* Input field for entering a new username */}
      <Text style={{ marginBottom: 20 }}>
        Enter new Username
      </Text>
      <TextInput
        placeholder="Add username"
        value={username} // Bind the value of the input to the local `username` state
        onChangeText={(text) => setUsername(text)} // Update state when the user types
        style={{
          borderWidth: 1,
          borderColor: "#CCC",
          padding: 12,
          borderRadius: 10,
          marginBottom: 40, // Increased margin for more space below the input
          backgroundColor: "#F5F5F5",
          shadowColor: "#000",
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
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>Save changes</Text>
    </TouchableOpacity>

    </View>
  );
};

/**
 * Map the Redux state to component props.
 * This function makes the `userData` from the Redux store available as a prop.
 */
const mapStateToProps = (state) => {
  return {
    userData: state.userData, // Access the `userData` part of the Redux store
  };
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
export default connect(mapStateToProps, mapDispatchToProps)(Username);