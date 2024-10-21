import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>This is Calendar</Text>

      {/* React Native Calendars Component */}
      <RNCalendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: 'blue',
          },
        }}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
        }}
        enableSwipeMonths={true}
      /> 

      {/* Display Selected Date */}
      {selectedDate ? (
        <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text>
      ) : null}

      {/* Optional Button for future interaction */}
      <Button
        title="Show Today's Date"
        onPress={() => setSelectedDate(new Date().toISOString().split('T')[0])}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  selectedDateText: {
    fontSize: 18,
    color: 'blue',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default Calendar;