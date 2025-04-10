import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Text, Animated, TextInput, Easing, useWindowDimensions, LayoutAnimation, KeyboardAvoidingView, Platform, Keyboard, PanResponder, ScrollView, Modal } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Iconify } from 'react-native-iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Image as ExpoImage } from 'expo-image';

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

const KEYBOARD_INPUT_HEIGHT = 90; // Height of input + padding
const STATUS_BAR_BUFFER = 20; // Extra space below status bar

export default function MediaViewerScreen() {
  const { id, initialIndex, images } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);
  const imageUrls = JSON.parse(images as string);
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [newNote, setNewNote] = useState('');
  const expandAnim = useRef(new Animated.Value(0)).current;
  const inputFocusAnim = useRef(new Animated.Value(0)).current;
  const [expandedNotes, setExpandedNotes] = useState<ExpandedNotes>({});
  const [mediaAspectRatios, setMediaAspectRatios] = useState<{ [key: string]: number }>({});
  const { height, width } = useWindowDimensions();
  const keyboardHeight = useRef(new Animated.Value(0)).current;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const modalKeyboardHeight = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    const keyboardWillShow = (e: any) => {
      setIsInputFocused(true);
      if (!isExpanded) {
        setIsExpanded(true);
        Animated.timing(expandAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.bezier(0.2, 0, 0, 1),
        }).start();
      }
      
      Animated.timing(inputFocusAnim, {
        toValue: 1,
        duration: e.duration,
        useNativeDriver: true,
        easing: Easing.bezier(0.2, 0, 0, 1),
      }).start();
      
      Animated.timing(keyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: e.duration,
        useNativeDriver: true,
      }).start();
    };

    const keyboardWillHide = (e: any) => {
      setIsInputFocused(false);
      Animated.timing(inputFocusAnim, {
        toValue: 0,
        duration: e.duration,
        useNativeDriver: true,
        easing: Easing.bezier(0.2, 0, 0, 1),
      }).start();
      
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: e.duration,
        useNativeDriver: true,
      }).start();
    };

    const showListener = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideListener = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardShowSub = Keyboard.addListener(showListener, keyboardWillShow);
    const keyboardHideSub = Keyboard.addListener(hideListener, keyboardWillHide);

    return () => {
      keyboardShowSub.remove();
      keyboardHideSub.remove();
    };
  }, [isExpanded]);

  useEffect(() => {
    const keyboardWillShow = (e: any) => {
      if (isModalVisible) {
        Animated.timing(modalKeyboardHeight, {
          toValue: e.endCoordinates.height,
          duration: e.duration,
          useNativeDriver: true,
          easing: Easing.bezier(0.2, 0, 0, 1),
        }).start();
      }
    };

    const keyboardWillHide = (e: any) => {
      if (!isModalVisible) {
        Animated.timing(modalKeyboardHeight, {
          toValue: 0,
          duration: e.duration,
          useNativeDriver: true,
          easing: Easing.bezier(0.2, 0, 0, 1),
        }).start();
      }
    };

    const showListener = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideListener = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardShowSub = Keyboard.addListener(showListener, keyboardWillShow);
    const keyboardHideSub = Keyboard.addListener(hideListener, keyboardWillHide);

    return () => {
      keyboardShowSub.remove();
      keyboardHideSub.remove();
    };
  }, [isModalVisible]);

  const handleInputPress = () => {
    setIsModalVisible(true);
    if (!isExpanded) {
      toggleExpand();
    }
  };

  const handleModalClose = () => {
    Keyboard.dismiss();
    setIsModalVisible(false);
    setNewNote('');
    modalKeyboardHeight.setValue(0);
  };

  const renderItem = useCallback(({ item: imageUrl, index }: { item: string; index: number }) => {
    const notes = mockNotes[index + 1] || [];
    const notesCount = notes.length;
    const imageRatio = mediaAspectRatios[imageUrl] || 1;
    const isPortrait = imageRatio > 1;
    
    const containerHeight = isPortrait ? width * PORTRAIT_RATIO : width * LANDSCAPE_RATIO;
    const availableHeight = height - insets.top - insets.bottom - COLLAPSED_HEIGHT;
    const verticalMargin = (availableHeight - containerHeight) / 3;

    const translateY = expandAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -EXPANDED_HEIGHT / 4],
      extrapolate: 'clamp'
    });

    // Calculate the exact distance we need to move up:
    // - Start from bottom of screen
    // - Move up by keyboard height
    // - Move up by input container height
    // - Leave space for status bar + buffer
    // - The rest of the space is available for notes
    const targetTranslateY = -(keyboardHeight.interpolate({
      inputRange: [0, height],
      outputRange: [0, height - KEYBOARD_INPUT_HEIGHT - insets.top - STATUS_BAR_BUFFER],
      extrapolate: 'clamp'
    }));

    return (
      <View style={[styles.mediaContainer, { 
        height: height - insets.bottom,
        width: width,
      }]}>
        <Animated.View style={[
          styles.mediaWrapper, 
          { 
            height: containerHeight,
            marginTop: verticalMargin + insets.top,
            width: width,
            transform: [{ 
              translateY: Animated.add(
                translateY,
                inputFocusAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -EXPANDED_HEIGHT / 6],
                  extrapolate: 'clamp'
                })
              )
            }]
          }
        ]}>
          <Animated.View style={[
            styles.mediaContent,
            {
              transform: [{ 
                scale: expandAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.70],
                  extrapolate: 'clamp'
                })
              }],
              width: width,
              height: containerHeight,
            }
          ]}>
            <ExpoImage
              source={{ uri: imageUrl }}
              style={[styles.media, { 
                height: containerHeight,
                width: width,
              }]}
              contentFit={isPortrait ? "fill" : "contain"}
              transition={300}
            />
          </Animated.View>
        </Animated.View>
        
        <Animated.View style={[
          styles.notesWrapper, 
          { 
            paddingBottom: insets.bottom,
            transform: [{ 
              translateY: Animated.add(
                expandAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                  extrapolate: 'clamp'
                }),
                inputFocusAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -(height / 12) + insets.top + 48],
                  extrapolate: 'clamp'
                })
              )
            }]
          }
        ]}>
          <Animated.View style={[
            styles.notesContainer,
            {
              height: isInputFocused ? height - 90 - insets.top - 48 : EXPANDED_HEIGHT,
              transform: [
                { 
                  translateY: expandAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [EXPANDED_HEIGHT - COLLAPSED_HEIGHT, 0],
                    extrapolate: 'clamp'
                  })
                }
              ]
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
                opacity: expandAnim,
                flex: 1,
                transform: [{
                  translateY: inputFocusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -EXPANDED_HEIGHT / 5 + COLLAPSED_HEIGHT],
                    extrapolate: 'clamp'
                  })
                }]
              }
            ]}>
              <ScrollView 
                style={[
                  styles.notesList,
                  isInputFocused && { maxHeight: height - 180 }
                ]} 
                bounces={false}
              >
                {notes.length > 0 ? notes.map(renderNote) : (
                  <Text style={styles.noNotesText}>No notes yet</Text>
                )}
              </ScrollView>
            </Animated.View>

            <TouchableOpacity
              style={[styles.inputContainer, { opacity: expandAnim }]}
              onPress={handleInputPress}
              activeOpacity={0.7}
            >
              <View style={styles.noteInput}>
                <Text style={styles.inputPlaceholder}>Add a note...</Text>
              </View>
              <View style={styles.addNoteButtonContainer}>
                <LinearGradient
                  colors={['#3A7BD5', '#9D50BB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addNoteButton}
                >
                  <Iconify icon="material-symbols:send" size={18} color="white" />
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleModalClose}
        >
          <SafeAreaView style={styles.modalContainer} pointerEvents="box-none">
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Notes
                <Text style={styles.modalNotesCount}>
                  {notesCount > 0 ? ` (${notesCount})` : ''}
                </Text>
              </Text>
              <TouchableOpacity 
                onPress={handleModalClose}
                style={styles.modalCloseButton}
                activeOpacity={0.7}
              >
                <View style={styles.closeButtonHitSlop}>
                  <Text style={styles.modalDoneButton}>Close</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <ScrollView 
                style={styles.modalNotesList} 
                bounces={false}
                keyboardShouldPersistTaps="always"
              >
                {notes.length > 0 ? notes.map(renderNote) : (
                  <Text style={styles.noNotesText}>No notes yet</Text>
                )}
              </ScrollView>
            </View>
            <Animated.View 
              style={[
                styles.modalInputWrapper,
                {
                  transform: [{
                    translateY: modalKeyboardHeight.interpolate({
                      inputRange: [0, height],
                      outputRange: [0, -height],
                      extrapolate: 'clamp'
                    })
                  }]
                }
              ]}
            >
              <View style={styles.modalInputContainer}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Add a note..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={newNote}
                  onChangeText={setNewNote}
                  multiline
                  autoFocus
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
              </View>
            </Animated.View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }, [height, width, expandAnim, inputFocusAnim, mediaAspectRatios, toggleExpand, newNote, insets.top, insets.bottom, isModalVisible, modalKeyboardHeight]);

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
    backgroundColor: '#000',
  },
  mediaWrapper: {
    backgroundColor: '#000',
  },
  mediaContent: {
    backgroundColor: '#000',
  },
  media: {
    backgroundColor: '#000',
  },
  notesWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10
  },
  notesContainer: {
    backgroundColor: '#000',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    height: EXPANDED_HEIGHT
  },
  notesCollapsedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: COLLAPSED_HEIGHT,
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
    opacity: 0, // Start hidden,
  },
  notesList: {
    padding: 16,
    paddingBottom: 80,
  },
  noteItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
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
    marginBottom: 4,
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
    marginTop: 20,
  },
  keyboardAvoidingView: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    paddingTop: 12,
    backgroundColor: '#000',
    borderTopWidth: StyleSheet.hairlineWidth,
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
  noteInputFocused: {
    minHeight: 36,
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
  inputPlaceholder: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
    letterSpacing: -0.2,
  },
  modalNotesCount: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    fontWeight: '400',
  },
  modalDoneButton: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalNotesList: {
    flex: 1,
    padding: 16,
    paddingBottom: 90, // Account for input height
  },
  modalInputWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  modalInputContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    paddingTop: 12,
    backgroundColor: '#000',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalInput: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
    maxHeight: 100,
    textAlignVertical: 'center',
  },
  modalCloseButton: {
    padding: 8,
    marginRight: -8,
    zIndex: 10,
  },
  closeButtonHitSlop: {
    padding: 4,
  },
}); 