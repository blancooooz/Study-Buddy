
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
  } from "react-native";
  import React, { useEffect } from "react";
  import { useTheme } from "@react-navigation/native";
  import { colors } from "../../theme/colors";
  import { useSelector, useDispatch } from "react-redux";
  import GamifyCard from "../../components/Gamify/GamifyCard";
  import { updatePoints } from "../../redux/actions";
  
  const badges = [
    {
      id: 1,
      name: "Curious Novice",
      icon: "school",
      color: colors.green[500],
      description: "Taking first steps into the world of knowledge",
      requiredPoints: 0,
    },
    {
      id: 2,
      name: "Dedicated Scholar",
      icon: "book-open-page-variant",
      color: colors.blue,
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
      color: colors.yellow,
      description: "Consistently exceeding expectations",
      requiredPoints: 300,
    },
    {
      id: 5,
      name: "Grand Sage",
      icon: "crown",
      color: colors.orange,
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
  
  const Gamify = () => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const points = useSelector((state) => state.gamify?.points || 0);
    const completedTasks = useSelector((state) => state.tasks?.filter(task => task.completed) || []);
  
    useEffect(() => {
      // Calculate points based on completed tasks
      const earnedPoints = completedTasks.length * 5;
      dispatch(updatePoints(earnedPoints));
    }, [completedTasks]);
  
    const getCurrentLevel = () => Math.floor(points / 100);
    const getCurrentProgress = () => points % 100;
  
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={styles.headerText}>Study Progress</Text>
        <Text style={styles.pointsText}>{points} Total Points</Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {badges.map((badge) => (
            <GamifyCard
              key={badge.id}
              badge={badge}
              isUnlocked={points >= badge.requiredPoints}
              points={getCurrentProgress()}
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
    headerText: {
      fontSize: 24,
      fontFamily: 'SFProRoundedSemibold',
      color: colors.gray[900],
      marginBottom: 8,
    },
    pointsText: {
      fontSize: 18,
      fontFamily: 'SFProRoundedMedium',
      color: colors.gray[600],
      marginBottom: 16,
    },
  });
  
  export default Gamify;
  