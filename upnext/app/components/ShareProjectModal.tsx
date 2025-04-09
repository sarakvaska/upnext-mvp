import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Dimensions,
} from 'react-native';
import { Iconify } from 'react-native-iconify';

interface ShareProjectModalProps {
  isVisible: boolean;
  onClose: () => void;
  projectTitle: string;
  projectImage: string;
}

const ShareProjectModal: React.FC<ShareProjectModalProps> = ({
  isVisible,
  onClose,
  projectTitle,
  projectImage,
}) => {
  const [allowCollaboration, setAllowCollaboration] = useState(false);
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [addWatermark, setAddWatermark] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Share Project</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Iconify icon="material-symbols:close" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Project Info */}
        <View style={styles.projectInfo}>
          <Image source={{ uri: projectImage }} style={styles.thumbnail} />
          <Text style={styles.projectTitle} numberOfLines={2}>
            {projectTitle}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button}>
            <Iconify icon="mdi:content-copy" size={24} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Copy Link</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Iconify icon="material-symbols:upload" size={24} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Share Link</Text>
          </TouchableOpacity>
        </View>

        {/* Options */}
        <View style={styles.options}>
          <View style={styles.optionRow}>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Allow Collaboration</Text>
              <Text style={styles.optionDescription}>Anyone with the link can add media, remove media, and add notes.</Text>
            </View>
            <Switch
              value={allowCollaboration}
              onValueChange={setAllowCollaboration}
              trackColor={{ false: '#767577', true: '#6C66C8' }}
              thumbColor={allowCollaboration ? '#FFF' : '#FFF'}
            />
          </View>
          <View style={styles.optionRow}>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Password Protect</Text>
              <Text style={styles.optionDescription}>Make link password protected.</Text>
            </View>
            <Switch
              value={passwordProtect}
              onValueChange={setPasswordProtect}
              trackColor={{ false: '#767577', true: '#6C66C8' }}
              thumbColor={passwordProtect ? '#FFF' : '#FFF'}
            />
          </View>
          {/* <View style={styles.optionRow}>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Add Watermark</Text>
              <Text style={styles.optionDescription}>Add a "DRAFT" watermark to protect your content before publishing.</Text>
            </View>
            <Switch
              value={addWatermark}
              onValueChange={setAddWatermark}
              trackColor={{ false: '#767577', true: '#4CAF50' }}
              thumbColor={addWatermark ? '#FFF' : '#FFF'}
            />
          </View> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
  closeButton: {
    padding: 5,
    position: 'absolute',
    right: 20,
  },
  projectInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32
  },
  thumbnail: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginBottom: 20,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  buttonIcon: {
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },
  options: {
    gap: 24,
    paddingHorizontal: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default ShareProjectModal; 