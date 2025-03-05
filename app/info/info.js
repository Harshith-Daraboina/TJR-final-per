import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';

export default function TeamTalks() {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Team Talks</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Welcome to Team Talks</Text>
          <Text style={styles.text}>
            This is a dedicated space for discussions, brainstorming, and collaboration among T-J-R team members. 
            Share ideas, updates, and insights to enhance our projects.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Discussion Topics</Text>
          <Text style={styles.text}>
            * Project Updates {"\n"}
            * New Ideas & Features {"\n"}
            * Technical Challenges & Solutions {"\n"}
            * Announcements & Important News
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Guidelines for Effective Discussions</Text>
          <Text style={styles.text}>
            ✅ Stay on topic and be clear in your messages. {"\n"}
            ✅ Respect all team members and their ideas. {"\n"}
            ✅ Use constructive criticism and provide solutions. {"\n"}
            ✅ Keep discussions professional and productive.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Meet the Team</Text>
          <Text style={styles.teamList}>
            * Harshith (Aka A) {"\n"}
            * Arunodaya (Chitti) {"\n"}
            * Varshith (VBro) {"\n"}
            * Om Sai Chand (Python) {"\n"}
          </Text>
        </View>

        <Text style={styles.footer}>© 2024 T-J-R Team. All rights reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#222',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  teamList: {
    fontSize: 16,
    color: '#444',
    fontWeight: 'bold',
    marginTop: 8,
    lineHeight: 22,
  },
  footer: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontWeight: 'bold',
  },
});
