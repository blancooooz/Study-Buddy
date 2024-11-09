// import { render, screen } from '@testing-library/react';
// import App from '../App';
import { get_all_tasks, add_task, edit_task, delete_task, } from '../redux/actions';
import { ADD_TASKS } from '../actions/types';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'; // Assuming you're using Firestore
import { firebaseAuth } from "./utils/DataHandler"; // Firebase authentication utilities
// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });



///////////////////////////
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn(), // If you're using Firestore array operations
}));

jest.mock('firebase/auth', () => ({
  firebaseAuth: {
    currentUser: { uid: 'user123' }, // Mock current user ID
  },
}));

describe('add_task action', () => {
  let dispatch;
  let getState;

  beforeEach(() => {
    // Reset mocks before each test
    dispatch = jest.fn();
    getState = jest.fn(() => ({ tasks: [] })); // Mock initial state with an empty task list
  });

  it('should add a new task and update Firestore', async () => {
    const mockTask = { id: '1', title: 'Test Task' }; // Mock task
    const userId = firebaseAuth.currentUser.uid;
    const userRef = { id: userId }; // Mock document reference

    // Mock Firestore methods
    doc.mockReturnValue(userRef);
    getDoc.mockResolvedValue({ exists: true });
    setDoc.mockResolvedValue(); // In case of document creation
    updateDoc.mockResolvedValue(); // For updating the document
    arrayUnion.mockReturnValue([mockTask]); // Mock arrayUnion behavior

    // Call the add_task function
    await add_task(mockTask)(dispatch, getState);

    // Assertions: check if the correct Firestore methods were called
    expect(doc).toHaveBeenCalledWith(expect.anything(), "tasks", userId);
    expect(getDoc).toHaveBeenCalledWith(userRef);
    expect(updateDoc).toHaveBeenCalledWith(userRef, {
      tasks: arrayUnion(mockTask),
    });

    // Check if dispatch was called with the correct action
    const expectedTasks = [mockTask]; // Expected updated tasks in the store
    expect(dispatch).toHaveBeenCalledWith({ type: ADD_TASKS, payload: expectedTasks });
  });

  it('should create a new document if it does not exist', async () => {
    const mockTask = { id: '2', title: 'New Task' }; // Another mock task
    const userId = firebaseAuth.currentUser.uid;
    const userRef = { id: userId };

    // Mock Firestore methods
    doc.mockReturnValue(userRef);
    getDoc.mockResolvedValue({ exists: false }); // Simulate document does not exist
    setDoc.mockResolvedValue(); // Mock setDoc for creating a new document
    updateDoc.mockResolvedValue(); // Mock updating the document
    arrayUnion.mockReturnValue([mockTask]);

    // Call the add_task function
    await add_task(mockTask)(dispatch, getState);

    // Assertions: Check if setDoc is called when the document does not exist
    expect(setDoc).toHaveBeenCalledWith(userRef, { tasks: [] });

    // Assertions: Check if updateDoc was called to update Firestore
    expect(updateDoc).toHaveBeenCalledWith(userRef, {
      tasks: arrayUnion(mockTask),
    });

    // Check if dispatch was called with the correct action
    expect(dispatch).toHaveBeenCalledWith({ type: ADD_TASKS, payload: [mockTask] });
  });
});