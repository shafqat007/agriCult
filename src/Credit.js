import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you are using Ionicons for the back arrow

const Credit = ({ navigation }) => {
  const handleBackPress = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  return (
    <View>
      <TouchableOpacity onPress={handleBackPress} style={{ position: 'absolute', top: 20, left: 20 }}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View>
        <Text>Credit</Text>
      </View>
    </View>
  );
};

export default Credit;
