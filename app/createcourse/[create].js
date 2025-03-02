import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  ScrollView, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Platform, 
  Modal, 
  ActivityIndicator 
} from 'react-native';
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { supabase } from '../../supabaseConfig'; // Import Supabase client

export default function CreateCourse() {
  const { user } = useUser();
  const router = useRouter();

  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Handle Course Creation
  const handleCreateCourse = () => {
    if (!courseName.trim() || !courseDescription.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setModalVisible(true); // Show confirmation modal
  };

  // ✅ Confirm and Create Course
  const confirmCreateCourse = async () => {
    setLoading(true);
    try {
      // ✅ Step 1: Insert Course into 'courses' Table
      const { data, error } = await supabase
        .from('courses')
        .insert([{
          name: courseName,
          description: courseDescription,
          instructor: user?.fullName || 'Unknown Instructor',
          instructor_id: user?.id,
          created_at: new Date(),
        }])
        .select();

      if (error) throw error;
      
      const courseId = data[0]?.id; // Get created course ID

      // ✅ Step 2: Generate a unique table name
      const sanitizedTableName = `course_${courseId.replace(/-/g, '_')}`; // Safe table name

      // ✅ Step 3: Call Supabase function to create the table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${sanitizedTableName} (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          student_name TEXT NOT NULL,
          student_email TEXT NOT NULL,
          joined_at TIMESTAMP DEFAULT now()
        );
      `;
    
      const { error: tableError } = await supabase.rpc('execute_sql', { query: createTableQuery });
      if (tableError) throw tableError;

      Alert.alert('Success', `Course "${courseName}" created successfully!`);

      // ✅ Reset State
      setCourseName('');
      setCourseDescription('');
      setModalVisible(false);
      router.push('/'); // Navigate to course list or home page
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create course. Please try again.');
      console.error('Error adding course:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Create Course</Text>

          <TextInput
            style={styles.input}
            placeholder="Course Name"
            value={courseName}
            onChangeText={setCourseName}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Course Description"
            multiline
            numberOfLines={4}
            value={courseDescription}
            onChangeText={setCourseDescription}
          />

          <TouchableOpacity 
            style={[styles.createButton, loading && styles.disabledButton]} 
            onPress={handleCreateCourse} 
            disabled={loading}
          >
            <Text style={styles.createButtonText}>{loading ? 'Creating...' : 'Create Course'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Confirmation Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Course Creation</Text>
              <Text style={styles.modalText}>Are you sure you want to create "{courseName}"?</Text>

              {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
              ) : (
                <>
                  <TouchableOpacity style={styles.modalButton} onPress={confirmCreateCourse}>
                    <Text style={styles.modalButtonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]} 
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// 🔹 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContainer: { padding: 20, alignItems: 'center', justifyContent: 'center', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  createButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#A0A0A0' },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalContainer: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 10, 
    width: '80%', 
    alignItems: 'center' 
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  modalButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: { backgroundColor: '#dc3545' },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
