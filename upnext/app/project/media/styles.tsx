import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 5,
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
    height: 350
  },
  notesCollapsedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 30,
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
    opacity: 0, // Start hidden
  },
  notesList: {
    padding: 16,
    paddingBottom: 10,
    flex: 1,
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
    width: '100%',
  },
  noteInput: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
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
    flexDirection: 'column',
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
    fontWeight: '600',
    color: '#fff',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#000',
    paddingBottom: 60,
  },
  modalNotesList: {
    flex: 1,
    padding: 16,
    paddingBottom: 16,
  },
  modalInputWrapper: {
    backgroundColor: '#000',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  modalInputContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#000',
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
    padding: 12,
    marginRight: -8,
    zIndex: 20,
  },
  closeButtonHitSlop: {
    padding: 4,
  },
}); 