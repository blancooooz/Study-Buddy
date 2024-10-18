// redux/reducers/userReducer.js
import {
  FETCH_USER,
  SET_TASKS,
  SET_TAGS,
  SET_EVENTS,
  UPDATE_USERNAME,
} from "../actions";

const initialState = {
  user: null,
  tasks: [],
  tags: [],
  events: [],
  Username: [],
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      return { ...state, user: action.payload };
    case SET_TASKS:
      return { ...state, tasks: action.payload };
    case SET_TAGS:
      return { ...state, tags: action.payload };
    case SET_EVENTS:
      return { ...state, events: action.payload };
    case UPDATE_USERNAME:
      return {
        ...state,
        Username: action.payload, // Update the username in the Redux store
      };
    default:
      return state;
  }
};
