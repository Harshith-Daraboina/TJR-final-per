import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '../../supabaseConfig'; // Import Supabase client
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function CreatedCourses() {
  const { user } = useUser(); // Get logged-in user
  const router = useRouter();
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [firstTimeRefresh, setFirstTimeRefresh] = useState(true); // Track first-time refresh

  useEffect(() => {
    if (user) {
      fetchUserCourses();
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRefresh) {
        fetchUserCourses();  // Auto-refresh only once
        setFirstTimeRefresh(false); // Prevent repeated refresh
      }
    }, [firstTimeRefresh])
  );

  // 🔹 Fetch courses where instructor_id matches user.id
  const fetchUserCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user?.id); // ✅ Fixed column name

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🔹 Refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserCourses();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Created Courses</Text>

      {courses.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noCourses}>No courses created yet.</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchUserCourses}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={item => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          renderItem={({ item }) => (
            <View style={styles.courseItem}>
              <View style={styles.courseInfo}>
                <Text style={styles.courseName}>{item.name}</Text>
                <Text style={styles.courseDescription}>{item.description}</Text>
              </View>
              <TouchableOpacity 
                style={styles.detailsButton} 
                onPress={() => router.push(`/coursedetails/${item.id}`)}
              >
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

// 🔹 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCourses: {
    fontSize: 18,
    color: '#777',
  },
  refreshButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  refreshText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  courseItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  courseDescription: {
    fontSize: 14,
    color: '#777',
  },
  detailsButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    flexShrink: 1,
    textAlign: 'center',
  },
});
