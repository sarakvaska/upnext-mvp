import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Project = {
  id: string;
  title: string;
  subtitle: string;
  images: string[];
  type: 'folder' | 'project';
};

// Mock data - replace with real data from Supabase later
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Nike',
    subtitle: 'Draft',
    type: 'project',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800']
  },
  {
    id: '2',
    title: 'Glossier',
    subtitle: 'Draft',
    type: 'project',
    images: ['https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=800']
  },
  {
    id: '3',
    title: 'Poppi 🌸',
    subtitle: 'Draft',
    type: 'project',
    images: ['https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=800']
  },
  {
    id: '4',
    title: 'Chanel',
    subtitle: 'Draft',
    type: 'project',
    images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800']
  }
];

const { width } = Dimensions.get('window');
const PADDING = 10;
const SPACING = 6;
const CARD_WIDTH = (width - (PADDING * 2) - (SPACING * 2)) / 3;

export default function FolderScreen() {
  const projectsInFolder = MOCK_PROJECTS.filter(p => p.type === 'project');

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView>
          {/* Projects Grid */}
          <View style={styles.content}>
              {projectsInFolder.map((project) => (
                <TouchableOpacity 
                  key={project.id}
                  style={styles.projectCard}
                  onPress={() => router.push(`/project/${project.id}`)}
                >
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
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  headerButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  headerButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
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
  }
}); 