import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import React, { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useOAuth } from '@clerk/clerk-expo';
import { useUserIdentity } from '../context/UserContext'; 
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { setUserIdentity } = useUserIdentity();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (role) => {
    if (loading) return;
    setLoading(true);

    try {
      setUserIdentity(role);

      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/home', { scheme: 'myapp' }),
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace('/home');
      }
    } catch (err) {
      console.error('OAuth Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/images/logo1.jpg')} style={styles.logo} />

      {/* Title Section */}
      <Text style={styles.title}>Geo Attend</Text>
      <Text style={styles.subtitle}>A Secure Attendance System</Text>

      {/* Login Buttons */}
      <TouchableOpacity 
        style={[styles.button, loading && styles.disabledButton]} 
        onPress={() => handleLogin('student')}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login as Student</Text>}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.professorButton, loading && styles.disabledButton]} 
        onPress={() => handleLogin('professor')}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login as Professor</Text>}
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>©2025 T-J-R | All Rights Reserved</Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7fc',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    width: '85%',
    height: 48,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  professorButton: {
    backgroundColor: '#28a745',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  footer: {
    marginTop: 40,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
});
