import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';

export default function PolicyPage() {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Privacy Policy</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.text}>
            Welcome to our application. This Privacy Policy outlines how we collect, use, and safeguard your personal information. 
            Our team, <Text style={styles.bold}>T-J-R</Text>, is committed to ensuring a secure and seamless experience for all users.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. Data Collection & Usage</Text>
          <Text style={styles.text}>
            Our app may collect location data to improve functionality and user experience. We do not share your data with third parties, 
            and all collected information is used solely to enhance app services.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>3. Security Measures</Text>
          <Text style={styles.text}>
            We implement industry-standard security protocols to protect your data. However, we encourage users to maintain strong passwords 
            and avoid sharing sensitive information over unsecured networks.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>4. User Rights & Data Control</Text>
          <Text style={styles.text}>
            You have full control over your personal data. Users can request data deletion or modifications at any time by reaching out 
            to our support team.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>5. Contact Information</Text>
          <Text style={styles.text}>
            For inquiries or concerns regarding privacy, please contact our <Text style={styles.bold}>T-J-R</Text> team members:
          </Text>
          <Text style={styles.teamList}>
            @ Harshith (Aka A) {"\n"}
            @ Arunodaya (Chitti) {"\n"}
            @ Varshith (VBro) {"\n"}
            @ Om Sai Chand (Python) {"\n"}
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
  bold: {
    fontWeight: 'bold',
    color: '#007AFF',
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
