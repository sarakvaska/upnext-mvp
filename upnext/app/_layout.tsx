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

const styles = StyleSheet.create({
  createButtonContainer: {
    width: 100,
    height: 48,
    overflow: 'hidden',
    borderRadius: 16,
    marginBottom: -16, // Keep the button positioned correctly
  },
  createButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 8,
    marginBottom: 90,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    transformOrigin: 'bottom',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#3A3A3C',
    marginHorizontal: 16,
  },
}); 