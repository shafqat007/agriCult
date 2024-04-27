import React, { useEffect, useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { StyleSheet, View, Button, Text, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const calculateDistance = (start, end) => {
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const { latitude: lat1, longitude: lon1 } = start;
  const { latitude: lat2, longitude: lon2 } = end;

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  return distance.toFixed(2); // Distance rounded to 2 decimal places in kilometers
};

export default function App() {
  const [markers, setMarkers] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);
  const [defaultRegion, setDefaultRegion] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loaded] = useFonts({
    Arial: require('../assets/fonts/Jersey15-Regular.ttf'), // Adjust the path according to your font file
  });
  const navigation = useNavigation();

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setIsLocationFetched(true);
    if (!mapRegion) {
      const initialRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setMapRegion(initialRegion);
      setDefaultRegion(initialRegion); // Store the default region
    }
  };

  useEffect(() => {
    userLocation();
  }, []);

  if (!loaded) {
    return null; // Return null while the font is loading to prevent rendering without the font
  }

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    const newMarker = {
      id: markers.length + 1,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      title: `Marker ${markers.length + 1}`,
    };
    setMarkers([...markers, newMarker]);
    if (currentLocation) {
      setRouteCoordinates([...routeCoordinates, currentLocation, coordinate]);
    }
  };

  const handleReset = () => {
    setMarkers([]);
    setRouteCoordinates([]);
  };

  const handleGoBack = () => {
    if (defaultRegion) {
      setMapRegion(defaultRegion); // Set map region to the default region
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegion} onPress={handleMapPress}>
        {markers.map((marker, index) => (
          <Marker key={marker.id} coordinate={{ latitude: marker.latitude, longitude: marker.longitude }} title={marker.title} pinColor="blue" />
        ))}
        {isLocationFetched && (
          <Marker coordinate={currentLocation} title="Current Location" pinColor="red" />
        )}
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={2}
          strokeColor="blue"
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Reset" onPress={handleReset} />
        <Button title="Go Back" onPress={handleGoBack} />
      </View>
      {isLocationFetched && (
        <ScrollView style={styles.markerInfoContainer}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>GPS Location: {currentLocation ? `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}` : 'Loading...'}</Text>
            {markers.map(marker => (
              <Text key={marker.id} style={styles.locationText}>
                {marker.title}: {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}
                {currentLocation && (
                  <Text> Distance: {calculateDistance(currentLocation, marker)} km</Text>
                )}
              </Text>
            ))}
          </View>
        </ScrollView>
      )}
      <View style={styles.arrowButtonContainer}>
        <Ionicons
          name="arrow-forward"
          size={24}
          color="black"
          onPress={() => navigation.navigate('Credit')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 0.7, // Adjusted to take up 70% of the screen's height
    height: '50%',
    width: '100%',
  },
  markerInfoContainer: {
    maxHeight: '40%',
  },
  locationInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Arial',
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Arial',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  arrowButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});
