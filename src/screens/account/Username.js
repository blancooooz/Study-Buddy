import React, { useState } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import { connect } from 'react-redux'; // For connecting to Redux
import { updateUsername } from '../../redux/actions/userActions'; // Import the action

const Username = ({ navigation, userData, updateUsername }) => {
  const [username, setUsername] = useState('');

  let currentUsername = 'No username yet';
  try {
    currentUsername = userData.Username;
  } catch (e) {
    console.log('No username yet');
  }

  return (
    <View style={{ marginTop: 40, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Current Username: {currentUsername}
      </Text>

      <Text>Enter new Username</Text>
      <TextInput
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Button
        title="Save"
        onPress={() => {
          // Update both Firebase and Redux
          updateUsername(username);
        }}
      />
    </View>
  );
};

// Map Redux state to component props
const mapStateToProps = (state) => {
  return {
    userData: state.user, // Access user data from Redux store
  };
};

// Map the Redux action to component props
const mapDispatchToProps = (dispatch) => {
  return {
    updateUsername: (username) => dispatch(updateUsername(username)),
  };
};

// Connect the component to Redux
export default connect(mapStateToProps, mapDispatchToProps)(Username);