import React from 'react';
import { View, Animated, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { styles } from './styles';
import { PORTRAIT_RATIO, LANDSCAPE_RATIO, EXPANDED_HEIGHT } from './constants';

interface MediaDisplayProps {
  imageUrl: string;
  imageRatio: number;
  isExpanded: boolean;
  expandAnim: Animated.Value;
  inputFocusAnim: Animated.Value;
  insets: { top: number; bottom: number; left: number; right: number };
  toggleExpand: () => void;
  height: number;
  width: number;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({
  imageUrl,
  imageRatio,
  isExpanded,
  expandAnim,
  inputFocusAnim,
  insets,
  toggleExpand,
  height,
  width,
}) => {
  const isPortrait = imageRatio > 1;
  const containerHeight = isPortrait ? width * PORTRAIT_RATIO : width * LANDSCAPE_RATIO;
  const availableHeight = height - insets.top - insets.bottom - 30; // 30 is COLLAPSED_HEIGHT
  const verticalMargin = (availableHeight - containerHeight) / 3;

  const translateY = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -EXPANDED_HEIGHT / 2],
    extrapolate: 'clamp'
  });

  return (
    <>
      {isExpanded && (
        <TouchableOpacity 
          style={[styles.overlay, { height: height - insets.bottom }]} 
          activeOpacity={1} 
          onPress={toggleExpand}
        />
      )}
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
                outputRange: [0, -EXPANDED_HEIGHT / 3],
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
    </>
  );
};

export default MediaDisplay; 