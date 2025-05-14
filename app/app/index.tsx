import { WebView } from "react-native-webview";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useEffect, useRef } from "react";

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const PRODUCTION_URL = "https://lawexpert.vercel.app/";

  // This useEffect will run only when the component mounts (app opens or refreshes)
  useEffect(() => {
    // Small delay to ensure WebView is properly loaded
    const timer = setTimeout(() => {
      webViewRef.current?.injectJavaScript(`
        window.location.href = '${PRODUCTION_URL}';
      `);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Remove the URL check from navigation state change
  const handleNavigationStateChange = (navState: any) => {
    // Now this function just monitors navigation without redirecting
    console.log("Current URL:", navState.url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webViewContainer}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <WebView
          ref={webViewRef}
          source={{ uri: PRODUCTION_URL }}
          style={styles.webView}
          onNavigationStateChange={handleNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          bounces={false}
          allowsBackForwardNavigationGestures={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webViewContainer: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 28 : 0,
  },
  webView: {
    flex: 1,
  },
});
