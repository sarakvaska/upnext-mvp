// @@iconify-code-gen
import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import { useColorScheme } from 'react-native';

export default function AppLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopWidth: 0,
          height: 85,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#666',
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
        },
        headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color }: { color: string }) => (
            <Iconify icon="material-symbols:grid-on" color={color} size={26} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="upload"
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={{
              width: 110,
              height: 55,
              overflow: 'hidden',
              borderRadius: 16,
              marginBottom: -12,
            }}>
              <LinearGradient
                colors={['#3A7BD5', '#9D50BB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '500' }}>Create</Text>
              </LinearGradient>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }: { color: string }) => (
            <Iconify icon="material-symbols:person-rounded" color={color} size={26} />
          ),
        }}
      />
    </Tabs>
  );
} 