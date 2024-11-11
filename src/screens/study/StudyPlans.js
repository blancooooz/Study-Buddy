import React, { useEffect } from "react";
import { View, Text, Button, Touchable } from "react-native";
import { useTheme } from "@react-navigation/native"; // Use theme for light/dark mode
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux"; // Redux hook to access the store's state
import { connect } from "react-redux";
import { addStudyPlan, addSession } from "../../redux/actions";
import "react-native-get-random-values";
import { useDispatch } from "react-redux";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid"; // import uuid library

const StudyPlan = ({ navigation }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  let studyPlans = [];
  try {
    studyPlans = useSelector((state) => state.studyPlans || []);
  } catch (e) {}

  useEffect(() => {
    console.log(studyPlans.length);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Session");
        }}
      >
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: theme.colors.primary,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "600" }}>Add a Session</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Add a Session");
        }}
      >
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: theme.colors.primary,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "600" }}>Edit a Session</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Edit a Session");
        }}
      >
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: theme.colors.primary,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "600" }}>Session</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Session");
        }}
      >
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: theme.colors.primary,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "600" }}>Study Plan</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Add a Plan");
        }}
      >
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: theme.colors.primary,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "600" }}>Add a study plan</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Edit a Plan");
        }}
      >
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: theme.colors.primary,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "600" }}>Edit a study plan</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    // Dispatch the `updateUsername` action when called
    addStudyPlan: (studyPlan) => dispatch(addStudyPlan(studyPlan)),
    addSession: (session) => dispatch(addSession(session)),
  };
};

export default connect(mapDispatchToProps)(StudyPlan);
