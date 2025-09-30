import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2392f61b31ac4f8fa72fc2fb0001c4a7',
  appName: 'Schluck mal!',
  webDir: 'dist',
  server: {
    url: 'https://2392f61b-31ac-4f8f-a72f-c2fb0001c4a7.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
