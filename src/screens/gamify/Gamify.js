import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { useSelector, useDispatch } from "react-redux";
import GamifyCard from "../../components/Gamify/GamifyCard";

const badges = [
  {
    id: 1,
    name: "Curious Novice",
    icon: "school",
    color: colors.green[400],
    description: "Taking first steps into the world of knowledge",
    requiredPoints: 0,
  },
  {
    id: 2,
    name: "Dedicated Scholar",
    icon: "book-open-page-variant",
    color: colors.darkKhaki,
    description: "Building strong study habits",
    requiredPoints: 100,
  },
  {
    id: 3,
    name: "Wisdom Seeker",
    icon: "brain",
    color: colors.purple,
    description: "Mastering the art of learning",
    requiredPoints: 200,
  },
  {
    id: 4,
    name: "Knowledge Champion",
    icon: "trophy",
    color: colors.yellow[600],
    description: "Consistently exceeding expectations",
    requiredPoints: 300,
  },
  {
    id: 5,
    name: "Grand Sage",
    icon: "crown",
    color: colors.burntOrange,
    description: "Achieved remarkable academic excellence",
    requiredPoints: 400,
  },
  {
    id: 6,
    name: "Enlightened Master",
    icon: "star-face",
    color: colors.pink,
    description: "Reached the pinnacle of scholarly achievement",
    requiredPoints: 500,
  },
];

const Gamify = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const points = useSelector((state) => state.points);

  useEffect(() => {
    // Calculate points based on completed tasks
    console.log(points)
  }, []);


  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text
        style={{
          fontSize: 24,
          fontFamily: "SFProRoundedSemibold",
          color: theme.colors.text,
          marginBottom: 8,
        }}
      >
        Study Progress
      </Text>
      <Text
        style={{
          fontSize: 18,
          fontFamily: "SFProRoundedMedium",
          color: theme.colors.placeholderText,
          marginBottom: 16,
        }}
      >
        {points} Total Points
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {badges.map((badge) => (
          <GamifyCard
            key={badge.id}
            badge={badge}
            isActive={points == badge.requiredPoints-100}
            isCompleted={points >= badge.requiredPoints}
            points={points}
            pointsRequired={badge.requiredPoints}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default Gamify;
