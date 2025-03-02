import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../supabaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sheet from '../../components/coursesheet/sheet'; // Import Sheet component
import Export from '../../components/coursesheet/export'; // Import Sheet component
import { useUserIdentity } from '../../context/UserContext';

export default function CourseDetails() {
  const { id } = useLocalSearchParams(); // Course ID
  const [course, setCourse] = useState(null);
  const [completables, setCompletables] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userIdentity } = useUserIdentity();
  const [attendanceColumn, setAttendanceColumn] = useState(null); // Store the created column name for attendance

  const parmeters = `course_${id.replace(/-/g, '_')}`;


  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!id) return;
      try {
        // Fetch Course Details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // Generate the dynamic table name and log it
        const tableName = `course_${id.replace(/-/g, '_')}`;
        console.log(`Attempting to fetch data from table: ${tableName}`);
        
        // Fetch Completables for the Course
        const { data: completablesData, error: completablesError } = await supabase
          .from(tableName) // Dynamic table
          .select('*');

        if (completablesError) throw completablesError;
        setCompletables(completablesData);

      } catch (err) {
        console.error('Error fetching data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleTakeAttendance = async () => {
    try {
      // Generate a safe column name using current date and time
      const currentDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/:/g, '_'); // Safe date format
      const columnName = `attendance_${currentDate}`; // Column name format

      // Generate the dynamic table name
      const tableName = `course_${id.replace(/-/g, '_')}`;
      console.log(`Attempting to alter table: ${tableName} and add column: ${columnName}`);

      // Call the Supabase function to alter the table by adding the new column
      const { error } = await supabase.rpc('execute_sql', {
        query: `
          ALTER TABLE "${tableName}"
          ADD COLUMN IF NOT EXISTS "${columnName}" BOOLEAN DEFAULT FALSE;
        `
      });

      if (error) throw error;

      // Store the column name to update attendance later
      setAttendanceColumn(columnName);

      console.log('Column added successfully:', columnName);
    } catch (error) {
      console.error('Error taking attendance:', error.message);
    }
  };

  const handleMarkAttendance = async () => {
    if (!attendanceColumn) return;

    try {
      // Mark attendance for the student by updating the row with 1 in the column for today's date
      const { error } = await supabase
        .from(`course_${id.replace(/-/g, '_')}`)
        .update({ [`"${attendanceColumn}"`]: 1 })  // Mark as present
        .eq('student_id', userIdentity.id);

      if (error) throw error;

      console.log('Attendance marked successfully!');
    } catch (error) {
      console.error('Error marking attendance:', error.message);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading course details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {course ? (
          <View style={styles.card}>
            <Text style={styles.title}>{course.name}</Text>
            <Text style={styles.instructor}>Instructor: {course.instructor || 'Unknown Instructor'}</Text>
            <Text style={styles.description}>{course.description}</Text>

            {/* 🔹 Enroll / Join Course Button */}
            {userIdentity === 'student' ? (
              <TouchableOpacity style={styles.button} onPress={handleMarkAttendance}>
                <Text style={styles.buttonText}>Mark my attendance</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleTakeAttendance}>
                <Text style={styles.buttonText}>Take attendance</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={styles.errorText}>Course not found.</Text>
        )}

        {/* 🔹 Display Students Table by passing completables */}
        <Sheet course={parmeters} />
        <Export course={parmeters} />

      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  instructor: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
});
