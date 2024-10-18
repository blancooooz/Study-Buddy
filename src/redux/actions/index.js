import { firebaseAuth, db } from "../../utils/DataHandler";
import { onSnapshot,doc, updateDoc } from "firebase/firestore";
// redux/actions/index.js

export const FETCH_USER = "FETCH_USER";
export const SET_TASKS = "SET_TASKS";
export const SET_TAGS = "SET_TAGS";
export const SET_EVENTS = "SET_EVENTS";
export const UPDATE_USERNAME = 'UPDATE_USERNAME';


// Action creator to update the Redux store
export const updateUsernameRedux = (username) => {
  return {
    type: UPDATE_USERNAME,
    payload: username,
  };
};

// Fetch user data
export const fetchUser = () => async (dispatch) => {
  const uid = firebaseAuth.currentUser.uid;
  const userSnapshot = await onSnapshot(doc(db, "users", uid), (doc)=>{

    dispatch({ type: FETCH_USER, payload: doc.data() });
  });
};


// Action to update Firebase and Redux
export const updateUsername = (username) => {
  return async (dispatch) => {
    try {
      const uid = firebaseAuth.currentUser.uid;
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        Username: username,
      });
      
      // Dispatch the action to update the Redux store
      dispatch(updateUsernameRedux(username));
    } catch (error) {
      console.log('Error updating username:', error);
    }
  };
};


// Set tasks, tags, and events similarly