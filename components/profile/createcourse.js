import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

export default function CreateCourse() {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={styles.container}>
      {/* 🔹 Button to Navigate to Course Creation Page */}
      <TouchableOpacity
        style={[styles.createButton, isPressed && styles.buttonPressed]}
        onPress={() => router.push('/createcourse/123')}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
      >
        <Text style={[styles.buttonText, isPressed && styles.buttonTextPressed]}>
          Create Course
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  createButton: {
    backgroundColor: '#fff', // White background
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2, // Blue border
    borderColor: '#007BFF',
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#007BFF', // Change background to blue when pressed
  },
  buttonText: {
    color: '#007BFF', // Blue text
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextPressed: {
    color: '#fff', // Change text to white when pressed
  },
});
