import { WebView } from 'react-native-webview';
import { StyleSheet, View, StatusBar } from 'react-native';
import { useRef } from 'react';

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const PRODUCTION_URL = 'https://lawexpert.vercel.app/';

  const handleNavigationStateChange = (navState: any) => {
    // If the URL is not the root URL, navigate back to root
    if (navState.url !== PRODUCTION_URL) {
      webViewRef.current?.injectJavaScript(`
        window.location.href = '${PRODUCTION_URL}';
      `);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
  },
});
