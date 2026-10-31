import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.theotherside.app',
  appName: 'The Other Side',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
