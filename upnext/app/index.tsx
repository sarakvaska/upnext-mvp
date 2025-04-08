import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Link } from 'expo-router';

// Mock data - replace with real data from Supabase later
const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'Collabs',
    subtitle: 'ivanajohnson • Draft',
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150'
    ]
  },
  {
    id: '2',
    title: 'Summer Collection',
    subtitle: 'Draft',
    images: ['https://via.placeholder.com/300/FFB6C1']
  },
  {
    id: '3',
    title: 'Thailand 2024',
    subtitle: 'ivanajohnson • Draft',
    images: ['https://via.placeholder.com/300/87CEEB']
  },
];

const { width } = Dimensions.get('window');
const PADDING = 10;
const SPACING = 6;
const CARD_WIDTH = (width - (PADDING * 2) - (SPACING * 2)) / 3;

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {MOCK_PROJECTS.map((project) => (
          <TouchableOpacity key={project.id} style={styles.projectCard}>
            {project.images.length === 1 ? (
              <Image
                source={{ uri: project.images[0] }}
                style={styles.singleImage}
              />
            ) : (
              <View style={styles.imageGrid}>
                {project.images.slice(0, 4).map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.gridImage}
                  />
                ))}
              </View>
            )}
            <View style={styles.projectInfo}>
              <Text style={styles.projectTitle}>{project.title}</Text>
              <Text style={styles.projectSubtitle}>{project.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: PADDING,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING,
  },
  projectCard: {
    width: CARD_WIDTH,
  },
  singleImage: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridImage: {
    width: (CARD_WIDTH - 1) / 2,
    height: (CARD_WIDTH - 1) / 2,
    backgroundColor: '#2C2C2E',
  },
  projectInfo: {
    paddingVertical: 8,
    paddingHorizontal: 2,
    alignItems: 'flex-start',
  },
  projectTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'left',
  },
  projectSubtitle: {
    color: '#666',
    fontSize: 12,
    textAlign: 'left',
  },
}); 