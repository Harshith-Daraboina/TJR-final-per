import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import * as Location from 'expo-location';
import { LocationContext } from '../../context/LocationContext';

const centerPoint = {
  latitude: 15.39285,
  longitude: 75.025185,
};

const radiusMeters = 20; // 20m radius

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Radius of Earth in meters
  const toRad = (angle) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

export default function CheckLocation() {
  const { isInside, setIsInside } = useContext(LocationContext);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to check proximity.');
        return;
      }
    })();
  }, []);

  const checkProximity = async () => {
    let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

    const distanceFromCenter = getDistance(
      centerPoint.latitude,
      centerPoint.longitude,
      currentLocation.coords.latitude,
      currentLocation.coords.longitude
    );

    setDistance(distanceFromCenter);
    setIsInside(distanceFromCenter <= radiusMeters);

    Alert.alert(
      distanceFromCenter <= radiusMeters ? 'Inside' : 'Outside',
      `You are ${distanceFromCenter <= radiusMeters ? 'inside' : 'outside'} the boundary! Distance: ${distanceFromCenter.toFixed(2)} meters.`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Check Location</Text>
      <TouchableOpacity style={styles.button} onPress={checkProximity}>
        <Text style={styles.buttonText}>Check Proximity</Text>
      </TouchableOpacity>
      {distance !== null && (
        <Text style={styles.distanceText}>Distance: {distance.toFixed(2)} meters</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  distanceText: {
    marginTop: 20,
    fontSize: 16,
    color: 'blue',
  },
});
