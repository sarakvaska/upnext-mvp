import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  TouchableWithoutFeedback,
  Keyboard, 
  Animated, 
  Platform 
} from 'react-native';
import { Iconify } from 'react-native-iconify';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { Note } from './constants';
import NoteItem from './NoteItem';

interface NoteModalProps {
  isVisible: boolean;
  onClose: () => void;
  notes: Note[];
  expandedNotes: { [key: number]: boolean };
  toggleNoteExpansion: (noteId: number) => void;
  newNote: string;
  setNewNote: (text: string) => void;
  inputBarPosition: Animated.Value;
  insets: { bottom: number; top: number; };
}

const NoteModal: React.FC<NoteModalProps> = ({
  isVisible,
  onClose,
  notes,
  expandedNotes,
  toggleNoteExpansion,
  newNote,
  setNewNote,
  inputBarPosition,
  insets
}) => {
  const notesCount = notes.length;

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      presentationStyle="pageSheet"
      statusBarTranslucent={true}
      onRequestClose={() => {
        Keyboard.dismiss();
        onClose();
      }}
      hardwareAccelerated={true}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            Notes
            <Text style={styles.modalNotesCount}>
              {notesCount > 0 ? ` (${notesCount})` : ''}
            </Text>
          </Text>
          <TouchableOpacity 
            onPress={onClose}
            style={{
              padding: 12,
              zIndex: 30,
            }}
          >
            <Text style={{
              fontSize: 15,
              fontWeight: '500',
              color: '#fff',
            }}>Close</Text>
          </TouchableOpacity>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContent}>
            <ScrollView 
              style={styles.modalNotesList}
              contentContainerStyle={{ paddingBottom: 60 }}
              bounces={false}
              keyboardShouldPersistTaps="handled"
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
          </View>
        </TouchableWithoutFeedback>
        
        {/* Input bar that stays above keyboard */}
        <Animated.View 
          style={[
            styles.modalInputWrapper,
            {
              transform: [{ translateY: inputBarPosition }],
              paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
              backgroundColor: '#000',
            }
          ]}
          collapsable={false}
        >
          <View style={styles.modalInputContainer}>
            <TextInput
              style={styles.modalInput}
              placeholder="Add a note..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={newNote}
              onChangeText={setNewNote}
              multiline
              autoFocus={true}
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
  );
};

export default NoteModal; 