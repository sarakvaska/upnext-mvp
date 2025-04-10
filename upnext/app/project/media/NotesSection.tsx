import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { Note, EXPANDED_HEIGHT, COLLAPSED_HEIGHT } from './constants';
import NoteItem from './NoteItem';

interface NotesSectionProps {
  notes: Note[];
  isExpanded: boolean;
  expandAnim: Animated.Value;
  inputFocusAnim: Animated.Value;
  toggleExpand: () => void;
  expandedNotes: { [key: number]: boolean };
  toggleNoteExpansion: (noteId: number) => void;
  handleInputPress: () => void;
  height: number;
  insets: { bottom: number; top: number; };
  isInputFocused: boolean;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  isExpanded,
  expandAnim,
  inputFocusAnim,
  toggleExpand,
  expandedNotes,
  toggleNoteExpansion,
  handleInputPress,
  height,
  insets,
  isInputFocused
}) => {
  const notesCount = notes.length;

  return (
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

        <Animated.View 
          style={{
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            opacity: expandAnim
          }}
        >
          <ScrollView 
            style={[
              styles.notesList,
              isInputFocused && { maxHeight: height - 180 }
            ]} 
            bounces={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {notes.length > 0 ? notes.map(note => (
              <NoteItem 
                key={note.id}
                note={note} 
                isExpanded={!!expandedNotes[note.id]} 
                toggleNoteExpansion={toggleNoteExpansion}
              />
            )) : (
              <Text style={styles.noNotesText}>No notes yet</Text>
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={handleInputPress}
            activeOpacity={0.7}
          >
            <View style={styles.noteInput}>
              <Text style={styles.inputPlaceholder}>Add a note...</Text>
            </View>
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
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

export default NotesSection; 