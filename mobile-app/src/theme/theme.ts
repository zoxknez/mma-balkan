import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#10b981',
    secondary: '#3b82f6',
    tertiary: '#8b5cf6',
    surface: '#1f2937',
    surfaceVariant: '#374151',
    background: '#111827',
    error: '#ef4444',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#f9fafb',
    onBackground: '#f9fafb',
    outline: '#6b7280',
  },
  roundness: 12,
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#10b981',
    secondary: '#3b82f6',
    tertiary: '#8b5cf6',
    surface: '#ffffff',
    surfaceVariant: '#f3f4f6',
    background: '#f9fafb',
    error: '#ef4444',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#111827',
    onBackground: '#111827',
    outline: '#6b7280',
  },
  roundness: 12,
};
