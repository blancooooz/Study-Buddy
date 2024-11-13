// src/components/DailyAgenda.js
import React, { useState, useEffect, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
} from "react-native";
import { Agenda } from "react-native-calendars";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@react-navigation/native";


const DailyAgenda = ({ navigation }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    
    const [items, setItems] = useState({});
    const tasks = useSelector((state) => state.tasks || []);
    useEffect(() => {
       
    
    }, [dispatch]);

    useEffect(() => {
        const formattedItems = tasks.reduce((acc, task) => {
            const taskDate = task.deadline || "";
            if (taskDate) {
                if (!acc[taskDate]) {
                    acc[taskDate] = [];
                }
                acc[taskDate].push({
                    id: task.id,
                    title: task.title || "No Title",
                    completed: task.completed,
                });
            }
            return acc;
        }, {});
        setItems(formattedItems);
    }, [tasks]);

    const renderItem = (item) => (
        <TouchableOpacity
            style={styles.taskItem}
            onPress={() => navigation.navigate("EditTask", { taskId: item.id })}
        >
            <Text style={styles.taskTitle}>{item.title}</Text>
        </TouchableOpacity>
    );

    const renderEmptyDate = () => (
        <View style={styles.emptyDate}>
            <Text>No tasks for this date.</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Agenda
                items={items}
                renderItem={renderItem}
                renderEmptyDate={renderEmptyDate}
                theme={{
                    selectedDayBackgroundColor: theme.colors.selectedDayBackgroundColor,
                    selectedDayTextColor: theme.colors.selectedDayTextColor,
                    todayTextColor: theme.colors.todayTextColor,
                    agendaDayTextColor: theme.colors.agendaDayTextColor,
                    agendaDayNumColor: theme.colors.agendaDayNumColor,
                    agendaKnobColor: theme.colors.agendaKnobColor,
                    backgroundColor: theme.colors.background,
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    taskItem: {
        backgroundColor: "#fff",
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
    },
    taskTitle: {
        fontSize: 16,
    },
    emptyDate: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
});

export default DailyAgenda;
