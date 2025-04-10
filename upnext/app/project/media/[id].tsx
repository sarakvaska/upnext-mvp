import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, FlatList, Platform, Text, Animated, TextInput, Easing, useWindowDimensions, LayoutAnimation } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Iconify } from 'react-native-iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Image as ExpoImage } from 'expo-image';

const { width, height } = Dimensions.get('window');

const PORTRAIT_RATIO = 1.3;    // height = width * 1.3
const LANDSCAPE_RATIO = 0.85;  // height = width * 0.85
const COLLAPSED_HEIGHT = 48;
const EXPANDED_HEIGHT = 250;

interface Note {
  id: number;
  text: string;
  author: string;
  timestamp: string;
  avatar?: string;
}

interface NotesData {
  [key: string]: Note[];
}

interface ExpandedNotes {
  [key: number]: boolean;
}

// Temporary mock data for notes
const mockNotes: NotesData = {
  "1": [
    { 
      id: 1, 
      text: "Great composition!", 
      author: "Sarah", 
      timestamp: "2h ago",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    },
    { 
      id: 2, 
      text: "Love the lighting here", 
      author: "Mike", 
      timestamp: "5h ago",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    }
  ],
  "2": [
    { 
      id: 1, 
      text: "Colors are perfect", 
      author: "John", 
      timestamp: "1h ago",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop"
    }
  ]
};

const notesIconSvg = `<svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.31369 33.7239L7.49848 38.1514C8.88265 43.3192 9.57702 45.9042 11.1468 47.5794C12.3858 48.9012 13.9887 49.8263 15.7531 50.2377C17.9897 50.7602 20.5747 50.0681 25.7447 48.6839C30.9101 47.2998 33.4951 46.6077 35.1704 45.0379C35.3094 44.9065 35.4438 44.7721 35.5737 44.6346C34.7932 44.5642 34.0174 44.4495 33.2499 44.2908C31.6549 43.9746 29.7597 43.4658 27.5185 42.8654L27.2733 42.7989L27.216 42.7852C24.7776 42.1298 22.7404 41.5844 21.1133 40.9977C19.4014 40.3789 17.8476 39.6158 16.5254 38.3783C14.7065 36.6742 13.4337 34.4692 12.8679 32.0419C12.4554 30.2796 12.5745 28.5517 12.8954 26.7619C13.2024 25.0454 13.7524 22.9875 14.4124 20.5239L15.6385 15.9544L15.6797 15.7939C11.2797 16.9787 8.96286 17.68 7.41827 19.126C6.09482 20.3659 5.16889 21.9706 4.75765 23.7369C4.23515 25.9712 4.92723 28.5562 6.31369 33.7239Z" fill="url(#paint0_linear_125_121)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M47.7352 24.5554L46.5482 28.9829C45.1617 34.1506 44.4696 36.7356 42.8998 38.4108C41.6611 39.7334 40.0582 40.6593 38.2936 41.0714C38.072 41.1233 37.8467 41.1631 37.6175 41.1906C35.5207 41.4495 32.9609 40.7643 28.3042 39.5176C23.1365 38.1312 20.5515 37.4391 18.8763 35.8693C17.5532 34.63 16.6273 33.0262 16.2157 31.2608C15.6932 29.0241 16.3852 26.4414 17.7717 21.2737L18.9565 16.8462L19.5157 14.7722C20.5584 10.9543 21.2596 8.85286 22.6048 7.41598C23.8438 6.09415 25.4467 5.16909 27.2111 4.75765C29.4477 4.23515 32.0327 4.92723 37.2027 6.31369C42.3682 7.69786 44.9532 8.38994 46.6284 9.95744C47.9518 11.1974 48.8777 12.802 49.289 14.5683C49.8115 16.8049 49.1194 19.3876 47.7352 24.5554ZM25.325 22.4699C25.3835 22.2519 25.4844 22.0475 25.6219 21.8684C25.7594 21.6894 25.9309 21.5391 26.1264 21.4263C26.322 21.3136 26.5379 21.2404 26.7617 21.2111C26.9856 21.1817 27.213 21.1968 27.4311 21.2554L38.4998 24.2231C38.7236 24.2761 38.9345 24.3736 39.1199 24.5096C39.3054 24.6457 39.4616 24.8175 39.5794 25.0151C39.6972 25.2126 39.7742 25.4318 39.8058 25.6596C39.8373 25.8874 39.8228 26.1192 39.7632 26.3414C39.7035 26.5635 39.5999 26.7714 39.4584 26.9527C39.3169 27.134 39.1405 27.2851 38.9395 27.397C38.7386 27.5089 38.5172 27.5794 38.2886 27.6042C38.0599 27.629 37.8286 27.6076 37.6084 27.5414L26.5396 24.576C26.0997 24.4578 25.7247 24.1699 25.497 23.7754C25.2693 23.381 25.2074 22.91 25.325 22.4699ZM23.5467 29.1135C23.6649 28.6736 23.9528 28.2986 24.3472 28.0709C24.7417 27.8431 25.2104 27.7813 25.6504 27.8989L32.2917 29.6795C32.5166 29.7314 32.7287 29.8281 32.9154 29.9637C33.1021 30.0993 33.2595 30.2712 33.3784 30.469C33.4973 30.6668 33.5751 30.8865 33.6072 31.115C33.6393 31.3435 33.6251 31.5762 33.5654 31.7991C33.5056 32.022 33.4016 32.2306 33.2595 32.4125C33.1175 32.5943 32.9402 32.7457 32.7384 32.8575C32.5365 32.9694 32.3142 33.0395 32.0847 33.0636C31.8552 33.0877 31.6232 33.0653 31.4025 32.9979L24.7613 31.2195C24.5432 31.161 24.3388 31.0601 24.1598 30.9226C23.9807 30.7851 23.8305 30.6137 23.7177 30.4181C23.6049 30.2225 23.5317 30.0067 23.5024 29.7828C23.4731 29.559 23.4881 29.3315 23.5467 29.1135Z" fill="url(#paint1_linear_125_121)"/>
<defs>
<linearGradient id="paint0_linear_125_121" x1="20.0786" y1="15.7939" x2="20.0786" y2="50.4119" gradientUnits="userSpaceOnUse">
<stop stop-color="#3A7BD5"/>
<stop offset="1" stop-color="#9D50BB"/>
</linearGradient>
<linearGradient id="paint1_linear_125_121" x1="32.7522" y1="4.5835" x2="32.7522" y2="41.2449" gradientUnits="userSpaceOnUse">
<stop stop-color="#3A7BD5"/>
<stop offset="1" stop-color="#9D50BB"/>
</linearGradient>
</defs>
</svg>`;

const SPRING_CONFIG = {
  duration: 300,
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

export default function MediaViewerScreen() {
  const { id, initialIndex, images } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);
  const imageUrls = JSON.parse(images as string);
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newNote, setNewNote] = useState('');
  const expandAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;
  const [expandedNotes, setExpandedNotes] = useState<ExpandedNotes>({});
  const [mediaAspectRatios, setMediaAspectRatios] = useState<{ [key: string]: number }>({});
  const { height, width } = useWindowDimensions();

  const contentHeight = height - insets.top - insets.bottom;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(SPRING_CONFIG);
    setIsExpanded(!isExpanded);
    
    Animated.timing(expandAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.bezier(0.2, 0, 0, 1),
    }).start();
  };

  const toggleNoteExpansion = (noteId: number) => {
    setExpandedNotes(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };

  useEffect(() => {
    // Scroll to initial image
    if (flatListRef.current && initialIndex) {
      flatListRef.current.scrollToIndex({
        index: parseInt(initialIndex as string),
        animated: false
      });
    }
  }, []);

  useEffect(() => {
    const loadImageDimensions = async () => {
      const ratios = await Promise.all(
        imageUrls.map((url: string) => 
          new Promise<[string, number]>((resolve) => {
            Image.getSize(url, (width, height) => {
              resolve([url, height / width]); // Store height/width ratio
            }, () => resolve([url, 1]));
          })
        )
      );
      setMediaAspectRatios(Object.fromEntries(ratios));
    };

    loadImageDimensions();
  }, [imageUrls]);

  const renderNote = (note: Note) => {
    const isExpanded = expandedNotes[note.id];
    const shouldTruncate = note.text.length > 100;
    const displayText = shouldTruncate && !isExpanded 
      ? note.text.slice(0, 100) + '...'
      : note.text;

    return (
      <View key={note.id} style={styles.noteItem}>
        <ExpoImage
          source={{ uri: note.avatar }}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.noteContent}>
          <View style={styles.noteMetaContainer}>
            <Text style={styles.noteAuthor}>{note.author}</Text>
            <Text style={styles.noteTimestamp}>{note.timestamp}</Text>
          </View>
          <View>
            <Text style={styles.noteText}>{displayText}</Text>
            {shouldTruncate && (
              <TouchableOpacity onPress={() => toggleNoteExpansion(note.id)}>
                <Text style={styles.seeMoreText}>
                  {isExpanded ? 'See less' : 'See more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderItem = useCallback(({ item: imageUrl, index }: { item: string; index: number }) => {
    const notes = mockNotes[index + 1] || [];
    const notesCount = notes.length;
    const imageRatio = mediaAspectRatios[imageUrl] || 1;
    const isPortrait = imageRatio > 1;
    
    // Calculate base height based on orientation
    const baseHeight = width * (isPortrait ? PORTRAIT_RATIO : LANDSCAPE_RATIO);
    
    // Calculate vertical margin to center the image
    const verticalMargin = (contentHeight - baseHeight - insets.top) / 2;
    
    // Calculate scale factor for smooth animation
    const scale = expandAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, (baseHeight - (EXPANDED_HEIGHT - COLLAPSED_HEIGHT) * 0.7) / baseHeight],
      extrapolate: 'clamp'
    });

    return (
      <View style={[styles.mediaContainer, { 
        height: contentHeight,
        paddingTop: insets.top 
      }]}>
        <View style={[
          styles.mediaWrapper, 
          { 
            height: baseHeight,
            marginTop: verticalMargin,
            width: width // Ensure full width
          }
        ]}>
          <Animated.View style={[
            styles.mediaContent,
            {
              transform: [{ scale }],
              width: width // Ensure full width
            }
          ]}>
            <ExpoImage
              source={{ uri: imageUrl }}
              style={[styles.media, { 
                height: baseHeight,
                width: width // Ensure full width
              }]}
              contentFit="contain"
              transition={300}
            />
          </Animated.View>
        </View>
        
        <Animated.View style={[
          styles.notesContainer,
          {
            transform: [{ 
              translateY: expandAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [EXPANDED_HEIGHT - COLLAPSED_HEIGHT, 0],
                extrapolate: 'clamp'
              })
            }]
          }
        ]}>
          <TouchableOpacity 
            onPress={toggleExpand} 
            style={styles.notesCollapsedHeader}
            activeOpacity={0.7}
          >
            <View style={styles.notesHeaderLeft}>
              <Text style={styles.notesTitle}>
                Notes
                <Text style={styles.notesCount}>
                  {notesCount > 0 ? ` (${notesCount})` : ''}
                </Text>
              </Text>
            </View>
            <Animated.View style={{ 
              transform: [{ 
                rotate: expandAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg']
                }) 
              }]
            }}>
              <Iconify icon="material-symbols:keyboard-arrow-up-rounded" size={20} color="white" />
            </Animated.View>
          </TouchableOpacity>

          <Animated.View style={[
            styles.expandedContent,
            {
              opacity: expandAnim
            }
          ]}>
            <View style={styles.notesList}>
              {notes.length > 0 ? notes.map(renderNote) : (
                <Text style={styles.noNotesText}>No notes yet</Text>
              )}
            </View>
          </Animated.View>

          <Animated.View style={[
            styles.inputContainer,
            {
              opacity: expandAnim
            }
          ]}>
            <TextInput
              style={styles.noteInput}
              placeholder="Add a note..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={newNote}
              onChangeText={setNewNote}
              multiline
            />
            <TouchableOpacity style={styles.addNoteButtonContainer}>
              <LinearGradient
                colors={['#3A7BD5', '#9D50BB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.addNoteButton}
              >
                <Iconify icon="material-symbols:send" size={18} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    );
  }, [contentHeight, expandAnim, mediaAspectRatios, toggleExpand, newNote, insets.top]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, { top: insets.top }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Iconify icon="material-symbols:chevron-left-rounded" size={30} color="white" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Iconify icon="mdi:ellipsis-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Swipeable Gallery */}
        <FlatList
          ref={flatListRef}
          data={imageUrls}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          decelerationRate="fast"
          snapToAlignment="center"
          viewabilityConfig={{
            itemVisiblePercentThreshold: 90
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  mediaContainer: {
    width: width,
    backgroundColor: '#000',
  },
  mediaWrapper: {
    width: width,
    backgroundColor: '#000',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaContent: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  media: {
    width: width,
    backgroundColor: '#000',
  },
  notesContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: EXPANDED_HEIGHT,
    backgroundColor: '#000',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  notesCollapsedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: COLLAPSED_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  notesHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  notesCount: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    fontWeight: '400',
  },
  expandedContent: {
    flex: 1,
    opacity: 0, // Start hidden
  },
  notesList: {
    padding: 16,
    paddingBottom: 80,
    gap: 20,
  },
  noteItem: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  noteContent: {
    flex: 1,
  },
  noteMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  noteAuthor: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  noteTimestamp: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
  },
  noteText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  seeMoreText: {
    color: '#3A7BD5',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  noNotesText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    paddingTop: 12,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  noteInput: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
    maxHeight: 100,
  },
  addNoteButtonContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },
  addNoteButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 