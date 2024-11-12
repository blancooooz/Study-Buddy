// Importing action types from the actions file
import {
  FETCH_USER, // For storing the current authenticated user
  FETCH_USER_DATA, // For storing user-specific data from Firestore
  SET_TASKS, // For storing tasks
  SET_TAGS, // For storing tags
  SET_EVENTS, // For storing events
  UPDATE_USERNAME, // For updating the username
  DELETE_TASK,
  ADD_TASKS,
  EDIT_TASK,
  COMPLETE_TASK,
  LOG_OUT,
  START_TIMER,
  PAUSE_TIMER,
  RESET_TIMER,
  UPDATE_SESSION_COUNT,
  SAVE_SESSION_DATA,
  SET_SESSION_HISTORY,
  //ADD_TASK,
  //FETCH_USER_TASKS,
} from "../actions";

// Define the initial state of the userReducer.
// This is the default state before any actions are dispatched.
const initialState = {
  user: null, // The current authenticated user (from Firebase Auth)
  userData: null, // Additional user data (from Firestore)
  tasks: [], // Array to hold the user's tasks
  tags: [], // Array to hold the user's tags
  events: [], // Array to hold the user's events
  Username: [], // Username stored for the user (from Firestore)
  sessionTime: 1500, //Default 25 minutes
  breakTime: 300, // Default 5 minutes
  currentSessionCount: 0, // stores session count
  currentTime: 1500, // stores time currently left in session
  isPaused: true, 
  isSessionActive: false,
  sessionHistory: [],
};

/**
 * The reducer function is responsible for determining how the state should change based on the actions it receives.
 *
 * It takes the current state and an action as arguments, and it returns a new state based on the action type.
 * If no state is provided (e.g., on the first run), it defaults to `initialState`.
 *
 * @param {object} state - The current state of the user data in the Redux store.
 * @param {object} action - The action dispatched (contains a type and possibly a payload).
 * @returns {object} - The updated state after processing the action.
 */
export const userReducer = (state = initialState, action) => {
  // A switch statement to handle different action types and return the new state accordingly
  switch (action.type) {
    // Action type to handle fetching the authenticated Firebase user
    case FETCH_USER:
      // Return the current state with the updated `user` field set to the action's payload
      return { ...state, user: action.payload };

    // Action type to handle fetching user-specific data from Firestore
    case FETCH_USER_DATA:
      // Return the current state with the updated `userData` field set to the action's payload
      return { ...state, userData: action.payload };

    // Action type to handle setting tasks
    case SET_TASKS:
      // Return the current state with the updated `tasks` field set to the action's payload (array of tasks)
      return { ...state, tasks: action.payload };

    // Action type to handle setting tags
    case SET_TAGS:
      // Return the current state with the updated `tags` field set to the action's payload (array of tags)
      return { ...state, tags: action.payload };

    // Action type to handle setting events
    case SET_EVENTS:
      // Return the current state with the updated `events` field set to the action's payload (array of events)
      return { ...state, events: action.payload };

    // Action type to handle updating the username
    case UPDATE_USERNAME:
      // Return the current state with the updated `Username` field set to the action's payload (new username)
      return { ...state, Username: action.payload };

    // Action type to handle editing a task
    case EDIT_TASK:
      // Return the current state with the updated task
      return { ...state, tasks: [...tasks, action.payload] };

    case ADD_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };

    case DELETE_TASK:
      return {
        ...state,
        tasks: action.payload,
      };

    case COMPLETE_TASK:
      return {
        ...state,
        tasks: action.payload,
      };

    case START_TIMER:
      return { ...state, isPaused: false};

    case PAUSE_TIMER:
      return { ...state, isPaused: true };

    case RESET_TIMER:
      return {
        ...state,
        currentSessionCount: 0,
        currentTime: state.sessionTime,
        isPaused: true,
        isSessionActive: true,
      };

    case SET_SESSION_HISTORY:
      return{
        ...state,
        sessionHistory: action.payload,
      };

      
    case UPDATE_SESSION_COUNT:
      return{
        ...state,
        currentSessionCount: state.currentSessionCount + 1,
        sessionHistory: [...state.sessionHistory, action.payload],
        isSessionActive: !state.isSessionActive,
        currentTime: state.isSessionActive ? state.breakTime : state.sessionTime,
      };

    case SAVE_SESSION_DATA:
      return{
        ...state,
        sessionHistory: [...(state.sessionHistory || []), action.payload],
      };


    case LOG_OUT:
      return {
        ...state,
        user: null, // The current authenticated user (from Firebase Auth)
        userData: null, // Additional user data (from Firestore)
        tasks: [], // Array to hold the user's tasks
        tags: [], // Array to hold the user's tags
        events: [], // Array to hold the user's events
        Username: [], // Username stored for the user (from Firestore)
        sessionTime: 1500, //Default 25 minutes
        breakTime: 300, // Default 5 minutes
        currentSessionCount: 0, // stores session count
        currentTime: 1500, // stores time currently left in session
        isPaused: true, 
        isSessionActive: false,
        sessionHistory: [],
      };
    // Default case: if the action type doesn't match any case, return the state as is
    default:
      return state;
  }
};
