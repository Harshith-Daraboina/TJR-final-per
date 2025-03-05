import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../supabaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sheet from '../../components/coursesheet/sheet';
import Export from '../../components/coursesheet/export';
import { useUserIdentity } from '../../context/UserContext';
import { useUser } from '@clerk/clerk-expo';
import { LocationContext } from '../../context/LocationContext';
import { useContext } from 'react';
import { useRouter } from 'expo-router';
export default function CourseDetails() {
  const { id } = useLocalSearchParams(); 
  const [course, setCourse] = useState(null);
  const [completables, setCompletables] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userIdentity } = useUserIdentity();
  const [attendanceColumn, setAttendanceColumn] = useState(null); 
  const { user, isLoaded } = useUser(); // Ensure user data is loaded before using it
  const student_email = user?.email ? user.email.toLowerCase() : null; // Ensure lowercase email
  const router = useRouter();
  const tableName = `course_${id.replace(/-/g, '_')}`;
  
  const { isInside } = useContext(LocationContext);
  

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!id) return;
      try {
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        console.log(`Fetching data from table: ${tableName}`);
        
        const { data: completablesData, error: completablesError } = await supabase
          .from(tableName) 
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


  
  
  // <----------------------------------------------------------------------------------------------->

  const handleTakeAttendance = async () => {
    try {
      const currentDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/:/g, '_'); 
      const columnName = `attendance_${currentDate}`;

      console.log(`Attempting to alter table: ${tableName}, adding column: ${columnName}`);

      const { error } = await supabase.rpc('execute_sql', {
        query: `ALTER TABLE "${tableName}" ADD COLUMN IF NOT EXISTS "${columnName}" BOOLEAN DEFAULT FALSE;`
      });

      if (error) throw error;

      setAttendanceColumn(columnName);
      console.log('✅ Column added successfully:', columnName);
      alert('Attendance column added successfully!');
    } catch (error) {
      console.error('❌ Error taking attendance:', error.message);
    }
  };
  // .................................................................Markk Attendance.............................................//
  const handleMarkAttendance = async () => {
    const student_email = user?.primaryEmailAddress?.emailAddress;



    if (!isInside){
      alert("You are not inside the radius. Please check your location");
      return;
    }

    try {
      if (!student_email) {
        console.error("❌ Error: User email is undefined. Cannot mark attendance.");
        return;
      }
  
      console.log(`📌 Checking attendance columns for table: ${tableName}`);
  
      // 1️⃣ **Fetch attendance columns dynamically**
      const { data: columnsData, error: columnError } = await supabase.rpc('get_columns', {
        table_name: tableName
      });
  
      if (columnError) throw columnError;
      if (!columnsData || columnsData.length === 0) {
        console.error("❌ No columns found in table.");
        return;
      }
  
      // 2️⃣ **Extract and sort only 'attendance_' columns**
      const attendanceColumns = columnsData
        .map(col => col.column_name)
        .filter(name => name.startsWith('attendance_'))
        .sort((a, b) => {
          const getTimestamp = (colName) => {
            const timestampStr = colName.replace("attendance_", "").replace(/_/g, ":"); // Fix timestamp format
            return Date.parse(timestampStr) || 0;
          };
          return getTimestamp(a) - getTimestamp(b);
        });
  
      if (attendanceColumns.length === 0) {
        console.error("❌ No attendance columns found.");
        return;
      }
  
      // 3️⃣ **Get the latest attendance column**
      const lastAttendanceColumn = attendanceColumns[attendanceColumns.length - 1];
      if (!lastAttendanceColumn) {
        console.error("❌ No valid attendance column found.");
        return;
      }
  
      console.log(`✅ Marking attendance in column: ${lastAttendanceColumn}`);
      alert(`Marking attendance in column: ${lastAttendanceColumn}`);

      if(!lastAttendanceColumn-now()<10*60*1000){
        alert("Attendance can be marked only within 10 minutes of the class");
        return;
      }
  
      // 4️⃣ **Check if student exists**
      const { data: studentData, error: studentError } = await supabase
        .from(tableName)
        .select('student_email')
        .eq('student_email', student_email)
        .maybeSingle();
  
      if (studentError) throw studentError;
      if (!studentData) {
        console.warn("⚠️ No matching student record found. Attendance not updated.");
        return;
      }
  
      // 5️⃣ **Retry logic to handle Supabase schema cache issue**
      let updateAttempts = 3;
      while (updateAttempts > 0) {
        const { error: updateError } = await supabase
          .from(tableName)
          .update({ [lastAttendanceColumn]: true })
          .eq('student_email', student_email);
  
        if (!updateError) {
          console.log("✅ Attendance marked successfully!");
          break; // Exit loop if update is successful
        } 
  
        if (updateError.message.includes("schema cache")) {
          console.warn("⚠️ Column not found in schema cache. Retrying...");
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds before retrying
          updateAttempts--;
        } else {
          throw updateError; // Throw actual error if it's unrelated to schema cache
        }
      }
  
      // 6️⃣ **Confirm update by fetching latest attendance data**
      const { data: updatedData, error: fetchError } = await supabase
        .from(tableName)
        .select(lastAttendanceColumn)
        .eq('student_email', student_email)
        .maybeSingle();
  
      if (fetchError) throw fetchError;
  
      console.log("🔄 Updated attendance data:", updatedData);
    } catch (error) {
      
    }
  };
  
  

  if (loading || !isLoaded) {
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

            {userIdentity === 'student' ? (
              <>
              
              
              <TouchableOpacity style={styles.button} onPress={handleMarkAttendance}>
                <Text style={styles.buttonText}>Mark my attendance</Text>
              </TouchableOpacity>
                <Text style={styles.alertText}>Please check your location before marking attendance</Text>
            </>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleTakeAttendance}>
                <Text style={styles.buttonText}>Take attendance</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={styles.errorText}>Course not found.</Text>
        )}

        <Sheet course={tableName} />
        <Export course={tableName} />
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
  alertText:{
    color:'gray',
    fontSize:11,
    marginTop:5,
    marginBottom:10,
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
});
