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

  const handleNavigationStateChange = (navState: any) => {
    // If the URL is not the root URL, navigate back to root
    if (navState.url !== PRODUCTION_URL) {
      webViewRef.current?.injectJavaScript(`
        window.location.href = '${PRODUCTION_URL}';
      `);
    }
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
