import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.deadzone.app',
  appName: 'Necrowave',
  webDir: 'www',
  server: {
    // iOS WKWebView settings
    iosScheme: 'capacitor',
  },
  ios: {
    contentInset: 'never',
    preferredContentMode: 'mobile',
    backgroundColor: '#000000',
    allowsLinkPreview: false,
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000',
    },
  },
};

export default config;
