import React from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * Super lightweight LawXpert app that just opens the website
 * Use this if you're having performance/file watcher issues with the main app
 */
export default function SimpleLawXpert() {
  const homeUrl = 'https://lawexpert.vercel.app/';
  
  const handleShouldStartLoad = (request) => {
    // Always navigate back to home URL
    if (request.url !== homeUrl) {
      webViewRef.current?.injectJavaScript(`window.location.href = "${homeUrl}";true;`);
      return false;
    }
    return true;
  };
  
  const webViewRef = React.useRef(null);
  
  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: homeUrl }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0056b3" />
          </View>
        )}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        onNavigationStateChange={(navState) => {
          if (navState.url !== homeUrl) {
            webViewRef.current?.injectJavaScript(`window.location.href = "${homeUrl}";true;`);
          }
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'ios' ? 50 : 30,
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