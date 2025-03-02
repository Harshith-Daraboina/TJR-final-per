import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

export default function Course() {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    router.push('/courses/123'); // Navigate to actual course details
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={[styles.button, isPressed && styles.buttonPressed]} 
          onPress={handlePress}
        >
          <Text style={[styles.buttonText, isPressed && styles.buttonTextPressed]}>
            View All Courses
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1, 
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Fix for Android notch
  },
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff', // White background
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2, // Blue border
    borderColor: '#007BFF',
  },
  buttonText: {
    color: '#007BFF', // Blue text
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonPressed: {
    backgroundColor: '#007BFF', // Change background to blue
  },
  buttonTextPressed: {
    color: '#fff', // Change text to white
  },
});
