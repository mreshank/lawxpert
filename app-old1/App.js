import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, BackHandler, Platform, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible until app is ready
SplashScreen.preventAutoHideAsync();

export default function App() {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const homeUrl = 'https://lawexpert.vercel.app/';

  useEffect(() => {
    // Handle Android back button press
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Navigate to home URL when back button is pressed
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`window.location.href = "${homeUrl}";true;`);
      }
      return true; // Prevent default behavior
    });

    // Hide splash screen once we're fully loaded
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };

    if (!loading) {
      hideSplash();
    }

    return () => backHandler.remove();
  }, [loading]);

  // Handle when the WebView finishes loading
  const handleLoadEnd = () => {
    setLoading(false);
  };

  // Handle navigation state changes (URL changes)
  const handleNavigationStateChange = (navState) => {
    // If app is refreshed/reopened and not on the home page, redirect to home
    const currentUrl = navState.url;
    
    // If we're not on exactly the home URL, navigate to it
    if (currentUrl !== homeUrl) {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`window.location.href = "${homeUrl}";true;`);
        return true;
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
        </View>
      )}
      
      <WebView
        ref={webViewRef}
        source={{ uri: homeUrl }}
        style={styles.webview}
        onLoadEnd={handleLoadEnd}
        onNavigationStateChange={handleNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={Platform.OS === 'android'} // scalesPageToFit is deprecated on iOS
        renderLoading={() => null} // We're handling loading state ourselves
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    zIndex: 1,
  },
}); 