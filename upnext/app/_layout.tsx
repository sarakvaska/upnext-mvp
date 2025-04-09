// @@iconify-code-gen
import React, { useState } from 'react';
import { Tabs, router, Stack } from 'expo-router';
import { View, Text, Pressable, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import { useColorScheme } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Easing,
  runOnJS
} from 'react-native-reanimated';

interface RouteType {
  name: string;
}

interface TabIconProps {
  color: string;
}

const { height } = Dimensions.get('window');

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