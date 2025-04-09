import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const user = {
    name: 'John Doe',
    username: '@johndoe',
    profilePicture: 'https://images.unsplash.com/5/unsplash-kitsune-4.jpg?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=bc01c83c3da0425e9baa6c7a9204af81', // Sample profile picture
    plan: 'Basic', // User plan
    planDetails: 'Access to basic features and limited storage', // Plan details
    creationDate: 'Creating since Feb 2024', // Creation date
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.creationDate}>{user.creationDate}</Text>
        <View style={styles.cardsContainer}>
          <LinearGradient
            colors={['#3A7BD5', '#9D50BB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.planCardContent}>
              <View style={styles.planTitleContainer}>
                <Text style={styles.planTitle}>{user.plan} Plan</Text>
                <LinearGradient
                  colors={['#3A7BD5', '#9D50BB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.freeTag}
                >
                  <Text style={styles.freeTagText}>Free</Text>
                </LinearGradient>
              </View>
              <Text style={styles.planDetails}>{user.planDetails}</Text>
            </View>
          </LinearGradient>
          <TouchableOpacity style={[styles.card, styles.accountCard]}>
            <View style={styles.accountContent}>
              <View>
                <Text style={styles.accountTitle}>Your Account</Text>
                <Text style={styles.accountDetails}>Manage account settings and preferences</Text>
              </View>
              <Iconify icon="material-symbols:chevron-right-rounded" size={26} color="#666" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  cardsContainer: {
    width: '85%',
    alignItems: 'stretch',
  },
  gradientBorder: {
    borderRadius: 12,
    marginTop: 16,
    padding: 1.5, // This creates the border effect
  },
  planCardContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 11,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  profilePicture: {
    width: 180,
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  username: {
    color: '#666',
    fontSize: 16,
  },
  creationDate: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 6,
  },
  card: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  planTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  planDetails: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  accountTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'left',
  },
  accountDetails: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'left',
  },
  accountCard: {
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  accountContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 16,
  },
  freeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  freeTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
}); 