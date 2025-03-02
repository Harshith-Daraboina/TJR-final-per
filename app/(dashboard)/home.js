import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserIdentity } from '../../context/UserContext';
import { useRouter } from 'expo-router';
import Dashboard from '../../components/home/Dashboard';
import JoinedCourses from '../../components/home/joinedcourses';
import CreatedCourses from '../../components/home/createdcourses';

export default function Home() {
  const { userIdentity } = useUserIdentity();
  const { user, isLoaded } = useUser();
  const insets = useSafeAreaInsets();

  if (!isLoaded) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  const data = [{ id: 'header' }, { id: 'content' }, { id: 'footer' }];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.id === 'header') {
            return (
              <View style={styles.header}>
                <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
                <View style={styles.nameContainer}>
                  <Text style={styles.greeting}>Hello,</Text>
                  <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                    {user?.firstName} 👋
                  </Text>
                </View>
              </View>
            );
          }

          if (item.id === 'content') {
            return (
              <View style={styles.body}>
                <Text style={styles.welcomeText}>Welcome back!</Text>
                <Text style={styles.welcomeText}>User Identity: {userIdentity}</Text>

                {userIdentity === 'professor' ? (
                  <>
                  <Text style={styles.roleText}>Role: Professor</Text>
                  <CreatedCourses />
                  </>
                ) : (
                  <>
                    <Text style={styles.roleText}>Role: Student</Text>
                    <Dashboard />
                    <JoinedCourses />
                  </>
                )}
              </View>
            );
          }

          if (item.id === 'footer') {
            return (
              <View style={styles.footer}>
                <Text style={styles.footerText}>© 2025 T-J-R</Text>
              </View>
            );
          }

          return null;
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    maxWidth: '100%',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  nameContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  },
  body: {
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  roleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  footer: {
    marginTop: 20,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#777',
  },
});
