import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Stack  , Slot} from 'expo-router';
import LoginScreen from '../components/LoginScreen';
import { UserProvider } from '../context/UserContext';
import { LocationProvider } from '../context/LocationContext';
import * as SecureStore from 'expo-secure-store';

const  tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key)
    } catch (error) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (error) {
      return;
    }
  }

}


export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <LocationProvider>

  
      <UserProvider>
        <SignedIn>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(dashboard)" />
            <Slot/>
          </Stack>
        </SignedIn>
        <SignedOut>
          <LoginScreen />
        </SignedOut>
      </UserProvider>
      </LocationProvider>
    </ClerkProvider>
  );
}
