import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function _layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarActiveTintColor: '#007bff', // Active tab color
        tabBarInactiveTintColor: '#777', // Inactive tab color
        headerShown: false, // Hide header for a cleaner UI
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
          tabBarBadge: 4, // Example badge for unread notifications
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingBottom: 5,
    height: 60,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
