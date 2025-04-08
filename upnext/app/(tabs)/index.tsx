import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Mock data - replace with real data from Supabase later
const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'Collabs',
    subtitle: 'updated 2 mins ago',
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
    subtitle: 'updated Apr 6',
    images: ['https://via.placeholder.com/300/FFB6C1']
  },
  {
    id: '3',
    title: 'Thailand 2024',
    subtitle: 'sarakvaska • updated 1 hr ago',
    images: ['https://via.placeholder.com/300/87CEEB']
  },
];

const { width } = Dimensions.get('window');
const PADDING = 10;
const SPACING = 6;
const CARD_WIDTH = (width - (PADDING * 2) - (SPACING * 2)) / 3;

type FilterButtonProps = {
  title: string;
};

export default function HomeScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const FilterButton = ({ title }: FilterButtonProps) => {
    const isSelected = selectedFilter === title;
    
    return (
      <TouchableOpacity 
        onPress={() => setSelectedFilter(title)}
        style={styles.filterButtonContainer}
      >
        {isSelected ? (
          <LinearGradient
            colors={['#3A7BD5', '#9D50BB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.filterButtonGradientBorder}
          >
            <View style={styles.filterButtonInner}>
              <Text style={[styles.filterButtonText, styles.filterButtonTextSelected]}>
                {title}
              </Text>
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.filterButtonInactive}>
            <Text style={styles.filterButtonText}>
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.filtersContainer}>
        <FilterButton title="All" />
        <FilterButton title="Mine" />
        <FilterButton title="Shared With Me" />
      </View>
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
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: PADDING,
    paddingVertical: 6,
    gap: 8,
  },
  filterButtonContainer: {
    height: 40,
  },
  filterButtonGradientBorder: {
    borderRadius: 20,
    padding: 1.5,
    height: 40,
  },
  filterButtonInactive: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: '#2b2b2d',
    height: 40,
  },
  filterButtonInner: {
    backgroundColor: '#000',
    borderRadius: 18.5,
    paddingHorizontal: 16,
    paddingVertical: 9,
    height: '100%',
    justifyContent: 'center',
  },
  filterButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextSelected: {
    fontWeight: '600',
  },
}); 