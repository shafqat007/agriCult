import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Button, Text, ScrollView } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [markers, setMarkers] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const [goBackEnabled, setGoBackEnabled] = useState(false);

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
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  useEffect(() => {
    userLocation();
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarkers([...markers, { id: markers.length + 1, latitude: coordinate.latitude, longitude: coordinate.longitude, title: `Marker ${markers.length + 1}` }]);
    setGoBackEnabled(true);
  };

  const handleReset = () => {
    setMarkers([]);
    setGoBackEnabled(false);
  };

  const handleGoBack = () => {
    setMapRegion(null); // Reset map region to initial state
    setGoBackEnabled(false);
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
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Reset" onPress={handleReset} />
        {goBackEnabled && <Button title="Go Back" onPress={handleGoBack} />}
      </View>
      {isLocationFetched && (
        <ScrollView style={styles.markerInfoContainer}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>GPS Location: {currentLocation ? `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}` : 'Loading...'}</Text>
            {markers.map(marker => (
              <Text key={marker.id} style={styles.locationText}>{marker.title}: {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}</Text>
            ))}
          </View>
        </ScrollView>
      )}
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
});
