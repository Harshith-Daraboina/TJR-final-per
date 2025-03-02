import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  RefreshControl, 
  ActivityIndicator 
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../supabaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [joinedCourses, setJoinedCourses] = useState(new Set()); // Stores joined course IDs
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();

  // 🔹 Fetch available courses
  const fetchCourses = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase.from('courses').select('id,name,description,instructor');
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error.message);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // 🔹 Fetch courses the user has joined
  const fetchJoinedCourses = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('joined_courses')
        .select('id')
        .eq('student_email', user.primaryEmailAddress.emailAddress);

      if (error) throw error;

      // Store joined course IDs in a Set for quick lookup
      setJoinedCourses(new Set(data.map(course => course.id)));
    } catch (error) {
      console.error('Error fetching joined courses:', error.message);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchJoinedCourses();
  }, []);

  // 🔹 Refresh function
  const onRefresh = useCallback(() => {
    fetchCourses();
    fetchJoinedCourses();
  }, []);

  // 🔹 Join course function
  const handleJoinCourse = async (courseId) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to join a course.');
      return;
    }

    const userEmail = user.primaryEmailAddress.emailAddress;
    const userName = user.fullName;
    const sanitizedTableName = `course_${courseId.replace(/-/g, '_')}`;

    try {
      // ✅ Check if already joined
      if (joinedCourses.has(courseId)) {
        Alert.alert('Info', 'You have already joined this course.');
        return;
      }

      // ✅ Insert into course-specific table
      const { error: insertError } = await supabase.from(sanitizedTableName).insert([
        {
          student_name: userName,
          student_email: userEmail,
          joined_at: new Date(),
        }
      ]);

      if (insertError) throw insertError;

      // ✅ Insert into `joined_courses` table
      const { error: joinedError } = await supabase.from('joined_courses').insert([
        {
          student_email: userEmail,
          id: courseId,
        }
      ]);

      if (joinedError) throw joinedError;

      // ✅ Update joined courses list
      setJoinedCourses(new Set([...joinedCourses, courseId]));

      Alert.alert('Success', 'You have successfully joined the course!');
      fetchCourses();
    } catch (error) {
      console.error('Error joining course:', error.message);
      Alert.alert('Error', 'Failed to join course. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Courses</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />
      ) : courses.length === 0 ? (
        <Text style={styles.noCoursesText}>No courses available</Text>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.courseName}>{item.name}</Text>
              <Text style={styles.courseInstructor}>Instructor: {item.instructor}</Text>
              <Text style={styles.courseDescription}>{item.description}</Text>

              {joinedCourses.has(item.id) ? (
                <TouchableOpacity style={styles.alreadyJoinedButton} disabled>
                  <Text style={styles.alreadyJoinedText}>Already Joined</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.joinButton} onPress={() => handleJoinCourse(item.id)}>
                  <Text style={styles.buttonText}>Join Course</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={styles.detailsButton} 
                onPress={() => router.push(`/coursedetails/${item.id}`)} 
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
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
    padding: 15,
    backgroundColor: '#F8F9FA',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  loading: {
    marginTop: 20,
  },
  noCoursesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  courseInstructor: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  courseDescription: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  joinButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  alreadyJoinedButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  alreadyJoinedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detailsButton: {
    backgroundColor: '#28A745',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
