import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../store/authStore';
import type { ScreenNavigationProp } from '../types/navigation';

type LoginScreenProps = {
  navigation: ScreenNavigationProp<'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Greška', 'Molimo unesite email i lozinku');
      return;
    }

    const success = await login(email.trim(), password);
    if (!success && error) {
      Alert.alert('Greška pri prijavi', error);
      clearError();
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={['#10b981', '#3b82f6']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>MMA Balkan</Text>
          <Text style={styles.headerSubtitle}>Dobrodošli nazad</Text>
        </LinearGradient>

        <Card style={styles.loginCard}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.title}>Prijavite se</Text>
            <Text style={styles.subtitle}>Unesite svoje podatke za prijavu</Text>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
              theme={{
                colors: {
                  primary: '#10b981',
                  surface: '#1f2937',
                }
              }}
            />

            <TextInput
              label="Lozinka"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoComplete="password"
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              theme={{
                colors: {
                  primary: '#10b981',
                  surface: '#1f2937',
                }
              }}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? 'Prijavljivanje...' : 'Prijavite se'}
            </Button>

            <Button
              mode="text"
              onPress={() => {/* Forgot password */}}
              style={styles.forgotButton}
              textColor="#10b981"
            >
              Zaboravili ste lozinku?
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.registerCard}>
          <Card.Content style={styles.registerContent}>
            <Text style={styles.registerText}>Nemate nalog?</Text>
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
            >
              Registrujte se
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Prijavom se slažete sa našim uslovima korišćenja i politikom privatnosti
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 32,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e5e7eb',
  },
  loginCard: {
    margin: 16,
    backgroundColor: '#1f2937',
  },
  cardContent: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f9fafb',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#374151',
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#10b981',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  forgotButton: {
    alignSelf: 'center',
  },
  registerCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#1f2937',
  },
  registerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  registerText: {
    color: '#9ca3af',
    marginRight: 16,
  },
  registerButton: {
    backgroundColor: '#3b82f6',
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default LoginScreen;
