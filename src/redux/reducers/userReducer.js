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
      return { ...state, tasks: [...state.tasks, action.payload] };

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
        studyPlans: state.studyPlans.map((plan) =>
          plan.id === action.payload.studyPlanId
            ? {
                ...plan,
                sessions: plan.sessions.map((session) =>
                  session.id === action.payload.sessionId
                    ? { ...session, ...action.payload.updatedSession }
                    : session
                ),
              }
            : plan
        ),
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

    default:
      return state;
  }
};