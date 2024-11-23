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
import {
  startPomodoro,
  pausePomodoro,
  resetPomodoro,
  updateSessionCount,
  loadSessionData,
  saveSessionData,
  toggleSessionCompletion,
  complete_task
} from "../../redux/actions";
import { useTheme } from "@react-navigation/native";
import Session from "../study/sessions/Session";

const PomodoroScreen = ({ navigation, route }) => {
  // Use toggleSessionCompletion(studyPlanId, session.id) or complete_task(task.id) on the 
  // session/task when timer reaches 0

  // Needs to track in background OR prevent users from leaving this screen unless timer paused.

  // Also, if a timer is active and a user navigates to this page, have to make sure that the current timer 
  // is displayed. Probably a simple check with redux actions.

  // Only necessary redux code needed is mayb activeTimer and/or small changes to updateSession(timer).

  const session = route?.params?.session || null;
  const studyPlanId = route?.params?.studyPlanId || null;
  const dispatch = useDispatch();

  // Accessing Redux state for initial values
  const tasks = useSelector((state) => state.tasks || []);

  const sessionHistory = useSelector((state) => state.sessionHistory || {});
  const defaultPomodoroLength = useSelector((state) => state.sessionTime);
  const defaultBreakLength = useSelector((state) => state.breakTime);

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setTimeLeft] = useState(defaultPomodoroLength);
  const [pomodoroLength, setpomodoroLength] = useState(defaultPomodoroLength);
  const [breakLength, setBreakLength] = useState(defaultBreakLength);
  const [selectedTask, setSelectedTask] = useState(tasks[0].title);

  // Countdown logic using useEffect
  useEffect(() => {
    let timer;
    if ((isSessionActive || isBreakActive) && !isPaused && currentTime > 0) {
      timer = setInterval(() => {
        setTimeLeft((currentTime) => currentTime - 1);
      }, 1000);
    } else if (currentTime == 0) {
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
  };

  // Complete session and start break
  const handleSessionCompletion = () => {
    const completedSession = {
      date: new Date().toISOString(),
      sessionCount: 1,
      task: selectedTask ? selectedTask.name : "No task",
    };

    dispatch(updateSessionCount(completedSession));
    dispatch(saveSessionData([...sessionHistory, completedSession]));

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
          {tasks.map((task) => (
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
