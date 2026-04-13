 import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cbempaka.app',
  appName: 'CBE Mpaka',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'http'
  }
};

export default config;
