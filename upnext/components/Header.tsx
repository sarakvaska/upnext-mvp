import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Iconify } from 'react-native-iconify';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function Header({ screen, icon }: { screen: string; icon?: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View>
          <Svg width={36} height={36} viewBox="0 0 26 29">
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#3A7BD5" />
                <Stop offset="1" stopColor="#9D50BB" />
              </LinearGradient>
            </Defs>
            <Path
              d="M15 11H21C21.2652 11 21.5196 10.8946 21.7071 10.7071C21.8946 10.5196 22 10.2652 22 10V4C22 3.73478 21.8946 3.48043 21.7071 3.29289C21.5196 3.10536 21.2652 3 21 3H15C14.7348 3 14.4804 3.10536 14.2929 3.29289C14.1054 3.48043 14 3.73478 14 4V10C14 10.2652 14.1054 10.5196 14.2929 10.7071C14.4804 10.8946 14.7348 11 15 11ZM16 5H20V9H16V5ZM5 21H11C11.2652 21 11.5196 20.8946 11.7071 20.7071C11.8946 20.5196 12 20.2652 12 20V14C12 13.7348 11.8946 13.4804 11.7071 13.2929C11.5196 13.1054 11.2652 13 11 13H5C4.73478 13 4.48043 13.1054 4.29289 13.2929C4.10536 13.4804 4 13.7348 4 14V20C4 20.2652 4.10536 20.5196 4.29289 20.7071C4.48043 20.8946 4.73478 21 5 21ZM6 15H10V19H6V15ZM5 8H7V10C7 10.2652 7.10536 10.5196 7.29289 10.7071C7.48043 10.8946 7.73478 11 8 11C8.26522 11 8.51957 10.8946 8.70711 10.7071C8.89464 10.5196 9 10.2652 9 10V8H11C11.2652 8 11.5196 7.89464 11.7071 7.70711C11.8946 7.51957 12 7.26522 12 7C12 6.73478 11.8946 6.48043 11.7071 6.29289C11.5196 6.10536 11.2652 6 11 6H9V4C9 3.73478 8.89464 3.48043 8.70711 3.29289C8.51957 3.10536 8.26522 3 8 3C7.73478 3 7.48043 3.10536 7.29289 3.29289C7.10536 3.48043 7 3.73478 7 4V6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8ZM15 21H21C21.2652 21 21.5196 20.8946 21.7071 20.7071C21.8946 20.5196 22 20.2652 22 20V14C22 13.7348 21.8946 13.4804 21.7071 13.2929C21.5196 13.1054 21.2652 13 21 13H15C14.7348 13 14.4804 13.1054 14.2929 13.2929C14.1054 13.4804 14 13.7348 14 14V20C14 20.2652 14.1054 20.5196 14.2929 20.7071C14.4804 20.8946 14.7348 21 15 21ZM16 15H20V19H16V15Z"
              fill="url(#grad)"
            />
          </Svg>
        </View>
        <Text style={styles.logoText}>
          {screen === 'profile' ? 'account' : 'upnext'}
        </Text>
      </View>
      
      <View style={styles.actions}>
        {icon ? (
          <TouchableOpacity style={styles.iconButton}>
            <Iconify icon={icon} color="#fff" size={24} />
          </TouchableOpacity>
        ) : screen !== 'profile' ? (
          <>
            <TouchableOpacity style={styles.iconButton}>
              <Iconify icon="material-symbols:search-rounded" color="#fff" size={24} />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.iconButton}>
              <Iconify icon="mingcute:notification-line" color="#fff" size={24} />
            </TouchableOpacity> */}
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#000',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 42,
  },
  iconButton: {
    padding: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
  },
}); 