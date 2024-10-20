// Import Firebase authentication and Firestore database utilities
import { firebaseAuth, db } from "../../utils/DataHandler";
// Import Firestore methods for listening to document changes and updating documents
import { onSnapshot, doc, updateDoc } from "firebase/firestore";

// Define action types as constants to avoid typos and manage action types easily
export const FETCH_USER = "FETCH_USER"; // For fetching the current Firebase authenticated user
export const FETCH_USER_DATA = "FETCH_USER_DATA"; // For fetching user-specific data from Firestore
export const SET_TASKS = "SET_TASKS"; // For setting tasks in the Redux store
export const SET_TAGS = "SET_TAGS"; // For setting tags in the Redux store
export const SET_EVENTS = "SET_EVENTS"; // For setting events in the Redux store
export const UPDATE_USERNAME = "UPDATE_USERNAME"; // For updating the username in the Redux store
export const UPDATE_COLOR_PREFERENCE = "UPDATE_COLOR_PREFERENCE"; // For updating the color preference in the Redux store
/**
 * Action creator to update the Redux store with a new username.
 * 
 * Action creators are functions that return an action (which is just a plain JavaScript object). 
 * In this case, it creates an action that holds the updated username, 
 * which will be used by the reducer to update the state.
 * 
 * @param {string} username - The new username to update.
 * @returns {object} - The action object to dispatch with type and payload.
 */
export const updateUsernameRedux = (username) => {
  return {
    type: UPDATE_USERNAME, // Action type to identify what the action does
    payload: username, // Payload is the data we want to pass to the reducer (the new username in this case)
  };
};

// ----------- ASYNC ACTION CREATORS (THUNK) -----------

// GETTERS (To fetch data)

/**
 * Asynchronous action creator to fetch user data from Firestore and dispatch it to Redux.
 * 
 * Thunks allow us to perform asynchronous operations (like fetching data from Firebase) before dispatching an action.
 * 
 * @returns {function} - A thunk function that dispatches an action with fetched data.
 */
export const fetchUserData = () => async (dispatch) => {
  const uid = firebaseAuth.currentUser.uid; // Get the current user's UID from Firebase Authentication

  // Subscribe to Firestore for real-time updates using onSnapshot
  const userSnapshot = await onSnapshot(doc(db, "users", uid), (doc) => {
    // Dispatch an action with the fetched user data (Firestore document data)
    dispatch({ type: FETCH_USER_DATA, payload: doc.data() });
  });
};

/**
 * Asynchronous action creator to fetch the current authenticated user from Firebase.
 * 
 * @returns {function} - A thunk function that dispatches an action with the current user.
 */
export const fetchUser = () => async (dispatch) => {
  const currentUser = firebaseAuth.currentUser; // Get the current authenticated user from Firebase Authentication
  // Dispatch an action with the current user information
  dispatch({ type: FETCH_USER, payload: currentUser });
};

// SETTERS (To update data)

/**
 * Asynchronous action creator to update the username in Firestore and Redux.
 * 
 * This function does two things:
 * 1. It updates the user's `Username` in the Firestore database.
 * 2. It dispatches an action to update the Redux store with the new username, so that the UI stays in sync.
 * 
 * @param {string} username - The new username to update in Firestore and Redux.
 * @returns {function} - A thunk function that performs the update and dispatches the updated data.
 */
export const updateUsername = (username) => {
  return async (dispatch) => {
    try {
      const uid = firebaseAuth.currentUser.uid; // Get the current user's UID
      const userRef = doc(db, "users", uid); // Reference to the Firestore document for the user
      await updateDoc(userRef, {
        Username: username, // Update the "Username" field in the Firestore document
      });

      // Dispatch an action to update the username in the Redux store
      dispatch(updateUsernameRedux(username));
    } catch (error) {
      console.log("Error updating username:", error); // Log any errors
    }
  };
};
export const updateColorPreference = (mode) => {
  return async (dispatch) => {
    try {
      const uid = firebaseAuth.currentUser.uid; // Get the current user's UID
      const userRef = doc(db, "users", uid); // Reference to the Firestore document for the user
      await updateDoc(userRef, {
        mode: mode, // Update the "mode" field in the Firestore document
      });

      // Dispatch an action to update the color preference in the Redux store
      dispatch(updateColorPreferenceRedux(mode));
    } catch (error) {
      console.log("Error updating color preference:", error); // Log any errors
    }
  };
};

// You can create similar setter actions for tasks, tags, and events