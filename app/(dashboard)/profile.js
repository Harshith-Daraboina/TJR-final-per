import { 
  View, Text, Image, TouchableOpacity, Alert, 
  StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView 
} from 'react-native';
import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Course from '../../components/profile/course';
import Createcourse from '../../components/profile/createcourse';
import Info from '../../components/profile/info';
import { useUserIdentity } from '../../context/UserContext';

export default function Profile() {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { userIdentity } = useUserIdentity();

  if (!isLoaded) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: async () => {
            await signOut();
            router.replace('/');
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          
          {/* Profile Card */}
          <View style={styles.card}>
            <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
            <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
              {user?.fullName?.length > 20 ? user?.fullName.slice(0, 20) + "..." : user?.fullName}
            </Text>
            <Text style={styles.userEmail}>{user?.primaryEmailAddress?.emailAddress}</Text>
          </View>

          {/* Courses Component */}
          <View style={styles.courseContainer}>
            {userIdentity === 'professor' ? <Createcourse /> : <Course />}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
             <Info/>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

        </View>

        {/* Footer stays at the bottom */}
        <View style={styles.footerContainer}>
          <Text style={styles.footer} adjustsFontSizeToFit numberOfLines={1}>
            © 2025 Copyrights by T-J-R
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Fix for Android notch
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between', // Pushes footer down
    alignItems: 'center',
    minHeight: '100%', // Ensures full height
  },
  container: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    flex: 1, // Allows footer to stay at bottom
  },
  loading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  courseContainer: {
    width: '100%',
    minHeight: 150,  // Adjusted for better display
    marginTop: 15,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    maxWidth: 350,
  },
  actionButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff4757',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 15, // Ensures it’s visible properly
    paddingHorizontal: 20,
    minWidth: '100%',
  },
  footer: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
