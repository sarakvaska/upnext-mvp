import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Iconify from 'react-native-iconify';
import ShareProjectModal from '../components/ShareProjectModal';

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
    title: 'Collabs',
    subtitle: 'updated 2 mins ago',
    type: 'folder',
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150'
    ]
  },
  {
    id: '2',
    title: 'Summer Collection 2025',
    subtitle: 'updated april 6 • 10 photos • 2 videos',
    type: 'project',
    images: [
      'https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=800',
      'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800',
      'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=800',
      'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=800',
      'https://images.unsplash.com/photo-1520690214124-2405c5217036?w=800'
    ]
  },
  {
    id: '3',
    title: 'Thailand 2024',
    subtitle: 'sarakvaska • updated 1 hr ago • 1 video',
    type: 'project',
    images: ['https://via.placeholder.com/300/87CEEB']
  },
];

const { width } = Dimensions.get('window');
const PADDING = 16;
const SPACING = 4;
const GRID_COLUMNS = 3;
const GRID_WIDTH = width - (PADDING * 2);
const THUMBNAIL_SIZE = (GRID_WIDTH - (SPACING * (GRID_COLUMNS - 1))) / GRID_COLUMNS;

export default function ProjectScreen() {
  const { id } = useLocalSearchParams();
  const project = MOCK_PROJECTS.find((p: Project) => p.id === id && p.type === 'project');
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

  if (!project) {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <Text style={styles.text}>Project not found</Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Iconify icon="material-symbols:chevron-left-rounded" size={30} color="white" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={[styles.headerButton, styles.headerButtonDark]}
              onPress={() => setIsShareModalVisible(true)}
            >
              <Iconify icon="mdi:link-variant" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.headerButton, styles.headerButtonDark]}>
              <Iconify icon="mdi:ellipsis-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Main Content */}
          <View style={styles.content}>
            <Image 
              source={{ uri: project.images[0] }}
              style={styles.mainImage}
            />
            <Text style={styles.title}>{project.title}</Text>
            <Text style={styles.subtitle}>{project.subtitle}</Text>

            {/* Add Button */}
            <TouchableOpacity style={styles.addButtonContainer}>
              <LinearGradient
                colors={['#3A7BD5', '#9D50BB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Image Grid */}
            <View style={styles.imageGrid}>
              {project.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => router.push({
                    pathname: '/project/media/[id]',
                    params: { 
                      id: index.toString(), 
                      initialIndex: index,
                      images: JSON.stringify(project.images)
                    }
                  })}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.gridImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <ShareProjectModal
          isVisible={isShareModalVisible}
          onClose={() => setIsShareModalVisible(false)}
          projectTitle={project.title}
          projectImage={project.images[0]}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  headerButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: PADDING,
    paddingBottom: 100,
  },
  mainImage: {
    width: '100%',
    height: width - (PADDING * 2),
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 16,
  },
  addButtonContainer: {
    marginBottom: 16,
  },
  addButton: {
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING,
  },
  gridImage: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 8,
    backgroundColor: '#1C1C1E',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
}); 