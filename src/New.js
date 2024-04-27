import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Line } from 'react-native-svg';

// Assuming your maze dimensions
const mazeWidth = 300;
const mazeHeight = 300;

const Credit = ({ navigation }) => {
  const [markers, setMarkers] = useState([]);
  const [shortestPath, setShortestPath] = useState([]);

  // Function to handle tapping on maze
  const handleTap = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const tappedPosition = { x: locationX, y: locationY };
    setMarkers([...markers, tappedPosition]);

    // Calculate shortest path from center to tapped position
    const center = { x: mazeWidth / 2, y: mazeHeight / 2 };
    const shortestPath = calculateShortestPath(center, tappedPosition);
    setShortestPath(shortestPath);
  };

  // Function to calculate shortest path using Dijkstra's algorithm
  const calculateShortestPath = (start, end) => {
    // Function to calculate distance between two points
    const distance = (point1, point2) => {
      const dx = point1.x - point2.x;
      const dy = point1.y - point2.y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Define maze nodes and edges
    const nodes = [start, end, ...markers];
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        edges.push({ from: nodes[i], to: nodes[j], weight: distance(nodes[i], nodes[j]) });
      }
    }

    // Dijkstra's algorithm
    const queue = new Set(nodes);
    const dist = {};
    const prev = {};
    nodes.forEach((node) => {
      dist[node] = Infinity;
      prev[node] = null;
    });
    dist[start] = 0;

    while (queue.size > 0) {
      let minDist = Infinity;
      let u = null;
      for (const node of queue) {
        if (dist[node] < minDist) {
          minDist = dist[node];
          u = node;
        }
      }
      queue.delete(u);
      if (u === end) break;

      for (const edge of edges) {
        if (edge.from === u) {
          const alt = dist[u] + edge.weight;
          if (alt < dist[edge.to]) {
            dist[edge.to] = alt;
            prev[edge.to] = u;
          }
        }
      }
    }

    // Reconstruct shortest path
    const shortestPath = [];
    let u = end;
    while (prev[u]) {
      shortestPath.unshift(u);
      u = prev[u];
    }
    shortestPath.unshift(start);

    return shortestPath;
  };
  const handleBackPress = () => {
    navigation.goBack(); // Go back to the previous screen
  };
  // Function to render lines for shortest path
  const renderShortestPath = () => {
    return shortestPath.map((point, index) => {
      if (index === 0) return null; // Skip the first point
      const prevPoint = shortestPath[index - 1];
      return (
        <Line
          key={index}
          x1={prevPoint.x}
          y1={prevPoint.y}
          x2={point.x}
          y2={point.y}
          stroke="red"
          strokeWidth="2"
        />
      );
    });
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity onPress={handleBackPress} style={{ position: 'absolute', top: 20, left: 20 }}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={{ marginTop: 20 }}>
        <Text>Credit</Text>
      </View>
      <View onTouchEnd={handleTap} style={{ width: mazeWidth, height: mazeHeight, backgroundColor: 'lightgray', marginTop: 20 }}>
        {/* Maze */}
        <Svg width={mazeWidth} height={mazeHeight} style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Horizontal lines */}
          <Line x1="50" y1="50" x2="250" y2="50" stroke="black" strokeWidth="2" />
          <Line x1="50" y1="100" x2="250" y2="100" stroke="black" strokeWidth="2" />
          <Line x1="50" y1="150" x2="250" y2="150" stroke="black" strokeWidth="2" />
          {/* Vertical lines */}
          <Line x1="50" y1="50" x2="50" y2="150" stroke="black" strokeWidth="2" />
          <Line x1="100" y1="50" x2="100" y2="150" stroke="black" strokeWidth="2" />
          <Line x1="150" y1="50" x2="150" y2="150" stroke="black" strokeWidth="2" />
          <Line x1="200" y1="50" x2="200" y2="150" stroke="black" strokeWidth="2" />
        </Svg>
        {/* Render markers */}
        {markers.map((marker, index) => (
          <View key={index} style={{ position: 'absolute', left: marker.x - 5, top: marker.y - 5, width: 10, height: 10, borderRadius: 5, backgroundColor: 'blue' }} />
        ))}
        {/* Render shortest path */}
        <Svg width={mazeWidth} height={mazeHeight} style={{ position: 'absolute', top: 0, left: 0 }}>
          {renderShortestPath()}
        </Svg>
      </View>
    </View>
  );
};

export default Credit;