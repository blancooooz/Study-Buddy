import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../theme/colors";

const GamifyCard = ({
  badge,
  isActive,
  isCompleted,
  points,
  pointsRequired,
}) => {
  const isUnlocked = isActive || isCompleted;
  return (
    <View style={[styles.card, { opacity: isUnlocked ? 1 : 0.6 }]}>
      <View style={styles.iconContainer}>
        <Icon
          name={badge.icon}
          size={24}
          color={isUnlocked ? badge.color : colors.gray[400]}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{badge.name}</Text>
        <Text style={styles.description}>{badge.description}</Text>
        {isCompleted && (
          <View style={styles.pointsContainer}>
            <Text style={styles.points}>
            Complete!
            </Text>
          </View>)}
        {isActive && (
          <View style={styles.pointsContainer}>
            <Text style={styles.points}>
              {points} / {pointsRequired} points
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: "SFProRoundedSemibold",
    color: colors.gray[900],
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 8,
  },
  pointsContainer: {
    backgroundColor: colors.skyBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  points: {
    fontSize: 12,
    color: colors.blue,
    fontFamily: "SFProRoundedMedium",
  },
});

export default GamifyCard;
