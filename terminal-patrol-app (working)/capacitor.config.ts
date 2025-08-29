
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fb663a386086418cb12944d11df4b3a4',
  appName: 'mobile-ui-canvas-poppins',
  webDir: 'dist',
  server: {
    url: 'https://fb663a38-6086-418c-b129-44d11df4b3a4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    backgroundColor: "#FFFFFF"
  }
};

export default config;
