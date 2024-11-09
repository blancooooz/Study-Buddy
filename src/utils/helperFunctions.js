//file for helper functions to be used throughout the app, for instance, filtering tasks will happen in both Tasks screen and in Daily.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelperFunctions = () => {
    
};
export const filter_tasks_uncompleted = (tasks) => {
    return tasks.filter(task => !task.completed);
}
export const filter_tasks_completed = (tasks) => {
    return tasks.filter(task => task.completed);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HelperFunctions;






