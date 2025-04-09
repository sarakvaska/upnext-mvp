// @@iconify-code-gen
import React from 'react';
import { Stack } from 'expo-router';
import { Dimensions } from 'react-native';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="project" 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
}