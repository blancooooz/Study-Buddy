// Import necessary libraries and hooks
import React, { useState } from 'react';
import { Text, View, TextInput, Button } from 'react-native'; // React Native components
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
    <View style={{ marginTop: 40, padding: 20 }}>
      {/* Display the current username */}
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Current Username: {currentUsername}
      </Text>

      {/* Input field for entering a new username */}
      <Text>Enter new Username</Text>
      <TextInput
        value={username} // Bind the value of the input to the local `username` state
        onChangeText={(text) => setUsername(text)} // Update state when the user types
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }} // Styling for the input field
      />

      {/* Button to save the new username */}
      <Button
        title="Save"
        onPress={() => {
          // When the button is pressed, update both Firebase and Redux
          updateUsername(username); // Calls the Redux action to update the username
        }}
      />
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