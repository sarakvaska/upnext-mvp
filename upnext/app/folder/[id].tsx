import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Iconify } from 'react-native-iconify';

type Project = {
  id: string;
  title: string;
  subtitle: string;
  images: string[];
  type: 'folder' | 'project';
  parentFolder: string;
};

// Mock data - replace with real data from Supabase later
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Nike',
    subtitle: 'Draft',
    type: 'project',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'], 
    parentFolder: 'Collabs'
  },
  {
    id: '2',
    title: 'Glossier',
    subtitle: 'Draft',
    type: 'project',
    images: ['https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=800'],
    parentFolder: 'Collabs'
  },
  {
    id: '3',
    title: 'Poppi 🌸',
    subtitle: 'Draft',
    type: 'project',
    images: ['https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=800'],
    parentFolder: 'Collabs'
  },
  {
    id: '4',
    title: 'Chanel',
    subtitle: 'Draft',
    type: 'project',
    images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800'],
    parentFolder: 'Collabs'
  }
];

const { width } = Dimensions.get('window');
const PADDING = 10;
const SPACING = 6;
const GRID_COLUMNS = 3;
const GRID_WIDTH = width - (PADDING * 2);
const PROJECT_SIZE = (GRID_WIDTH - (SPACING * (GRID_COLUMNS - 1))) / GRID_COLUMNS;

export default function FolderScreen() {
  const { id } = useLocalSearchParams();
  const project = MOCK_PROJECTS.find((p: Project) => p.id === id && p.type === 'project');
  const projectsInFolder = MOCK_PROJECTS.filter(p => p.type === 'project');

  if (!project) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Project not found</Text>
      </SafeAreaView>
    );
  }

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
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButtonFull}>
            <Iconify icon="material-symbols:chevron-left-rounded" size={30} color="white" />
            <Text style={styles.headerTitle}>{project.parentFolder}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          {/* Projects Grid */}
          <View style={styles.content}>
            <View style={styles.projectsGrid}>
              {projectsInFolder.map((proj) => (
                <TouchableOpacity 
                  key={proj.id}
                  style={styles.projectCard}
                  onPress={() => router.push(`/project/${proj.id}?folderTitle=${project.parentFolder}`)}
                >
                  <Image
                    source={{ uri: proj.images[0] }}
                    style={styles.projectImage}
                  />
                  <View style={styles.projectInfo}>
                    <Text style={styles.projectTitle}>{proj.title}</Text>
                    <Text style={styles.projectSubtitle}>{proj.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
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
  content: {
    padding: PADDING,
  },
  projectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING,
  },
  projectCard: {
    width: PROJECT_SIZE,
  },
  projectImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
  },
  projectInfo: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  projectTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  projectSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  headerButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 