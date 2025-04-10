// Constants for media layout and animations
import { LayoutAnimation } from 'react-native';

export const PORTRAIT_RATIO = 1.3;    // height = width * 1.3
export const LANDSCAPE_RATIO = 0.85;  // height = width * 0.85
export const COLLAPSED_HEIGHT = 30;
export const EXPANDED_HEIGHT = 350;
export const KEYBOARD_INPUT_HEIGHT = 90; // Height of input + padding
export const STATUS_BAR_BUFFER = 20; // Extra space below status bar

export const SPRING_CONFIG = {
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

// Mock data for notes
export interface Note {
  id: number;
  text: string;
  author: string;
  timestamp: string;
  avatar?: string;
}

export interface NotesData {
  [key: string]: Note[];
}

export interface ExpandedNotes {
  [key: number]: boolean;
}

// Temporary mock data for notes
export const mockNotes: NotesData = {
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
    }, 
    { 
      id: 3, 
      text: "wow!", 
      author: "Mike", 
      timestamp: "5h ago",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    }, 
    { 
      id: 4, 
      text: "wow!", 
      author: "Mike", 
      timestamp: "5h ago",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    }, 
    { 
      id: 5, 
      text: "wow!", 
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