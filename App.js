import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import index from './src/index';
import Credit from './src/Credit';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="FetchData"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right', 
        }}
      >
        <Stack.Screen name="index" component={index} />
        <Stack.Screen name="Credit" component={Credit} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
