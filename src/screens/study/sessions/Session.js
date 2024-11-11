import React, { useEffect } from "react";
import { View, Text, FlatList, Button, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";

const Session = ({ route, navigation }) => {
  const { studyPlanId, sessionId } = route.params;
  const theme = useTheme();

  // Access studyPlans from the state
  const studyPlans = useSelector((state) => state.studyPlans || []);
  const studyPlan = studyPlans.find((plan) => plan.id === studyPlanId);
  const session = studyPlan
    ? studyPlan.sessions.find((s) => s.id === sessionId)
    : null;

  useEffect(() => {
    if (session) {
      navigation.setOptions({ title: session.title });
    }
  }, [session, navigation]);

  if (!session) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: theme.colors.text }}>Session not found.</Text>
      </View>
    );
  }

  const renderAttachment = ({ item }) => (
    <TouchableOpacity
      onPress={() => console.log("Open attachment:", item)}
      style={{
        padding: 8,
        marginVertical: 4,
        backgroundColor: theme.colors.card,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: theme.colors.primary }}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}
    >
      <Text
        style={{ color: theme.colors.text, fontSize: 24, fontWeight: "bold" }}
      >
        {session.title}
      </Text>
      <Text style={{ color: theme.colors.text, marginVertical: 8 }}>
        {session.description}
      </Text>
      <Text style={{ color: theme.colors.text, fontSize: 16 }}>
        Notes: {session.notes || "No notes added"}
      </Text>

      <View style={{ marginVertical: 16 }}>
        <Text style={{ color: theme.colors.text, fontWeight: "bold" }}>
          Tags:
        </Text>
        {session.tags.map((tag) => (
          <Text key={tag} style={{ color: theme.colors.text, marginLeft: 8 }}>
            • {tag}
          </Text>
        ))}
      </View>

      <View style={{ marginVertical: 16 }}>
        <Text style={{ color: theme.colors.text, fontWeight: "bold" }}>
          Timer:
        </Text>
        <Text style={{ color: theme.colors.text }}>
          Duration: {session.timer.duration} mins
        </Text>
        <Text style={{ color: theme.colors.text }}>
          Intervals: {session.timer.intervalCount}
        </Text>
        <Text style={{ color: theme.colors.text }}>
          Completed: {session.timer.completedIntervals}
        </Text>
      </View>

      <View style={{ marginVertical: 16 }}>
        <Text style={{ color: theme.colors.text, fontWeight: "bold" }}>
          Attachments:
        </Text>
        {session.attachments.length > 0 ? (
          <FlatList
            data={session.attachments}
            renderItem={renderAttachment}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={{ color: theme.colors.text }}>
            No attachments added.
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.primary,
          height: 50,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 5,
          marginBottom: 24,
        }}
        onPress={() => console.log("Directs to timer")}
      >
        <Text
          style={{
            color: theme.colors.card,
            fontSize: 18,
            fontWeight: "600",
            alignSelf: "flex-start",
            marginLeft: 24,
          }}
        >
          Start this Session
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.card,
          height: 50,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 5,
        }}
        onPress={() => console.log("edit the session with completed as opposite")}
      >
        {!session.completed ? (
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: 18,
              fontWeight: "600",
              alignSelf: "flex-start",
              marginLeft: 24,
            }}
          >
            Mark as Complete
          </Text>
        ) : (
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: 18,
              fontWeight: "600",
              alignSelf: "flex-start",
              marginLeft: 24,
            }}
          >
            Mark as Incomplete
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Session;
