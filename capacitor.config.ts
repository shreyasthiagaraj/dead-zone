import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.deadzone.app',
  appName: 'Dead Zone',
  webDir: 'www',
  server: {
    // iOS WKWebView settings
    iosScheme: 'capacitor',
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#000000',
  },
};

export default config;
