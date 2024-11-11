import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";

const StudyPlan = ({ route, navigation }) => {
  const { id } = route.params; // Retrieve study plan ID from navigation params
  const theme = useTheme();

  // Select the specific study plan from the Redux store based on the ID
  const studyPlan = useSelector((state) =>
    state.studyPlans.find((plan) => plan.id === id)
  );

  if (!studyPlan) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: theme.colors.text }}>Study Plan not found</Text>
      </View>
    );
  }

  const renderSession = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Session", { studyPlanId: id, sessionId: item.id })}
      style={[styles.sessionContainer, { backgroundColor: theme.colors.card }]}
    >
      <Text style={{ color: theme.colors.text, fontSize: 16 }}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {studyPlan.title}
      </Text>
      <Text style={[styles.description, { color: theme.colors.text }]}>
        {studyPlan.description}
      </Text>

      <View style={styles.infoContainer}>
        <Text style={{ color: theme.colors.text }}>
          Subject:{" "}
          <Text style={{ color: studyPlan.subject.color }}>
            {studyPlan.subject.name}
          </Text>
        </Text>
        <Text style={{ color: theme.colors.text }}>
          Urgent: {studyPlan.urgent ? "Yes" : "No"}
        </Text>
        <Text style={{ color: theme.colors.text }}>
          Completed: {studyPlan.completed ? "Yes" : "No"}
        </Text>
        {studyPlan.collaborative && (
          <Text style={{ color: theme.colors.text }}>
            Collaborative with: {studyPlan.users.join(", ")}
          </Text>
        )}
      </View>

      {studyPlan.reminder.enabled && (
        <Text style={{ color: theme.colors.text }}>
          Reminder Set for: {studyPlan.reminder.reminder_time}
        </Text>
      )}

      <View style={styles.tagContainer}>
        {studyPlan.tags.map((tag, index) => (
          <Text
            key={index}
            style={[styles.tag, { color: theme.colors.primary }]}
          >
            {tag}
          </Text>
        ))}
      </View>

      <Text style={[styles.sessionHeader, { color: theme.colors.text }]}>
        Sessions
      </Text>

      <FlatList
        data={studyPlan.sessions}
        renderItem={renderSession}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.sessionList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginVertical: 8,
  },
  infoContainer: {
    marginVertical: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  tag: {
    backgroundColor: "transparent",
    fontSize: 14,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  sessionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  sessionList: {
    paddingBottom: 16,
  },
  sessionContainer: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
});

export default StudyPlan;
