import React, { useState } from 'react';
import { Tabs, router } from 'expo-router';
import { View, Text, Pressable, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Header';
import { useColorScheme } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Easing,
  runOnJS,
  FadeIn,
} from 'react-native-reanimated';
import ProfileHeader from './profile';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const modalScale = useSharedValue(0);
  const modalOpacity = useSharedValue(0);
  const modalY = useSharedValue(20);
  const textOpacity = useSharedValue(1);

  const openMenu = () => {
    setIsMenuOpen(true);
    setModalVisible(true);
    modalScale.value = withSpring(1, {
      damping: 20,
      stiffness: 200,
      mass: 0.5,
    });
    modalY.value = withSpring(0, {
      damping: 20,
      stiffness: 200,
      mass: 0.5,
    });
    modalOpacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    modalScale.value = withSpring(0, {
      damping: 20,
      stiffness: 200,
      mass: 0.5,
    });
    modalY.value = withSpring(20, {
      damping: 20,
      stiffness: 200,
      mass: 0.5,
    });
    modalOpacity.value = withTiming(0, {
      duration: 200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }, () => {
      runOnJS(finishClosing)();
    });
  };

  const finishClosing = () => {
    setModalVisible(false);
  };

  const handleImport = () => {
    console.log('Import action triggered');
    closeMenu();
  };

  const handleNewProject = () => {
    console.log('New Project action triggered');
    closeMenu();
    router.push('/upload');
  };

  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: modalScale.value },
        { translateY: modalY.value }
      ],
      opacity: modalOpacity.value,
    };
  });

  return (
    <>
      <Tabs
        screenOptions={({ route }: { route: any }) => ({
          header: () => {
            if (route.name === 'profile') {
              return <Header screen="profile" />;
            }
            return <Header screen="index" />;
          },
          tabBarStyle: {
            backgroundColor: '#000',
            borderTopWidth: 0,
            height: 90,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#666',
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Projects',
            tabBarIcon: ({ color }: { color: string }) => (
              <Iconify icon="material-symbols:grid-on" color={color} size={26} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="upload"
          listeners={{
            tabPress: (e: any) => {
              e.preventDefault();
              if (isMenuOpen) {
                closeMenu();
              } else {
                openMenu();
              }
            },
          }}
          options={{
            title: '',
            tabBarIcon: () => (
              <View style={styles.createButtonContainer}>
                <LinearGradient
                  colors={['#3A7BD5', '#9D50BB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.createButtonGradient}
                >
                  {isMenuOpen ? (
                    <Animated.Text 
                      entering={FadeIn.duration(200)} 
                      style={styles.createButtonText}
                    >
                      Close
                    </Animated.Text>
                  ) : (
                    <Animated.Text 
                      entering={FadeIn.duration(200)} 
                      style={styles.createButtonText}
                    >
                      Create
                    </Animated.Text>
                  )}
                </LinearGradient>
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }: { color: string }) => (
              <Iconify icon="material-symbols:person-rounded" color={color} size={26} />
            ),
          }}
        />
      </Tabs>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeMenu}>
          <Animated.View 
            style={[styles.modalContent, animatedModalStyle]}
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity style={styles.menuItem} onPress={handleImport}>
              <Iconify icon="material-symbols:upload" size={20} color="#fff" />
              <Text style={styles.menuItemText}>Import</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleNewProject}>
              <Iconify icon="material-symbols:add-circle-outline-rounded" size={20} color="#fff" />
              <Text style={styles.menuItemText}>New Project</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  createButtonContainer: {
    width: 110,
    height: 50,
    overflow: 'hidden',
    borderRadius: 16,
    marginBottom: -16,
  },
  createButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 8,
    marginBottom: 90,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    transformOrigin: 'bottom',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#3A3A3C',
    marginHorizontal: 16,
  },
}); 