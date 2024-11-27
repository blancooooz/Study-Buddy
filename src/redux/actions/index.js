// Import Firebase authentication and Firestore database utilities
import { firebaseAuth, db } from "../../utils/DataHandler";
// Import Firestore methods for listening to document changes and updating documents
import {
  onSnapshot,
  doc,
  updateDoc,
  FieldValue,
  arrayRemove,
  getDoc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid"; // import uuid library

import { useSelector } from "react-redux";

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
export const COMPLETE_TASK = "COMPLETE_TASK";
export const LOG_OUT = "LOG_OUT";
export const GET_STUDY_PLANS = "SET_STUDY_PLANS";
export const CHANGE_STUDY_PLANS = "CHANGE_STUDY_PLANS";
export const ADD_STUDY_PLAN = "ADD_STUDY_PLAN";
export const EDIT_STUDY_PLAN = "EDIT_STUDY_PLAN";
export const DELETE_STUDY_PLAN = "DELETE_STUDY_PLAN";
export const ADD_SESSION = "ADD_SESSION";
export const EDIT_SESSION = "EDIT_SESSION";
export const DELETE_SESSION = "DELETE_SESSION";
export const TOGGLE_SESSION_COMPLETION = "TOGGLE_SESSION_COMPLETION";
export const TOGGLE_STUDY_PLAN_COMPLETION = "TOGGLE_STUDY_PLAN_COMPLETION";
export const START_POMODORO = "START_POMODORO"; // Starts a Pomodoro session
export const PAUSE_POMODORO = "PAUSE_POMODORO"; // Pauses the timer
export const RESET_POMODORO = "RESET_POMODORO"; // Resets timer and session count
export const UPDATE_SESSION_COUNT = "UPDATE_SESSION_COUNT"; // Increments session count upon completion
export const SAVE_SESSION_DATA = "SAVE_SESSION_DATA"; // Sends session history and data to Firebase
export const LOAD_SESSION_HISTORY = "LOAD_SESSION_HISTORY";
export const UPDATE_POINTS = "UPDATE_POINTS";
export const INCREASE_POINTS = "INCREASE_POINTS"; // Increment points
export const DECREASE_POINTS = "DECREASE_POINTS"; // Decrement points
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
  try {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      dispatch({ type: FETCH_USER_DATA, payload: userData });
      dispatch({ type: UPDATE_POINTS, payload: userData.achievements.level });
    }
  } catch (e) {
    console.log(e);
  }
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

export const add_task = (task, task_list) => {
  return async (dispatch, getState) => {
    try {
      const completed = false;
      const userId = firebaseAuth.currentUser.uid;
      const state = getState();
      const allTasks = state.tasks || [];
      // Task object to store all the parameters in

      // Access database and get reference to the document you're trying to update
      const userRef = doc(db, "tasks", userId); // Reference to the Firestore document for the user's task information

      // Check if the document exists
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        // If the document does not exist, create it with an empty tasks array
        await setDoc(userRef, { tasks: [] });
      }

      // Update the Firestore document with the new task
      await updateDoc(userRef, {
        tasks: arrayUnion(task), // Update the "tasks" field in the Firestore document
      });
      const updatedTasks = [...allTasks, task];
      // Update the local task list and dispatch the action

      dispatch({ type: ADD_TASKS, payload: updatedTasks });
    } catch (error) {
      console.log("Error adding task: " + error);
    }
  };
};
export const delete_task = (taskId, taskList) => {
  return async (dispatch) => {
    const taskListCopy = [...taskList];

    try {
      const userId = firebaseAuth.currentUser.uid; // != soft equals, so '1' != 1 is false '1' !== 1 is true
      const tasks_copy = taskListCopy.filter((task) => task.id !== taskId); // Filter out the task to be deleted != soft equals, so '1' == 1 is true '1' === 1 is false

      //task_list = ['task 1', 'task 2', 'task 3']
      //after the filter, you were checking for task 1 id
      //after filter: task_list = ['task 2', 'task 3']
      //for task in task_list
      // Reference to the Firestore document for the user's task information
      const userRef = doc(db, "tasks", userId);

      // Find the task to be deleted
      const taskToDelete = taskListCopy.find((task) => task.id === taskId); //return the task with the id that matches the taskId

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
  console.log("updated task", updated_task);
  return async (dispatch) => {
    try {
      const tasks_copy = [...task_list];
      const userId = firebaseAuth.currentUser.uid;
      tasks_copy.forEach((task, index) => {
        if (task.id === id) {
          tasks_copy[index] = { ...task, ...updated_task };
        }
      });

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

export const get_all_tasks = () => {
  // Pull all tasks from the database
  return async (dispatch) => {
    try {
      const uid = firebaseAuth.currentUser.uid; // Get the current user's id
      const taskRef = doc(db, "tasks", uid); // Grab task document reference from the database

      const taskSnapshot = await getDoc(taskRef); // Fetch the document snapshot

      if (taskSnapshot.exists()) {
        const task_data = taskSnapshot.data(); // Get the document data
        // Check to see if it's even valid first
        if (task_data && task_data.tasks) {
          dispatch({ type: SET_TASKS, payload: task_data.tasks }); // Dispatch the tasks
        } else {
          console.log("No tasks found in the document.");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
};
// Helper to get a specific study plan document reference
const getStudyPlanRef = (userId) => doc(db, "studyPlans", userId);

// Fetch all study plans, creating an empty document if it doesn’t exist
export const get_all_studyPlans = () => async (dispatch) => {
  try {
    const uid = firebaseAuth.currentUser.uid;
    const studyRef = getStudyPlanRef(uid);
    const studyRefSnapshot = await getDoc(studyRef);

    if (studyRefSnapshot.exists()) {
      const studyData = studyRefSnapshot.data();
      dispatch({ type: GET_STUDY_PLANS, payload: studyData.studyPlans || [] });
    } else {
      await setDoc(studyRef, { studyPlans: [] });
      dispatch({ type: GET_STUDY_PLANS, payload: [] });
    }
  } catch (error) {
    console.error("Error fetching study plans:", error);
  }
};

// Add a study plan
export const addStudyPlan = (studyPlan) => async (dispatch, getState) => {
  try {
    const state = getState();
    const studyPlans = state.studyPlans || [];
    const userId = firebaseAuth.currentUser.uid;
    const newStudyPlan = {
      ...studyPlan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const studyPlanRef = getStudyPlanRef(userId);
    await updateDoc(studyPlanRef, { studyPlans: arrayUnion(newStudyPlan) });

    dispatch({ type: ADD_STUDY_PLAN, payload: [...studyPlans, newStudyPlan] });
  } catch (error) {
    console.error("Error adding study plan:", error);
  }
};

// Edit a study plan
export const editStudyPlan =
  (studyPlanId, updatedPlan) => async (dispatch, getState) => {
    try {
      const userId = firebaseAuth.currentUser.uid;
      const state = getState();
      const currentPlans = state.studyPlans;
      const updatedPlans = currentPlans.map((plan) =>
        plan.id === studyPlanId
          ? { ...plan, ...updatedPlan, updatedAt: new Date().toISOString() }
          : plan
      );

      const studyPlanRef = getStudyPlanRef(userId);
      await updateDoc(studyPlanRef, { studyPlans: updatedPlans });

      dispatch({
        type: EDIT_STUDY_PLAN,
        payload: { studyPlanId, updatedPlan },
      });
    } catch (error) {
      console.error("Error editing study plan:", error);
    }
  };
export const toggleStudyPlanCompletion =
  (studyPlanId) => async (dispatch, getState) => {
    try {
      const userId = firebaseAuth.currentUser.uid;
      const state = getState();
      const currentPlans = state.studyPlans;

      const updatedPlans = currentPlans.map((plan) =>
        plan.id === studyPlanId
          ? {
              ...plan,
              completed: !plan.completed,
              updatedAt: new Date().toISOString(),
            }
          : plan
      );

      const studyPlanRef = getStudyPlanRef(userId);
      await updateDoc(studyPlanRef, { studyPlans: updatedPlans });

      dispatch({
        type: TOGGLE_STUDY_PLAN_COMPLETION,
        payload: { studyPlanId },
      });

      // Update points
      const pointChange = updatedPlans.find((plan) => plan.id === studyPlanId)
        .completed
        ? 50 // Points for completing a study plan
        : -50; // Points deducted for undoing completion

      dispatch(updatePoints(pointChange));
    } catch (error) {
      console.error("Error toggling study plan completion:", error);
    }
  };

// Delete a study plan
export const deleteStudyPlan = (studyPlanId) => async (dispatch, getState) => {
  try {
    const userId = firebaseAuth.currentUser.uid;
    const state = getState();
    const updatedPlans = state.studyPlans.filter(
      (plan) => plan.id !== studyPlanId
    );

    const studyPlanRef = getStudyPlanRef(userId);
    await updateDoc(studyPlanRef, { studyPlans: updatedPlans });

    dispatch({ type: DELETE_STUDY_PLAN, payload: studyPlanId });
  } catch (error) {
    console.error("Error deleting study plan:", error);
  }
};

// Add a session to a study plan
export const addSession =
  (studyPlanId, session) => async (dispatch, getState) => {
    try {
      const userId = firebaseAuth.currentUser.uid;
      const state = getState();
      const studyPlans = state.studyPlans;
      const newSession = {
        ...session,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedPlans = studyPlans.map((plan) =>
        plan.id === studyPlanId
          ? { ...plan, sessions: [...plan.sessions, newSession] }
          : plan
      );

      const studyPlanRef = getStudyPlanRef(userId);
      await updateDoc(studyPlanRef, { studyPlans: updatedPlans });

      dispatch({
        type: ADD_SESSION,
        payload: { studyPlanId, session: newSession },
      });
    } catch (error) {
      console.error("Error adding session:", error);
    }
  };

// Edit a session in a study plan
export const editSession =
  (studyPlanId, sessionId, updatedSession) => async (dispatch, getState) => {
    try {
      const userId = firebaseAuth.currentUser.uid;
      const state = getState();
      const studyPlans = state.studyPlans;

      const updatedPlans = studyPlans.map((plan) =>
        plan.id === studyPlanId
          ? {
              ...plan,
              sessions: plan.sessions.map((session) =>
                session.id === sessionId
                  ? {
                      ...session,
                      ...updatedSession,
                      updatedAt: new Date().toISOString(),
                    }
                  : session
              ),
            }
          : plan
      );

      const studyPlanRef = getStudyPlanRef(userId);
      await updateDoc(studyPlanRef, { studyPlans: updatedPlans });

      dispatch({
        type: EDIT_SESSION,
        payload: { studyPlanId, sessionId, updatedPlans: updatedPlans },
      });
    } catch (error) {
      console.error("Error editing session:", error);
    }
  };
export const toggleSessionCompletion =
  (studyPlanId, sessionId) => async (dispatch, getState) => {
    try {
      const userId = firebaseAuth.currentUser.uid;
      const state = getState();
      const studyPlans = state.studyPlans;

      const updatedPlans = studyPlans.map((plan) =>
        plan.id === studyPlanId
          ? {
              ...plan,
              sessions: plan.sessions.map((session) =>
                session.id === sessionId
                  ? {
                      ...session,
                      completed: !session.completed,
                      updatedAt: new Date().toISOString(),
                    }
                  : session
              ),
            }
          : plan
      );

      const studyPlanRef = getStudyPlanRef(userId);
      await updateDoc(studyPlanRef, { studyPlans: updatedPlans });

      dispatch({
        type: TOGGLE_SESSION_COMPLETION,
        payload: { studyPlanId, sessionId },
      });

      // Update points
      const pointChange = updatedPlans
        .find((plan) => plan.id === studyPlanId)
        .sessions.find((session) => session.id === sessionId).completed
        ? 20 // Points for completing a session
        : -20; // Points deducted for undoing completion

      dispatch(updatePoints(pointChange));
    } catch (error) {
      console.error("Error toggling session completion:", error);
    }
  };
// Delete a session from a study plan
export const deleteSession =
  (studyPlanId, sessionId) => async (dispatch, getState) => {
    try {
      const userId = firebaseAuth.currentUser.uid;
      const state = getState();
      const studyPlans = state.studyPlans;

      const updatedPlans = studyPlans.map((plan) =>
        plan.id === studyPlanId
          ? {
              ...plan,
              sessions: plan.sessions.filter(
                (session) => session.id !== sessionId
              ),
            }
          : plan
      );

      const studyPlanRef = getStudyPlanRef(userId);
      await updateDoc(studyPlanRef, { studyPlans: updatedPlans });

      dispatch({
        type: DELETE_SESSION,
        payload: { studyPlanId, updatedSessions: updatedPlans },
      });
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

export const complete_task = (taskId) => {
  return async (dispatch, getState) => {
    try {
      const uid = firebaseAuth.currentUser.uid;
      const taskRef = doc(db, "tasks", uid);

      // Fetch current tasks from Redux state
      const state = getState();
      const currentTasks = state.tasks || [];

      // Find and update the specific task
      const updatedTasks = currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );

      // Update Firestore document
      await updateDoc(taskRef, {
        tasks: updatedTasks,
      });

      // Dispatch the updated tasks list to Redux
      dispatch({ type: COMPLETE_TASK, payload: updatedTasks });
      const pointChange = updatedTasks.find((task) => task.id === taskId)
        .completed
        ? 10 // Points for completing a task
        : -10; // Points deducted for undoing completion

      dispatch(updatePoints(pointChange));
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };
};
export const logOut = () => {
  return async (dispatch) => {
    try {
      await signOut(firebaseAuth);
      dispatch({ type: LOG_OUT });
    } catch (e) {
      console.log(e);
    }
  };
};
// Start the timer
export const startPomodoro = () => ({ type: START_POMODORO });

// Pause the timer
export const pausePomodoro = () => ({ type: PAUSE_POMODORO });

// Reset time and session count
export const resetPomodoro = () => ({ type: RESET_POMODORO });

// Update session count on completion
export const updateSessionCount = (sessionData) => ({
  type: UPDATE_SESSION_COUNT,
  payload: sessionData,
});

// Loads session data from Firebase
export const loadSessionData = () => {
  return async (dispatch) => {
    try {
      const uid = firebaseAuth.currentUser?.uid;
      if (!uid) {
        console.error("No authenticated user. Cannot load session history.");
        return;
      }
      const userRef = doc(db, "sessions", uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const sessionData = userSnapshot.data();
        if (sessionData && sessionData.sessionHistory) {
          dispatch({
            type: SAVE_SESSION_DATA,
            payload: sessionData.sessionHistory,
          });
        } else {
          console.log("No session history found.");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
};

// Save session data to Firebase
export const saveSessionData = (sessionData) => {
  return async (dispatch, getState) => {
    try {
      const uid = firebaseAuth.currentUser.uid;
      const state = getState();
      const allSessions = state.sessions || [];
      const userRef = doc(db, "sessions", userId);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        // If the doc does not exist, create it with an empty sessions array
        await setDoc(userRef, { sessions: [] });
      }

      // Update Firestore doc with new session data
      await updateDoc(userRef, {
        sessions: arrayUnion(sessionData), // Update the "sessions" field in Firestore document
      });

      // Combine existing sessions with new one
      const updatedSessions = [...allSessions, sessionData];

      // Update local session list and dispatch action
      dispatch({ type: SAVE_SESSION_DATA, payload: updatedSessions });
    } catch (e) {
      console.log(e);
    }
  };
};
export const updatePoints = (change) => {
  return async (dispatch, getState) => {
    try {
      const uid = firebaseAuth.currentUser.uid;
      const userRef = doc(db, "users", uid);
      const state = getState();
      const currentPoints = state.level || 0;
      const achievements = state.userData.achievements;
      // Dispatch the updated points and level
      const totalPoints = currentPoints + change;

      // Update Firestore
      await updateDoc(userRef, {
        achievements: { ...achievements, level: totalPoints },
      });

      dispatch({
        type: UPDATE_POINTS,
        payload: totalPoints,
      });
    } catch (error) {
      console.error("Error updating points:", error);
    }
  };
};
//adding a task to the database

// You can create similar setter actions for tasks, tags, and events