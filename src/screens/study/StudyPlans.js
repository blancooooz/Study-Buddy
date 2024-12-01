import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSelector, connect } from "react-redux";
import { addStudyPlan, addSession } from "../../redux/actions";
import { Circle } from "react-native-progress";
import * as Icons from "react-native-vector-icons";

const width = Dimensions.get("screen").width;

const StudyPlan = ({ navigation }) => {
  const theme = useTheme();
  const studyPlans = useSelector((state) => state.studyPlans || []);
  console.log(studyPlans);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (studyPlanId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [studyPlanId]: !prevExpanded[studyPlanId],
    }));
  };

  const renderStudyPlan = ({ item }) => {
    const sessionsCompleted = item.sessions.filter(
      (session) => session.completed
    ).length;
    const totalSessions = item.sessions.length;
    const progress = totalSessions > 0 ? sessionsCompleted / totalSessions : 0;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Study Plan", { id: item.id })}
        style={{
          padding: 16,
          marginVertical: 8,
          backgroundColor: theme.colors.card,
          borderRadius: 8,
          alignSelf: "center",
          width: width * 0.95,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 2 }}>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {item.subject.name}: {item.title}
            </Text>

            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text style={{ color: theme.colors.primary }}>
                {expanded[item.id] ? "Show Less" : "Sessions"}
              </Text>
            </TouchableOpacity>

            {expanded[item.id] && (
              <View style={{ marginTop: 8 }}>
                {item.sessions.map((session) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Session", {
                        studyPlanId:item.id,
                        sessionId: session.id,
                      })
                    }
                    style={{
                      backgroundColor: theme.colors.secondary,
                      width: width / 3,
                      height: width / 10,
                      borderRadius: 6,
                      marginBottom: 4,
                    }}
                    key={session.id}
                  >
                    <Text style={{ color: theme.colors.text, marginLeft: 8 }}>
                      {session.title}
                    </Text>
                    {session.completed ? (
                      <Text style={{ color: theme.colors.text, marginLeft: 8 }}>
                        Completed
                      </Text>
                    ) : (
                      <Text style={{ color: theme.colors.text, marginLeft: 8 }}>
                        Not Complete
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={{ marginTop: 16 }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Add a Session", { planId: item.id })
              }
              style={{
                height: 70,
                width: 70,
                borderRadius: 52,
                borderWidth: 2,
                justifyContent: "center",
                alignItems: "center",
                borderColor: theme.colors.primary,
                backgroundColor: theme.colors.card,
                marginBottom: 12,
              }}
            >
              <Text style={{ color: theme.colors.primary }}>
                Start a Session
              </Text>
            </TouchableOpacity>
            <Circle
              size={70}
              progress={progress}
              showsText={true}
              formatText={() => `${Math.round(progress * 100)}%`}
              color={theme.colors.primary}
              unfilledColor={theme.colors.secondary}
              borderWidth={0}
              textStyle={{
                fontFamily: "SFProRoundedMedium",
                fontSize: 16,
                color: theme.colors.text,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const activePlans = studyPlans.filter((plan) => !plan.completed);
  const completedPlans = studyPlans.filter((plan) => plan.completed);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      {studyPlans.length === 0 ? (
        <>
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 18,
              alignSelf: "flex-start",
              margin: 12,
              fontWeight: "500",
            }}
          >
            Add your first study plan
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Add a Plan")}>
            <View
              style={{
                width: width * 0.95,
                borderColor: theme.colors.secondary,
                borderWidth: 2,
                height: width * 0.45,
                borderRadius: 16,
                borderStyle: "dashed",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icons.Feather name="plus" size={24} color={"#FAFAFA"} />
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <FlatList
          data={activePlans}
          renderItem={renderStudyPlan}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 16 }}
          ListHeaderComponent={() => (
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 18,
                fontWeight: "bold",
                marginTop: 10,
              }}
            >
              Active
            </Text>
          )}
          ListFooterComponent={() => (
            <>
              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 18,
                  fontWeight: "bold",
                  marginTop: 20,
                }}
              >
                Completed
              </Text>
              <FlatList
                data={completedPlans}
                renderItem={renderStudyPlan}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 16 }}
              />
            </>
          )}
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
