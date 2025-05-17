import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Mount React app
createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for production
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(error => {
        console.log('SW registration failed: ', error);
      });
  });
}
