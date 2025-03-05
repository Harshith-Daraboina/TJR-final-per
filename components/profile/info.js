import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // For Expo Router (if used)

export default function Info() {
  const router = useRouter(); // Use router for navigation

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => router.push('/checkLoaction/checkLoc')}
      >
        <Text style={styles.buttonText}>Check Location</Text>
        <Feather name="chevron-right" size={20} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => router.push('/teamtalk/info2')}
      >
        <Text style={styles.buttonText}>App Policies</Text>
        <Feather name="chevron-right" size={20} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton}  
        onPress={() => router.push('/info/info')}
      >
        <Text style={styles.buttonText}>Team Talks!</Text>
        <Feather name="chevron-right" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
});
