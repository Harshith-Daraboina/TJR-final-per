import { View, Text } from 'react-native'
import React from 'react'

const centerPoint = {
  latitude: 15.39285,
  longitude: 75.025185,
};

const radiusMeters = 20; // 20m radius

// Function to calculate distance between two coordinates (Haversine formula)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Radius of Earth in meters
  const toRad = (angle) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

export default function CheckLocation() {
  return (
    <View>
      <Text>CheckLocation</Text>
    </View>
  )
}