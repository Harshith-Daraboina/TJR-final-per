import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useOAuth } from '@clerk/clerk-expo';
import { useUserIdentity } from '../context/UserContext'; // Import global state
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { setUserIdentity } = useUserIdentity(); // Access the global state
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Prevent multiple logins

  const handleLogin = async (role) => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);

    try {
      setUserIdentity(role); // Save user role globally

      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/home', { scheme: 'myapp' }), // Redirects after login
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace('/home'); // Navigate to the home page
      }
    } catch (err) {
      console.error('OAuth Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with Google</Text>

      <TouchableOpacity 
        style={[styles.button, loading && styles.disabledButton]} 
        onPress={() => handleLogin('student')}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login as Student'}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.professorButton, loading && styles.disabledButton]} 
        onPress={() => handleLogin('professor')}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login as Professor'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  professorButton: {
    backgroundColor: '#28a745',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
