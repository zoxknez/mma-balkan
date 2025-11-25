import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, Checkbox } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../store/authStore';
import type { ScreenNavigationProp } from '../types/navigation';

type RegisterScreenProps = {
  navigation: ScreenNavigationProp<'Register'>;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { register, isLoading, error, clearError } = useAuthStore();

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Greška', 'Molimo unesite ime');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Greška', 'Molimo unesite email');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Greška', 'Molimo unesite validan email');
      return false;
    }
    if (!password) {
      Alert.alert('Greška', 'Molimo unesite lozinku');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Greška', 'Lozinka mora imati najmanje 6 karaktera');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Greška', 'Lozinke se ne poklapaju');
      return false;
    }
    if (!agreeToTerms) {
      Alert.alert('Greška', 'Morate se složiti sa uslovima korišćenja');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const success = await register(name.trim(), email.trim(), password);
    if (!success && error) {
      Alert.alert('Greška pri registraciji', error);
      clearError();
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
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
          <Text style={styles.headerSubtitle}>Kreirajte svoj nalog</Text>
        </LinearGradient>

        <Card style={styles.registerCard}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.title}>Registrujte se</Text>
            <Text style={styles.subtitle}>Kreirajte nalog za pristup MMA Balkan platformi</Text>

            <TextInput
              label="Ime i prezime"
              value={name}
              onChangeText={setName}
              mode="outlined"
              autoCapitalize="words"
              autoComplete="name"
              style={styles.input}
              theme={{
                colors: {
                  primary: '#10b981',
                  surface: '#1f2937',
                }
              }}
            />

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
              autoComplete="password-new"
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

            <TextInput
              label="Potvrdite lozinku"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              autoComplete="password-new"
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
              theme={{
                colors: {
                  primary: '#10b981',
                  surface: '#1f2937',
                }
              }}
            />

            <View style={styles.termsContainer}>
              <Checkbox
                status={agreeToTerms ? 'checked' : 'unchecked'}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
                color="#10b981"
              />
              <Text style={styles.termsText}>
                Slažem se sa{' '}
                <Text style={styles.termsLink}>uslovima korišćenja</Text>
                {' '}i{' '}
                <Text style={styles.termsLink}>politikom privatnosti</Text>
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? 'Registracija...' : 'Registrujte se'}
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.loginCard}>
          <Card.Content style={styles.loginContent}>
            <Text style={styles.loginText}>Već imate nalog?</Text>
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              Prijavite se
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Registracijom se slažete sa našim uslovima korišćenja i politikom privatnosti
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
  registerCard: {
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  termsText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: '#9ca3af',
    lineHeight: 16,
  },
  termsLink: {
    color: '#10b981',
    textDecorationLine: 'underline',
  },
  registerButton: {
    backgroundColor: '#10b981',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#1f2937',
  },
  loginContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loginText: {
    color: '#9ca3af',
    marginRight: 16,
  },
  loginButton: {
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

export default RegisterScreen;
