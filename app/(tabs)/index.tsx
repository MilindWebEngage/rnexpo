import { Image } from 'expo-image';
import { Button, Platform, ScrollView, StyleSheet, View, PermissionsAndroid } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import WebEngage from "react-native-webengage"
import React from 'react';

export default function HomeScreen() {

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const webEngage = new WebEngage();
  // AK: This is the HomeScreen component for the WebEngage POC app.
  console.log("AK: From HomeScreen | index.tsx");
  const loginLabel = isLoggedIn ? "Logout" : "Login";


  React.useEffect(() => {
    requestNotificationPermission();
  }, []);

  const trackEvent = () => {
    console.log("AK: Track Event Button Clicked");
    webEngage.track("Simple Event");
  };

  const trackScreen = () => {
    console.log("AK: Track Screen Button Clicked");
    webEngage.screen("HomeScreen");
  };

  const loginUser = () => {
    console.log("AK: Login Button Clicked");
    if (isLoggedIn) {
      webEngage.user.logout();
      setIsLoggedIn(false);
    } else {
      webEngage.user.login("Ak-expo");
      setIsLoggedIn(true);
    }
  };

  const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'This app needs access to your notifications',
          buttonPositive: 'OK',
        }
      );
      if( granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Notification permission granted successfully");
        webEngage.user.setDevicePushOptIn(true);
        return true;
      } else {
        webEngage.user.setDevicePushOptIn(false);
        console.log("Notification permission denied!!!");
        return false;
      }
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Permission error:', err);
      return false;
    }
  }
  // For iOS or older Android, permissions are handled differently
  return true;
};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Button title="Track Event" onPress={trackEvent} />
        <Button title="Screen Track" onPress={trackScreen} />
        
        <Button title={loginLabel} onPress={loginUser} />
       </View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,

  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
