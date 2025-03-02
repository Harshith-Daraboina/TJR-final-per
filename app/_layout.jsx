import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Stack  , Slot} from 'expo-router';
import LoginScreen from '../components/LoginScreen';
import { UserProvider } from '../context/UserContext';


export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
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
    </ClerkProvider>
  );
}
