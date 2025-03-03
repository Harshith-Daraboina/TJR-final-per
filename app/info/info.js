import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function Info() {
  const [locationHistory, setLocationHistory] = useState([]); // Stores all locations
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let locationSubscription;

    const startLocationTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      setLoading(false);

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation, // Highest possible accuracy
          timeInterval: 500, // 500ms buffer for updates
          distanceInterval: 0.1, // Update on small movements (10 cm)
        },
        (newLocation) => {
          setLocationHistory((prevHistory) => [
            ...prevHistory, 
            {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              accuracy: newLocation.coords.accuracy, // Store accuracy
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      );
    };

    startLocationTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Location Tracker</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <ScrollView style={styles.listContainer}>
          {locationHistory.length === 0 ? (
            <Text style={styles.noDataText}>Waiting for location updates...</Text>
          ) : (
            locationHistory.map((location, index) => (
              <View key={index} style={styles.locationItem}>
                <Text style={styles.text}>
                  {index + 1}. Lat: {location.latitude}, Lng: {location.longitude}
                </Text>
                <Text style={styles.text}>🎯 Accuracy: ±{location.accuracy} meters</Text>
                <Text style={styles.timestamp}>⏱ {location.timestamp}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    width: '100%',
    maxHeight: 400,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  locationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 14,
    color: '#777',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
});
