import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';

export default function LiveLocationTracker() {
  const [userLocation, setUserLocation] = useState(null);
  const [isInsideRoom, setIsInsideRoom] = useState(null);

  // Room Coordinates (Rectangle) & Altitude Range
  const roomCoords = [
    { latitude: 15.4007844, longitude: 75.0258996 }, // Bottom-left
    { latitude: 15.4002653, longitude: 75.0158310  }, // Bottom-right
    { latitude: 15.3897100, longitude: 75.0167238 }, // Top-right
    { latitude: 15.3856518, longitude: 75.0246933 }, // Top-left
  ];

  const minAltitude = 500;  // Ground level
  const maxAltitude = 750; // Maximum height of the room in meters

  // Function to check if the user is inside the room including altitude check
  const isUserInRoom = (userLocation, roomCoords) => {
    if (!userLocation) return false;

    const latitudes = roomCoords.map(coord => coord.latitude);
    const longitudes = roomCoords.map(coord => coord.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    return (
      userLocation.latitude >= minLat &&
      userLocation.latitude <= maxLat &&
      userLocation.longitude >= minLng &&
      userLocation.longitude <= maxLng &&
      userLocation.altitude >= minAltitude &&
      userLocation.altitude <= maxAltitude
    );
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission Denied');
        return;
      }

      // Start tracking location with a 2-second update interval
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,  // Update every 2 seconds
          distanceInterval: 0.5, // Update on small movements
        },
        (location) => {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude || 0, // Use 0 if altitude is unavailable
          };

          setUserLocation(newLocation);

          const insideRoom = isUserInRoom(newLocation, roomCoords);
          setIsInsideRoom(insideRoom);
        }
      );

      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          Live Location Tracker
        </Text>
        {userLocation ? (
          <>
            <Text style={styles.text} numberOfLines={1} >
              Latitude: {userLocation.latitude.toFixed(6)}
            </Text>
            <Text style={styles.text} numberOfLines={1} >
              Longitude: {userLocation.longitude.toFixed(6)}
            </Text>
            <Text style={styles.text} numberOfLines={1} >
              Altitude: {userLocation.altitude.toFixed(2)} m
            </Text>
            <Text
              style={[styles.statusText, { color: isInsideRoom ? 'green' : 'red' }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {isInsideRoom ? '✅ Inside Room' : '❌ Outside Room'}
            </Text>
          </>
        ) : (
          <Text style={styles.loadingText} numberOfLines={1} adjustsFontSizeToFit>
            Getting location...
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    textAlign: 'left',
   
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  statusText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  loadingText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
});
