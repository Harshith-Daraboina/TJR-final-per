import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserIdentity } from '../../context/UserContext';

export default function Home() {
  const { userIdentity } = useUserIdentity();
  const { user, isLoaded } = useUser();
  const insets = useSafeAreaInsets();

  // Mock attendance percentage (Change this to test)
  const attendancePercentage = 85; // Example: 72%

  // Determine Card Color & Suggestion based on Attendance
  let cardColor = '#4CAF50'; // Green
  let suggestion = "Great job! Keep up the good attendance! ";

  if (attendancePercentage < 75 && attendancePercentage >= 50) {
    cardColor = '#FFC107'; // Yellow
    suggestion = "You're doing okay, but try to attend more! ";
  } else if (attendancePercentage < 50) {
    cardColor = '#FF5733'; // Red
    suggestion = "Low attendance! You need to improve. ";
  }

  if (!isLoaded) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Attendance Card */}
      <View style={[styles.attendanceCard, { backgroundColor: cardColor }]}>
        <Text style={styles.attendanceText}>Attendance Percentage</Text>
        <Text style={styles.percentage}>{attendancePercentage}%</Text>
        <Text style={styles.suggestion}>{suggestion}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: '#333',
  },
  attendanceCard: {
    width: '100%',
    maxWidth: 350,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  attendanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  percentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  suggestion: {
    fontSize: 14,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
});
