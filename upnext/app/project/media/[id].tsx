import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, SafeAreaView, FlatList, Animated, Easing, useWindowDimensions, LayoutAnimation, Platform, Keyboard, UIManager } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Iconify } from 'react-native-iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'react-native';

import { 
  SPRING_CONFIG, 
  mockNotes,
  ExpandedNotes
} from './constants';
import { styles } from './styles';
import MediaDisplay from './MediaDisplay';
import NotesSection from './NotesSection';
import NoteModal from './NoteModal';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const inputBarPosition = useRef(new Animated.Value(0)).current;
  const [keyboardHeightValue, setKeyboardHeightValue] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(SPRING_CONFIG);
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    // Disable horizontal scrolling when notes are expanded, enable when collapsed
    setScrollEnabled(!newExpandedState);
    
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

  const handleInputPress = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    // First dismiss the keyboard
    Keyboard.dismiss();
    
    // Reset input position instantly without animation
    inputBarPosition.setValue(0);
    
    // Close modal immediately
    setIsModalVisible(false);
    setNewNote('');
  };

  useEffect(() => {
    if (isModalVisible) {
      // Small delay to ensure the modal is fully rendered before focusing
      setTimeout(() => {
        // For pageSheet presentation style, we need to ensure the input is visible
        if (Platform.OS === 'android') {
          Keyboard.dismiss();
          setTimeout(() => Keyboard.isVisible || Keyboard.dismiss(), 100);
        }
      }, 300);
    }
  }, [isModalVisible]);

  // Custom keyboard handling specifically for the modal input bar
  useEffect(() => {
    const showListener = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideListener = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardWillShowForModal = (e: any) => {
      if (isModalVisible) {
        // Set state directly without batching or debouncing
        setKeyboardShowing(true);
        setKeyboardHeightValue(e.endCoordinates.height);
        
        // Increased offset to position input bar lower (further from keyboard)
        const keyboardOffset = Platform.OS === 'ios' 
          ? 30  // Larger offset to position lower on iOS
          : 15; // Slightly smaller for Android
        
        // For immediate response, set value directly first
        inputBarPosition.setValue(-(e.endCoordinates.height - keyboardOffset));
        
        // Speed up animation to anticipate keyboard movement
        const animDuration = Platform.OS === 'ios'
          ? Math.max(e.duration * 0.7, 160) // 30% faster than keyboard
          : Math.max(e.duration * 0.6, 100); // 40% faster on Android
        
        // Then start the animation immediately from the current position
        Animated.timing(inputBarPosition, {
          toValue: -(e.endCoordinates.height - keyboardOffset),
          duration: animDuration,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad), // Use quad-out for faster initial movement
        }).start();
      }
    };

    const keyboardWillHideForModal = (e: any) => {
      if (isModalVisible) {
        // Set state directly without batching or debouncing
        setKeyboardShowing(false);
        
        // DO NOT set value directly on hide - this causes the jump
        // Instead, only use the animation
        
        // Use a slower animation when hiding to create a smooth slide
        const animDuration = Platform.OS === 'ios'
          ? Math.max(e.duration * 0.95, 220) // Slightly slower for smoother slide
          : Math.max(e.duration * 0.9, 180); // Slightly slower on Android too
        
        // Use a different easing curve for hiding - more gradual
        Animated.timing(inputBarPosition, {
          toValue: 0,
          duration: animDuration,
          useNativeDriver: true,
          easing: Easing.bezier(0.2, 0, 0, 1), // Use standard bezier for smoother exit
        }).start();
      }
    };

    const keyboardShowSub = Keyboard.addListener(showListener, keyboardWillShowForModal);
    const keyboardHideSub = Keyboard.addListener(hideListener, keyboardWillHideForModal);

    return () => {
      keyboardShowSub.remove();
      keyboardHideSub.remove();
    };
  }, [isModalVisible, inputBarPosition]);

  // Add cleanup effect for modal closing
  useEffect(() => {
    // When modal is no longer visible, reset everything
    if (!isModalVisible) {
      // Reset positions and state
      inputBarPosition.setValue(0);
      setKeyboardShowing(false);
    }
  }, [isModalVisible, inputBarPosition]);

  const renderItem = useCallback(({ item: imageUrl, index }: { item: string; index: number }) => {
    const notes = mockNotes[index + 1] || [];
    const imageRatio = mediaAspectRatios[imageUrl] || 1;

    return (
      <View style={[styles.mediaContainer, { 
        height: height - insets.bottom,
        width: width,
      }]}>
        <MediaDisplay 
          imageUrl={imageUrl}
          imageRatio={imageRatio}
          isExpanded={isExpanded}
          expandAnim={expandAnim}
          inputFocusAnim={inputFocusAnim}
          insets={insets}
          toggleExpand={toggleExpand}
          height={height}
          width={width}
        />
        
        <NotesSection 
          notes={notes}
          isExpanded={isExpanded}
          expandAnim={expandAnim}
          inputFocusAnim={inputFocusAnim}
          toggleExpand={toggleExpand}
          expandedNotes={expandedNotes}
          toggleNoteExpansion={toggleNoteExpansion}
          handleInputPress={handleInputPress}
          height={height}
          insets={insets}
          isInputFocused={isInputFocused}
        />

        <NoteModal 
          isVisible={isModalVisible}
          onClose={handleModalClose}
          notes={notes}
          expandedNotes={expandedNotes}
          toggleNoteExpansion={toggleNoteExpansion}
          newNote={newNote}
          setNewNote={setNewNote}
          inputBarPosition={inputBarPosition}
          insets={insets}
        />
      </View>
    );
  }, [height, width, expandAnim, inputFocusAnim, mediaAspectRatios, toggleExpand, newNote, insets.top, insets.bottom, isModalVisible, keyboardShowing, inputBarPosition, isExpanded, isInputFocused, expandedNotes]);

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
          scrollEnabled={scrollEnabled}
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