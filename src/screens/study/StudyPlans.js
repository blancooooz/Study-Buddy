import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, FlatList } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSelector, connect } from "react-redux";
import { addStudyPlan, addSession } from "../../redux/actions";

const StudyPlan = ({ navigation }) => {
  const theme = useTheme();
  const studyPlans = useSelector((state) => state.studyPlans || []);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (studyPlanId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [studyPlanId]: !prevExpanded[studyPlanId],
    }));
  };

  const renderStudyPlan = ({ item }) => {
    const sessionsCompleted = item.sessions.filter((session) => session.completed).length;
    const totalSessions = item.sessions.length;
    const progress = totalSessions > 0 ? (sessionsCompleted / totalSessions) * 100 : 0;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Study Plan", { id: item.id })}
        style={{
          padding: 16,
          marginVertical: 8,
          backgroundColor: theme.colors.card,
          borderRadius: 8,
          alignSelf: "center",
        }}
      >
        <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "bold" }}>
          {item.title}
        </Text>
        <Text style={{ color: theme.colors.text }}>Due Date: {item.dueDate}</Text>
        <Text style={{ color: theme.colors.text }}>Created At: {item.createdAt}</Text>
        <Text style={{ color: theme.colors.text, fontWeight: "bold" }}>
          Urgent: {item.urgent ? "Yes" : "No"}
        </Text>
        
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <Text style={{ color: theme.colors.primary }}>
            {expanded[item.id] ? "Hide Sessions" : "Show Sessions"}
          </Text>
        </TouchableOpacity>

        {expanded[item.id] && (
          <View style={{ marginTop: 8 }}>
            {item.sessions.map((session) => (
              <Text key={session.id} style={{ color: theme.colors.text, marginLeft: 8 }}>
                - {session.title}
              </Text>
            ))}
          </View>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
          <Button
            title="Start Session"
            onPress={() => console.log("Starting session for", item.title)}
            color={theme.colors.primary}
          />
          <Text style={{ color: theme.colors.text, marginLeft: 16 }}>
            Progress: {Math.round(progress)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      {studyPlans.length === 0 ? (
        <TouchableOpacity
          onPress={() => navigation.navigate("Add a Plan")}
          style={{
            padding: 16,
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme.colors.text, fontSize: 18 }}>
            Tap here to add your first study plan
          </Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={studyPlans}
          renderItem={renderStudyPlan}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
};

const mapDispatchToProps = (dispatch) => ({
  addStudyPlan: (studyPlan) => dispatch(addStudyPlan(studyPlan)),
  addSession: (session) => dispatch(addSession(session)),
});

export default connect(null, mapDispatchToProps)(StudyPlan);