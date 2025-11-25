import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import FightersScreen from './src/screens/FightersScreen';
import EventsScreen from './src/screens/EventsScreen';
import NewsScreen from './src/screens/NewsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import FighterDetailScreen from './src/screens/FighterDetailScreen';
import EventDetailScreen from './src/screens/EventDetailScreen';
import NewsDetailScreen from './src/screens/NewsDetailScreen';

// Theme
import { theme } from './src/theme/theme';

// Store
import { useAuthStore } from './src/store/authStore';

const Stack = createStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#1f2937',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              {isAuthenticated ? (
                <>
                  <Stack.Screen 
                    name="Home" 
                    component={HomeScreen} 
                    options={{ title: 'MMA Balkan' }}
                  />
                  <Stack.Screen 
                    name="Fighters" 
                    component={FightersScreen} 
                    options={{ title: 'Borci' }}
                  />
                  <Stack.Screen 
                    name="Events" 
                    component={EventsScreen} 
                    options={{ title: 'Događaji' }}
                  />
                  <Stack.Screen 
                    name="News" 
                    component={NewsScreen} 
                    options={{ title: 'Vesti' }}
                  />
                  <Stack.Screen 
                    name="Profile" 
                    component={ProfileScreen} 
                    options={{ title: 'Profil' }}
                  />
                  <Stack.Screen 
                    name="FighterDetail" 
                    component={FighterDetailScreen} 
                    options={{ title: 'Detalji borca' }}
                  />
                  <Stack.Screen 
                    name="EventDetail" 
                    component={EventDetailScreen} 
                    options={{ title: 'Detalji događaja' }}
                  />
                  <Stack.Screen 
                    name="NewsDetail" 
                    component={NewsDetailScreen} 
                    options={{ title: 'Detalji vesti' }}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen 
                    name="Register" 
                    component={RegisterScreen} 
                    options={{ headerShown: false }}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
