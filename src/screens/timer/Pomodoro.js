import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import { useSelector, useDispatch } from "react-redux";
import ProgressCircle from "react-native-progress/Circle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  startPomodoro,
  pausePomodoro,
  toggleSessionCompletion,
  complete_task,
  editSession,
} from "../../redux/actions";
import { useTheme } from "@react-navigation/native";

const PomodoroScreen = ({ navigation, route }) => {
  const session = route?.params?.session || null;
  const studyPlanId = route?.params?.studyPlanId || null;
  const [completed_tasks, setUncompletedTasks] = useState([]); // State variable to store completed tasks
  const dispatch = useDispatch();

  // Accessing Redux state for initial values
  const tasks = useSelector((state) => state.tasks || []);
  useEffect(() => {
    const uncompleted = tasks.filter((task) => !task.completed);
    setUncompletedTasks(uncompleted);
    try {
      setSelectedTask(uncompleted[0].title);
    } catch {}
  }, [tasks]);

  const sessionHistory = useSelector((state) => state.sessionHistory || {});
  const defaultPomodoroLength = useSelector((state) => state.sessionTime);
  const defaultBreakLength = useSelector((state) => state.breakTime);

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setTimeLeft] = useState(defaultPomodoroLength);
  const [pomodoroLength, setpomodoroLength] = useState(defaultPomodoroLength);
  const [breakLength, setBreakLength] = useState(defaultBreakLength);
  const [selectedTask, setSelectedTask] = useState('');

  useEffect(() => {
    let timer;
    if ((isSessionActive || isBreakActive) && !isPaused && currentTime > 0) {
      timer = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (currentTime === 0) {
      if (isSessionActive) {
        handleSessionCompletion();
      } else if (isBreakActive) {
        handleBreakCompletion();
      }
    }
    return () => clearInterval(timer);
  }, [isSessionActive, isBreakActive, isPaused, currentTime]);

  // Calculate progress for circular progress bar
  const progress = isBreakActive
    ? currentTime / breakLength
    : currentTime / pomodoroLength;

  // Start or resume a Pomodoro session
  const handleStart = () => {
    if (!isSessionActive && !isBreakActive) {
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
  const handleResume = () => {
    setIsPaused(false);
    setIsSessionActive(true);
    setIsBreakActive(false);
  }; // Save the timer state to AsyncStorage
  const saveTimerState = async () => {
    try {
      const state = {
        currentTime,
        isSessionActive,
        isBreakActive,
        isPaused,
        pomodoroLength,
        breakLength,
      };
      await AsyncStorage.setItem("timerState", JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save timer state:", error);
    }
  };
  // Load the timer state from AsyncStorage
  const loadTimerState = async () => {
    try {
      const savedState = await AsyncStorage.getItem("timerState");
      if (savedState) {
        const {
          currentTime,
          isSessionActive,
          isBreakActive,
          isPaused,
          pomodoroLength,
          breakLength,
        } = JSON.parse(savedState);
        setTimeLeft(currentTime || defaultPomodoroLength);
        setIsSessionActive(isSessionActive || false);
        setIsBreakActive(isBreakActive || false);
        setIsPaused(isPaused || false);
        setpomodoroLength(pomodoroLength || defaultPomodoroLength);
        setBreakLength(breakLength || defaultBreakLength);
      }
    } catch (error) {
      console.error("Failed to load timer state:", error);
    }
  };

  // Call loadTimerState when the component mounts
  useEffect(() => {
    loadTimerState();
  }, []);

  // Update AsyncStorage whenever timer-related states change
  useEffect(() => {
    saveTimerState();
  }, [
    currentTime,
    isSessionActive,
    isBreakActive,
    isPaused,
    pomodoroLength,
    breakLength,
  ]);

  const handleSessionCompletion = () => {
    if (session) {
      // Complete the current session if it exists
      dispatch(toggleSessionCompletion(studyPlanId, session.id));

      // Update the session's timer details
      const updatedTimer = {
        ...session.timer,
        completedIntervals: (session.timer.completedIntervals || 0) + 1,
      };

      const updatedSession = {
        ...session,
        timer: updatedTimer,
      };

      dispatch(editSession(studyPlanId, session.id, updatedSession));
    } else {
      // Otherwise, complete the selected task
      const taskToComplete = tasks.find((task) => task.title === selectedTask);
      if (taskToComplete) {
        dispatch(complete_task(taskToComplete.id));
      }
    }

    setIsSessionActive(false);
    setIsBreakActive(true);
    setTimeLeft(Math.floor(breakLength));
    saveTimerState();
  };
  // Handle break completion and start a new session
  const handleBreakCompletion = () => {
    setIsBreakActive(false);
    setIsSessionActive(true);
    setTimeLeft(Math.floor(pomodoroLength));
    saveTimerState();
  };

  // Reset the Pomodoro timer
  const handleReset = () => {
    setIsSessionActive(false);
    setIsBreakActive(false);
    setIsPaused(false);
    setTimeLeft(Math.floor(pomodoroLength));
    saveTimerState();
  };

  // Formatting time to minutes and seconds
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  const theme = useTheme();

  if (session) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={[
            styles.taskSelector,
            {
              backgroundColor: theme.colors.inputBackground,
              borderColor: theme.colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.taskLabel,
              { color: theme.colors.text, fontWeight: "bold" },
            ]}
          >
            Session: {session.title}
          </Text>
          <Text style={[styles.taskLabel, { color: theme.colors.text }]}>
            {session.description}
          </Text>
        </View>

        {/* Circular Progress Bar */}
        <ProgressCircle
          style={styles.progressCircle}
          size={250}
          progress={progress}
          thickness={8}
          color={isBreakActive ? "rgba(248,149,83,0.8)" : theme.colors.primary}
          showsText={true}
          formatText={() => formatTime(currentTime)}
          textStyle={styles.timer}
        />

        {/* Sliders to set session and break lengths*/}
        <View style={styles.sliderContainer}>
          <Text style={[styles.sliderLabel, { color: theme.colors.text }]}>
            {" "}
            Session Length: {Math.floor(pomodoroLength / 60)} min
          </Text>
          <Slider
            thumbTintColor={theme.colors.primary}
            minimumTrackTintColor={theme.colors.primary}
            style={[styles.slider, {}]}
            minimumValue={60} // 5 mins
            maximumValue={3600} // 60 mins
            step={60}
            value={pomodoroLength}
            onValueChange={(value) => {
              const roundedValue = Math.round(value);
              setpomodoroLength(roundedValue);
              setTimeLeft(roundedValue);
            }}
            onSlidingComplete={(value) => {
              const roundedValue = Math.round(value);
              setTimeLeft(roundedValue);
            }}
          />
        </View>

        <View style={styles.sliderContainer}>
          <Text style={[styles.sliderLabel, { color: theme.colors.text }]}>
            {" "}
            Break Length: {Math.floor(breakLength / 60)} min
          </Text>
          <Slider
            thumbTintColor={theme.colors.primary}
            minimumTrackTintColor={theme.colors.primary}
            style={styles.slider}
            minimumValue={60} // 1 min
            maximumValue={1800} // 30 mins
            step={60}
            value={breakLength}
            onValueChange={(value) => setBreakLength(value)}
          />
        </View>

        {/* Button Logic */}
        <View style={styles.buttonContainer}>
          {isSessionActive || isBreakActive ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.pauseButton]}
                onPress={handlePause}
              >
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
              {isPaused && (
                <TouchableOpacity
                  style={[styles.button, styles.resumeButton]}
                  onPress={handleResume}
                >
                  <Text style={styles.buttonText}>Resume</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={handleReset}
              >
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.startButton]}
              onPress={isBreakActive ? handleBreakCompletion : handleStart}
            >
              <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                {isBreakActive ? "Start Next Session" : "Start"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={[
          styles.taskSelector,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: theme.colors.primary,
          },
        ]}
      >
        <Text style={[styles.taskLabel, { color: theme.colors.text }]}>
          Select Task:
        </Text>
        <Picker
          selectedValue={selectedTask}
          onValueChange={(itemValue) => setSelectedTask(itemValue)}
          style={[
            styles.picker,
            { backgroundColor: theme.colors.inputBackground },
          ]}
        >
          <Picker.Item label="None" value={null} color={theme.colors.text} />
          {completed_tasks.map((task) => (
            <Picker.Item
              key={task.id}
              label={task.title}
              value={task.title}
              color={theme.colors.text}
            />
          ))}
        </Picker>
      </View>

      {/*Display selected task*/}
      <Text style={[styles.selectedTask, { color: theme.colors.text }]}>
        Assigned Task: {selectedTask || "None"}
      </Text>

      {/* Circular Progress Bar */}
      <ProgressCircle
        style={styles.progressCircle}
        size={250}
        progress={progress}
        thickness={8}
        color={isBreakActive ? "rgba(248,149,83,0.8)" : theme.colors.primary}
        showsText={true}
        formatText={() => formatTime(currentTime)}
        textStyle={styles.timer}
      />

      {/* Sliders to set session and break lengths*/}
      <View style={styles.sliderContainer}>
        <Text style={[styles.sliderLabel, { color: theme.colors.text }]}>
          {" "}
          Session Length: {Math.floor(pomodoroLength / 60)} min
        </Text>
        <Slider
          thumbTintColor={theme.colors.primary}
          minimumTrackTintColor={theme.colors.primary}
          style={[styles.slider, {}]}
          minimumValue={60} // 5 mins
          maximumValue={3600} // 60 mins
          step={60}
          value={pomodoroLength}
          onValueChange={(value) => {
            const roundedValue = Math.round(value);
            setpomodoroLength(roundedValue);
            setTimeLeft(roundedValue);
          }}
          onSlidingComplete={(value) => {
            const roundedValue = Math.round(value);
            setTimeLeft(roundedValue);
          }}
        />
      </View>

      <View style={styles.sliderContainer}>
        <Text style={[styles.sliderLabel, { color: theme.colors.text }]}>
          {" "}
          Break Length: {Math.floor(breakLength / 60)} min
        </Text>
        <Slider
          thumbTintColor={theme.colors.primary}
          minimumTrackTintColor={theme.colors.primary}
          style={styles.slider}
          minimumValue={60} // 1 min
          maximumValue={1800} // 30 mins
          step={60}
          value={breakLength}
          onValueChange={(value) => setBreakLength(value)}
        />
      </View>

      {/* Button Logic */}
      <View style={styles.buttonContainer}>
        {isSessionActive || isBreakActive ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.pauseButton]}
              onPress={handlePause}
            >
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
            {isPaused && (
              <TouchableOpacity
                style={[styles.button, styles.resumeButton]}
                onPress={handleResume}
              >
                <Text style={styles.buttonText}>Resume</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={isBreakActive ? handleBreakCompletion : handleStart}
          >
            <Text style={[styles.buttonText, { color: theme.colors.text }]}>
              {isBreakActive ? "Start Next Session" : "Start"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/*  
      <TouchableOpacity
        style={styles.exitButton}
        onPress={() => {
          navigation.navigate("Daily");
        }}
      >
        <Text style={[styles.exitButtonText]}>Exit to Daily Page</Text>
      </TouchableOpacity>*/}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  taskSelector: {
    marginBottom: 20,
    width: "80%",
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
  },
  taskLabel: {
    fontSize: 20,
    marginBottom: 10,
    alignSelf: "center",
  },
  picker: {
    width: "100%",
    borderRadius: 10,
    fontSize: 18,
  },
  selectedTask: {
    fontSize: 15,
    color: "#91c7cc",
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: "bold",
    color: "#91c7cc",
    marginBottom: 20,
  },
  timer: {
    fontSize: 60,
    fontFamily: "Futura",
    color: "#91c7cc",
    marginBottom: 10,
  },
  sliderContainer: {
    width: "80%",
    marginBottom: 30,
  },
  slider: {
    width: "100%",
    height: 40,
  },

  sliderLabel: {
    fontSize: 18,
    fontWeigth: "bold",
    color: "#91c7cc",
    marginBottom: 10,
  },
  progressContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
  },

  progressCircle: {
    marginBottom: 80,
    position: "relative",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },

  button: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#91c7cc",
  },

  pauseButton: {
    width: 160,
    flex: 0.3,
    backgroundColor: "rgba(52,52,52,0.2)",
  },

  resumeButton: {
    width: 160,
    flex: 0.4,
    backgroundColor: "rgba(52,52,52,0.2)",
  },

  resetButton: {
    width: 160,
    flex: 0.3,
    backgroundColor: "rgba(52,52,52,0.2)",
  },

  startButton: {
    width: 170,
    flex: 0,
    backgroundColor: "rgba(52,52,52,0.2)",
  },

  exitButton: {
    marginTop: 0,
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },

  exitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fdffff",
  },
});

export default PomodoroScreen;
