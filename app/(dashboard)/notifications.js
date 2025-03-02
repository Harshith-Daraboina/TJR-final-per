import { View, Text, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Notifications() {
  // Sample notifications (Class Started)
  const notifications = [
    { id: '1', message: 'Math Class has started! 📚', time: 'Now' },
    { id: '2', message: 'Physics Class starts in 5 minutes! ⏳', time: '5m ago' },
    { id: '3', message: 'Your English class is live now! 🎙️', time: '10m ago' },
    { id: '4', message: 'Chemistry class will begin soon! ⚗️', time: '15m ago' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Notification List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No new notifications 🎉</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#777',
    marginTop: 3,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
    marginTop: 20,
  },
});

