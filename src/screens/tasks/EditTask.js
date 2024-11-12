/**
 *
 * This file defines the EditTask screen component, which is similar to the AddTask screen but with pre-filled data.
 *
 * @module EditTask
 */

import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch } from "react-redux";
import { add_task } from "../../redux/actions";
import { connect } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import * as Icons from "react-native-vector-icons";
import { edit_task } from "../../utils/DataHandler";

/**
 * EditTask component allows users to edit an existing task with pre-filled data.
 *
 * @param {object} props - The properties passed to the component.
 * @param {object} props.navigation - The navigation object provided by React Navigation.
 * @param {object} props.route - The route object provided by React Navigation.
 * @param {object} props.task - The task object to be edited.
 *
 * @returns {JSX.Element} The rendered EditTask component.
 */
const EditTask = ({ navigation, route, task }) => {
  const theme = useTheme();
  const [task, setTask] = useState(task);

  /**
   * Handles changes to the task form inputs.
   *
   * @param {object} event - The event object from the input change.
   * @param {object} event.target - The target element of the event.
   * @param {string} event.target.name - The name of the input field.
   * @param {string} event.target.value - The value of the input field.
   * @param {string} event.target.type - The type of the input field.
   * @param {boolean} event.target.checked - The checked state of the input field (for checkboxes).
   * @param {boolean} event.target.multi_step - The multi-step state of the input field.
   */
  //look at the bottom to see how this works
  const handleChange = (event) => {
    const { name, value, type, checked, } = event.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: type === "checkbox" ? checked : value,
    }));
    return <View></View>;
  };
};

/**
 * Maps dispatch actions to component props.
 *
 * @param {function} dispatch - The Redux dispatch function.
 *
 * @returns {object} The mapped dispatch actions.
 */
const mapDispatchToProps = (dispatch) => {
  return {
    add_task: (task) => dispatch(edit_task(task)),
  };
};

export default connect(mapDispatchToProps)(EditTask);


//this is how you actually call the handleChange function, so what this call does it update the time_due field 
//in the task object and updates it with the current_time (format_time function will return current time, but don't worry about that)
// 
/* handleChange({ target: { name: "time_due", value: format_time(currentDate) } });
  };
  //so basically the event comes in as an object, and we destructure it to get the name and value of the input field,
  and then we run setTask to update the task. in setTask, when you have a (prevTask (this can be any variable name)) => {} (the function body),
  react native will know that whatever that variable name is (here it is prevTask) will be the current version of the task objct.

  then we use the spread operator (...) to copy the previous task object, and then update the field that we want to update.
  type === "checkbox" ? checked : value, works by checking if the type variable is "checkbox", 
  if it is, it will return checked, if it is false, then it will return value. 
  
  So the structure is like this: (boolean) ? (if true) : (if false) (and in our case, the boolean is type === "checkbox")
  const handleChange = (event) => {
    const { name, value, type, checked,} = event.target; //e comes in as an object
    setTask((prevTask) => ({
      ...prevTask,
      [name]: type === "checkbox" ? checked : value,
    }));
  }; */
