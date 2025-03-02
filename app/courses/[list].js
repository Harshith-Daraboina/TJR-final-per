import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import CoursesList from '../../components/home/courselist';

export default function CoursesListScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a data fetch with a timeout (replace with actual API call if needed)
    const fetchData = async () => {
      // Simulate a delay for fetching courses
      setTimeout(() => {
        setLoading(false);
      }, 500); // Replace this with actual fetching logic
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Courses</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      ) : (
        <CoursesList />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F8F9FA',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

