import {
  FETCH_USER,
  FETCH_USER_DATA,
  SET_TASKS,
  SET_TAGS,
  SET_EVENTS,
  UPDATE_USERNAME,
  DELETE_TASK,
  ADD_TASKS,
  EDIT_TASK,
  COMPLETE_TASK,
  LOG_OUT,
  GET_STUDY_PLANS,
  CHANGE_STUDY_PLANS,
  ADD_SESSION,
  DELETE_SESSION,
  EDIT_SESSION,
  ADD_STUDY_PLAN,
  EDIT_STUDY_PLAN,
  START_TIMER,
  PAUSE_TIMER,
  RESET_TIMER,
  UPDATE_SESSION_COUNT,
  SAVE_SESSION_DATA,
  SET_SESSION_HISTORY,
  UPDATE_POINTS,
  DELETE_STUDY_PLAN,
  TOGGLE_SESSION_COMPLETION,
  TOGGLE_STUDY_PLAN_COMPLETION
} from "../actions";

// Initial state for the reducer
const initialState = {
  user: null,
  userData: null,
  tasks: [],
  tags: [],
  events: [],
  Username: [],
  studyPlans: [],
  sessionTime: 1500, //Default 25 minutes
  breakTime: 300, // Default 5 minutes
  currentSessionCount: 0, // stores session count
  currentTime: 1500, // stores time currently left in session
  isPaused: true,
  isSessionActive: false,
  sessionHistory: [],
  points: 0,
  streak: 0,
};

// Reducer function
export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      return { ...state, user: action.payload };

    case FETCH_USER_DATA:
      return { ...state, userData: action.payload };

    case SET_TASKS:
      return { ...state, tasks: action.payload };

    case SET_TAGS:
      return { ...state, tags: action.payload };

    case SET_EVENTS:
      return { ...state, events: action.payload };

    case UPDATE_USERNAME:
      return { ...state, Username: action.payload };

    case EDIT_TASK:
      return { ...state, tasks: action.payload };

    case ADD_TASKS:
      return { ...state, tasks: action.payload };

    case DELETE_TASK:
      return { ...state, tasks: action.payload };

    case COMPLETE_TASK:
      return { ...state, tasks: action.payload };

    case LOG_OUT:
      return {
        ...state,
        user: null,
        userData: null,
        tasks: [],
        tags: [],
        events: [],
        Username: [],
        studyPlans: [],
        sessionTime: 1500, //Default 25 minutes
        breakTime: 300, // Default 5 minutes
        currentSessionCount: 0, // stores session count
        currentTime: 1500, // stores time currently left in session
        isPaused: true,
        isSessionActive: false,
        sessionHistory: [],
      };

    case GET_STUDY_PLANS:
      return { ...state, studyPlans: action.payload };

    case CHANGE_STUDY_PLANS:
      return { ...state, studyPlans: action.payload };

    // Study Plan Actions
    case ADD_STUDY_PLAN:
      return { ...state, studyPlans: action.payload };

    case EDIT_STUDY_PLAN:
      return {
        ...state,
        studyPlans: state.studyPlans.map((plan) =>
          plan.id === action.payload.studyPlanId
            ? { ...plan, ...action.payload.updatedPlan }
            : plan
        ),
      };

    case DELETE_STUDY_PLAN:
      return {
        ...state,
        studyPlans: state.studyPlans.filter(
          (plan) => plan.id !== action.payload
        ),
      };

    // Session Actions within Study Plans
    case ADD_SESSION:
      return {
        ...state,
        studyPlans: state.studyPlans.map((plan) =>
          plan.id === action.payload.studyPlanId
            ? {
                ...plan,
                sessions: [...plan.sessions, action.payload.session],
              }
            : plan
        ),
      };

    case EDIT_SESSION:
      return {
        ...state,
        studyPlans: action.payload.updatedPlans,
      };

    case DELETE_SESSION:
      return {
        ...state,
        studyPlans: state.studyPlans.map((plan) =>
          plan.id === action.payload.studyPlanId
            ? {
                ...plan,
                sessions: plan.sessions.filter(
                  (session) => session.id !== action.payload.sessionId
                ),
              }
            : plan
        ),
      };

    // Toggle completion status for a study plan
    case TOGGLE_STUDY_PLAN_COMPLETION:
      return {
        ...state,
        studyPlans: state.studyPlans.map((plan) =>
          plan.id === action.payload.studyPlanId
            ? { ...plan, completed: !plan.completed }
            : plan
        ),
      };
    case START_TIMER:
      return { ...state, isPaused: false };

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
      return {
        ...state,
        sessionHistory: action.payload,
      };

    case UPDATE_SESSION_COUNT:
      return {
        ...state,
        currentSessionCount: state.currentSessionCount + 1,
        sessionHistory: [...state.sessionHistory, action.payload],
        isSessionActive: !state.isSessionActive,
        currentTime: state.isSessionActive
          ? state.breakTime
          : state.sessionTime,
      };

    case SAVE_SESSION_DATA:
      return {
        ...state,
        sessionHistory: [...(state.sessionHistory || []), action.payload],
      };

    // Toggle completion status for a session within a study plan
    case TOGGLE_SESSION_COMPLETION:
      return {
        ...state,
        studyPlans: state.studyPlans.map((plan) =>
          plan.id === action.payload.studyPlanId
            ? {
                ...plan,
                sessions: plan.sessions.map((session) =>
                  session.id === action.payload.sessionId
                    ? { ...session, completed: !session.completed }
                    : session
                ),
              }
            : plan
        ),
      };

    case UPDATE_POINTS:
      return {
        ...state,
        points: action.payload,
      };

    default:
      return state;
  }
};