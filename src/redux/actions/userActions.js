import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, firebaseAuth } from '../../utils/DataHandler';

// Action type
export const UPDATE_USERNAME = 'UPDATE_USERNAME';

// Action creator to update the Redux store
export const updateUsernameRedux = (username) => {
  return {
    type: UPDATE_USERNAME,
    payload: username,
  };
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