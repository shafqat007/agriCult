import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Line, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

// Assuming your maze dimensions
const mazeWidth = 300;
const mazeHeight = 300;

export default function New() {
  const navigation = useNavigation();
  const [destination, setDestination] = useState({ x: mazeWidth / 2, y: mazeHeight / 2 });

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View>
      <TouchableOpacity onPress={handleBackPress} style={{ position: 'absolute', top: 20, left: 20 }}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View>
        <Text>New</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Svg width={mazeWidth} height={mazeHeight} style={{ backgroundColor: 'lightgray' }}>
          {/* Render maze */}
          {/* Horizontal lines */}
          <Line x1="50" y1="50" x2="250" y2="50" stroke="black" strokeWidth="2" />
          <Line x1="50" y1="100" x2="250" y2="100" stroke="black" strokeWidth="2" />
          <Line x1="50" y1="150" x2="250" y2="150" stroke="black" strokeWidth="2" />
          {/* Vertical lines */}
          <Line x1="50" y1="50" x2="50" y2="150" stroke="black" strokeWidth="2" />
          <Line x1="100" y1="50" x2="100" y2="150" stroke="black" strokeWidth="2" />
          <Line x1="150" y1="50" x2="150" y2="150" stroke="black" strokeWidth="2" />
          <Line x1="200" y1="50" x2="200" y2="150" stroke="black" strokeWidth="2" />
          {/* Render destination */}
          <Circle cx={destination.x} cy={destination.y} r="5" fill="red" />
        </Svg>
      </View>
    </View>
  );
}
