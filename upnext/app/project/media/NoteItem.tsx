import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { styles } from './styles';
import { Note } from './constants';

interface NoteItemProps {
  note: Note;
  isExpanded: boolean;
  toggleNoteExpansion: (noteId: number) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, isExpanded, toggleNoteExpansion }) => {
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

export default NoteItem; 