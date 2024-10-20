// Import Firebase authentication and Firestore database utilities
import { firebaseAuth, db } from "../../utils/DataHandler";
// Import Firestore methods for listening to document changes and updating documents
import {
  onSnapshot,
  doc,
  updateDoc,
  FieldValue,
  arrayRemove,
} from "firebase/firestore";

// Define action types as constants to avoid typos and manage action types easily
export const FETCH_USER = "FETCH_USER"; // For fetching the current Firebase authenticated user
export const FETCH_USER_DATA = "FETCH_USER_DATA"; // For fetching user-specific data from Firestore
export const SET_TASKS = "SET_TASKS"; // For setting tasks in the Redux store
export const SET_TAGS = "SET_TAGS"; // For setting tags in the Redux store
export const SET_EVENTS = "SET_EVENTS"; // For setting events in the Redux store
export const UPDATE_USERNAME = "UPDATE_USERNAME"; // For updating the username in the Redux store
export const ADD_TASKS = "ADD_TASKS"; // For adding a task to the Redux store
export const DELETE_TASK = "DELETE_TASK";
export const EDIT_TASK = "EDIT_TASK";
{
  /* 
export const ADD_TASK = "ADD_TASK";
export const EDIT_TASK = "EDIT_TASK";
export const FETCH_USER_TASKS = "FETCH_USER_TASKS"
*/
}
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
{
  /* 
export const updateTasksRedux = (task) => {
  return {
    type: EDIT_TASK, // Action type to identify what the action does
    payload: username, // Payload is the data we want to pass to the reducer (the new username in this case)
  };
};
*/
}
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

{
  /* 
export const fetchUserTasks = () => async (dispatch) => {
  
    dispatch({ type: FETCH_USER_TASKS, payload: {} });
  
};
 */
}
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
// export const add_task = () => {
//   return async (dispatch) => {
//     try {
//       dispatch(add_task(task));
//     } catch (error) {}
//   };
// };

export const add_task = (
  title,
  deadline,
  description,
  tags,
  id,
  recurring,
  priority,
  task_list
) => {
  return async (dispatch) => {
    try {
      const completed = false;
      const userId = firebaseAuth.currentUser.uid;
      const tasks_copy = task_list;
      //task object to store all the parameters in
      const task = {
        title: title,
        deadline: deadline,
        description: description,
        tags: tags,
        id: id,
        recurring: recurring,
        priority: priority,
        completed: completed,
      };
      //access database and get reference to the document you're trying to update
      const userRef = doc(db, "tasks", uid); // Reference to the Firestore document for the user's task information
      await updateDoc(userRef, {
        tasks: FieldValue.arrayUnion(task), // Update the "task" field in the Firestore document
      });
      //update the database with the new task

      dispatch({ type: ADD_TASKS, payload: tasks_copy.push(task) });
      //ADD_TASKS(tasks_copy.push(task));
    } catch (error) {
      console.log("error adding task: " + error);
    }
  };
};
export const delete_task = (taskId, task_list) => {
  return async (dispatch) => {
    try {
      const userId = firebaseAuth.currentUser.uid; // != soft equals, so '1' != 1 is false '1' !== 1 is true
      const tasks_copy = task_list.filter((task) => task.id !== taskId); // Filter out the task to be deleted != soft equals, so '1' == 1 is true '1' === 1 is false
      //task_list = ['task 1', 'task 2', 'task 3']
      //after the filter, you were checking for task 1 id
      //after filter: task_list = ['task 2', 'task 3']
      //for task in task_list
      // Reference to the Firestore document for the user's task information
      const userRef = doc(db, "tasks", userId);

      // Find the task to be deleted
      const taskToDelete = task_list.find((task) => task.id === taskId); //return the task with the id that matches the taskId

      if (taskToDelete) {
        // Update the Firestore document to remove the task
        await updateDoc(userRef, {
          tasks: arrayRemove(taskToDelete),
        });

        // Dispatch the action to update the Redux store
        dispatch({ type: DELETE_TASK, payload: tasks_copy }); //DELETE_TASK(tasks_copy);

        console.log("Task successfully deleted!");
      } else {
        console.log("Task not found!");
      }
    } catch (error) {
      console.log("Error deleting task: " + error);
    }
  };
};
export const edit_task = (id, updated_task, task_list) => {
  return async (dispatch) => {
    try {
      const userId = firebaseAuth.currentUser.uid;
      const tasks_copy = task_list.map((task) =>
        task.id === id ? { ...task, ...updated_task } : task
      );

      // Reference to the Firestore document for the user's task information
      const userRef = doc(db, "tasks", userId);

      // Update the Firestore document with the updated task
      await updateDoc(userRef, {
        tasks: tasks_copy,
      });

      // Dispatch the action to update the Redux store
      dispatch({ type: EDIT_TASK, payload: tasks_copy });

      console.log("Task successfully updated!");
    } catch (error) {
      console.log("Error editing task: " + error);
    }
  };
};
//adding a task to the database
{
  /*  
export const add_task = () => {
  return async (dispatch) => {
    try {
      dispatch(add_task(task));
    } catch (error) {}
  };
};
export const edit_task = () => {
  return async (dispatch) => {
    try {
      dispatch(edit_task(updated_task));
    } catch (error) {
      console.log("error editing task: " + error);
    }
  };
};

*/
}
// You can create similar setter actions for tasks, tags, and events
