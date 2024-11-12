import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { useSelector, useDispatch } from 'react-redux';
import ProgressCircle from 'react-native-progress/Circle';
import { startPomodoro, pausePomodoro, resetPomodoro, updateSessionCount, loadSessionData, saveSessionData } from '../../redux/actions';

const PomodoroScreen = ({navigation}) => {
    
    const dispatch = useDispatch();

    // Accessing Redux state for initial values
    // const tasks = useSelector(state => state.tasks || []);
    const tasks = [
        {
            title: "Complete Math Homework",
            deadline: "2024-11-15",
            description: "Finish all exercises in Chapter 3 for calculus review.",
            tags: ["problem set", "math"],
            id: "task-001",
            recurring: false,
            priority: 3,
            completed: false,
            time_due: "17:00",
            created_at: new Date().getTime(),
            updated_at: new Date().getTime(),
            multi_step: true,
            sub_tasks: [
                { title: "Exercise 1-10", completed: false },
                { title: "Exercise 11-20", completed: false },
            ],
            collaborative: false,
            users: [],
            reminder: {
                enabled: true,
                reminder_time: "2024-11-15T16:00",
            },
            attachments: [],
            subject: {
                name: "Math Core",
                color: "#FF5733"
            },
            urgent: true,
        },
        {
            title: "Research for Art History Paper",
            deadline: "2024-11-20",
            description: "Gather research materials on Renaissance art for final paper.",
            tags: ["essay", "art history"],
            id: "task-002",
            recurring: false,
            priority: 2,
            completed: false,
            time_due: "23:59",
            created_at: new Date().getTime(),
            updated_at: new Date().getTime(),
            multi_step: false,
            sub_tasks: [],
            collaborative: true,
            users: ["user_123", "user_456"],
            reminder: {
                enabled: true,
                reminder_time: "2024-11-19T10:00",
            },
            attachments: ["file://documents/renaissance_notes.pdf"],
            subject: {
                name: "Art History",
                color: "#5A9BD4"
            },
            urgent: false,
        },
        {
            title: "Physics Lab Report",
            deadline: "2024-11-18",
            description: "Complete the lab report on Newton's second law experiment.",
            tags: ["lab report", "physics"],
            id: "task-003",
            recurring: true,
            priority: 1,
            completed: false,
            time_due: "18:00",
            created_at: new Date().getTime(),
            updated_at: new Date().getTime(),
            multi_step: true,
            sub_tasks: [
                { title: "Draft report", completed: false },
                { title: "Analyze data", completed: false },
                { title: "Create graphs", completed: false },
            ],
            collaborative: false,
            users: [],
            reminder: {
                enabled: false,
                reminder_time: "",
            },
            attachments: ["file://documents/lab_data.xlsx"],
            subject: {
                name: "Physics",
                color: "#FFC300"
            },
            urgent: true,
        },
    ];
    
    const sessionHistory = useSelector(state => state.sessionHistory||{});
    const defaultPomodoroLength = useSelector(state => state.sessionTime);
    const defaultBreakLength = useSelector(state => state.breakTime);

    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isBreakActive, setIsBreakActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentTime, setTimeLeft ] = useState(defaultPomodoroLength);
    const [pomodoroLength, setpomodoroLength] = useState(defaultPomodoroLength);
    const [breakLength, setBreakLength] = useState(defaultBreakLength);
    const [selectedTask, setSelectedTask] = useState(tasks[0].title);

    // Countdown logic using useEffect
    useEffect( () => {
        let timer;
        if ((isSessionActive || isBreakActive) && !isPaused && currentTime > 0){
            timer = setInterval(() => {
                setTimeLeft(currentTime => currentTime - 1);
            }, 1000);

        } else if (currentTime == 0){
            if(isSessionActive){
                handleSessionCompletion();
            } else if (isBreakActive){
                handleBreakCompletion();
            }
            
        }
        return () => clearInterval(timer);
        }, [isSessionActive, isBreakActive, isPaused, currentTime]);


    // Calculate progress for circular progress bar
    const progress = isBreakActive ? (currentTime/breakLength):(currentTime/pomodoroLength)
    
    // Start or resume a Pomodoro session
    const handleStart = () => {
        if (!isSessionActive && !isBreakActive){
            setTimeLeft(pomodoroLength);
        }
        setIsSessionActive(true);
        setIsBreakActive(false);
        setIsPaused(false);
        dispatch(startPomodoro());
    };

    // Pause the session
    const handlePause = () => {
        setIsSessionActive(true);
        setIsBreakActive(false);
        setIsPaused(true);
        dispatch(pausePomodoro());
    };

    // Unpause the session
    const handleResume = () =>{
        setIsPaused(false);
        setIsSessionActive(true);
        setIsBreakActive(false);
    }

    // Complete session and start break
    const handleSessionCompletion = () => {
        const completedSession = {
            date: new Date().toISOString(),
            sessionCount: 1,
            task: selectedTask ? selectedTask.name: 'No task',
        };

        dispatch(updateSessionCount(completedSession));
        dispatch(saveSessionData([...sessionHistory,completedSession]));

        setIsSessionActive(false);
        setIsBreakActive(true);
        setTimeLeft(Math.floor(breakLength));
    };

    // Handle break completion and start a new session
    const handleBreakCompletion = () => {
        setIsBreakActive(false);
        setIsSessionActive(true);
        setIsPaused(false);
        setTimeLeft(Math.floor(pomodoroLength));
        dispatch(startPomodoro());
    };

    // Reset the Pomodoro timer
    const handleReset = () => {
        setIsSessionActive(false);
        setIsBreakActive(false);
        setIsPaused(false);
        setTimeLeft(Math.floor(pomodoroLength));
    }

    // Formatting time to minutes and seconds
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds/60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    return(
        <View style = {styles.container}>
            <Text style = {styles.title}>{isBreakActive ? 'Break Time' : 'Pomodoro Timer'}</Text>

            {/* Task Selection Dropdown */}
            <View style={styles.taskSelector}>
                <Text style = {styles.taskLabel}>Select Task:</Text>
                <Picker
                    selectedValue = {selectedTask}
                    onValueChange = {(itemValue)=>setSelectedTask(itemValue)}
                    style = {styles.picker}
                    >
                        <Picker.Item label="None" value={null}/>
                        {tasks.map((task) =>(
                            <Picker.Item key={task.id} label={task.title} value={task.title}/>
                        ))}
                </Picker>
            </View>
            
            {/*Display selected task*/}
            <Text style = {styles.selectedTask}>
                Assigned Task: {selectedTask || 'None'}
            </Text>

            {/* Circular Progress Bar */}
            <ProgressCircle
                style = {styles.progressCircle}
                size = {250}
                progress = {progress}
                thickness = {8}
                color = {isBreakActive ? 'rgba(248,149,83,0.8)':'rgba(65,127,132,1)'}
                showsText = {true}
                formatText = {() => formatTime(currentTime)}
                textStyle = {styles.timer}
            />

            {/* Sliders to set session and break lengths*/}
            <View style = {styles.sliderContainer}>
                <Text style = {styles.sliderLabel}> Session Length: {Math.floor(pomodoroLength/60)} min</Text>
                <Slider 
                    style={styles.slider}
                    minimumValue = {60} // 5 mins
                    maximumValue = {3600} // 60 mins
                    step = {60}
                    value = {pomodoroLength}
                    onValueChange={value=>{
                        const roundedValue = Math.round(value);
                        setpomodoroLength(roundedValue);
                        setTimeLeft(roundedValue);
                    }}
                    onSlidingComplete={(value)=>{
                        const roundedValue = Math.round(value);
                        setTimeLeft(roundedValue);

                    }}
                />
            </View>

            
            <View style={styles.sliderContainer}>
                <Text style = {styles.sliderLabel}> Break Length: {Math.floor(breakLength/60)} min</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={60} // 1 min
                    maximumValue={1800} // 30 mins
                    step={60}
                    value={breakLength}
                    onValueChange={value=>setBreakLength(value)}
                />
            </View>

            {/* Button Logic */}
            <View style={styles.buttonContainer}>
                {isSessionActive || isBreakActive ? (
                    <>
                    <TouchableOpacity style={[styles.button, styles.pauseButton]} onPress={handlePause}>
                        <Text style = {styles.buttonText}>Pause</Text>
                    </TouchableOpacity>
                    {isPaused && (
                        <TouchableOpacity style={[styles.button, styles.resumeButton]} onPress={handleResume}>
                            <Text style={styles.buttonText}>Resume</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style = {[styles.button, styles.resetButton]} onPress={handleReset}>
                        <Text style = {styles.buttonText}>Reset</Text>
                    </TouchableOpacity>
                    </>
                ): (
                    <TouchableOpacity
                        style = {[styles.button, styles.startButton]}
                        onPress = {isBreakActive ? handleBreakCompletion : handleStart}
                    >
                        <Text style={styles.buttonText}>{isBreakActive ? 'Start Next Session' : 'Start'}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                style={styles.exitButton}
                onPress={()=>{
                    navigation.navigate('Daily');
                }}
            >
                <Text style={styles.exitButtonText}>Exit to Daily Page</Text>
            </TouchableOpacity>

        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 100,
        paddingBottom: 100,
    },
    taskSelector: {
        marginBottom:100,
        width: '80%',
        height: '10%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#91c7cc',
        paddingVertical: 10,
    },
    taskLabel: {
        fontSize: 15,
        color: '91c7cc',
        marginBottom: 10,
    },
    picker:{
        width: '100%',
        height:20,
        backgroundColor: '#f7f7f7',
        color: '#91c7cc',
        borderRadius:10,
        fontSize: 18,
    },
    selectedTask:{
        fontSize: 15,
        color: '#91c7cc',
        marginBottom:10,
    },
    title: {
        flex:1,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#91c7cc',
        marginBottom:20,
    },
    timer: {
        fontSize: 60,
        fontFamily: 'Futura',
        color: '#91c7cc',
        marginBottom:10,
    },
    sliderContainer: {
        width: '80%',
        marginBottom: 30,
    },
    slider: {
        width: '100%',
        height: 40,
    },

    sliderLabel: {
        fontSize: 18,
        fontWeigth: 'bold',
        color: '#91c7cc',
        marginBottom: 10,
    },
    progressContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:100,
    },

    progressCircle:{
        marginBottom: 80,
        position: 'relative'
    },

    buttonContainer:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom:30,
    },

    button:{
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },

    buttonText:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#91c7cc',
    },

    pauseButton:{
        width: 160,
        flex: 0.3,
        backgroundColor: 'rgba(52,52,52,0.2)'
    },

    resumeButton:{
        width: 160,
        flex: 0.4,
        backgroundColor: 'rgba(52,52,52,0.2)'
    },

    resetButton:{
        width: 160,
        flex: 0.3,
        backgroundColor: 'rgba(52,52,52,0.2)'
    },

    startButton:{
        width: 170,
        flex: 0,
        backgroundColor: 'rgba(52,52,52,0.2)'
    },

    exitButton: {
        marginTop: 0,
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },

    exitButtonText:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fdffff'
    }
});

export default PomodoroScreen;