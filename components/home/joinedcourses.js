import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl, 
  ActivityIndicator 
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '../../supabaseConfig'; 
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function JoinedCourses() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchJoinedCourses();
      }
    }, [user])
  );

  // ✅ Optimized function to fetch joined courses
  const fetchJoinedCourses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userEmail = user.primaryEmailAddress?.emailAddress;

      // 🔹 Step 1: Get the list of course IDs the user has joined
      const { data: joinedCourses, error: joinedError } = await supabase
        .from('joined_courses')
        .select('id')
        .eq('student_email', userEmail);

      if (joinedError) throw joinedError;
      if (!joinedCourses || joinedCourses.length === 0) {
        setCourses([]); // No courses joined
        return;
      }

      const joinedCourseIds = joinedCourses.map((entry) => entry.id);

      // 🔹 Step 2: Fetch details of these courses from the `courses` table
      const { data: courseDetails, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .in('id', joinedCourseIds); // Fetch only the joined courses

      if (coursesError) throw coursesError;

      setCourses(courseDetails || []);
    } catch (error) {
      console.error('Error fetching joined courses:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🔄 Refresh function
  const onRefresh = useCallback(() => {
    if (!refreshing) { 
      setRefreshing(true);
      fetchJoinedCourses();
    }
  }, [refreshing]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Joined Courses</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />
      ) : courses.length === 0 ? (
        <Text style={styles.noCourses}>You haven't joined any courses yet.</Text>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View style={styles.courseItem}>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{item.name}</Text>
                <Text 
                  style={styles.instructorName} 
                  numberOfLines={1} 
                  ellipsizeMode="tail"
                >
                  {item.instructor || 'Unknown Instructor'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  loading: {
    marginTop: 20,
  },
  noCourses: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  courseItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructorName: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

