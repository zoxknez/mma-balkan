import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, Avatar, List, Switch, Divider, IconButton } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Odjava',
      'Da li ste sigurni da želite da se odjavite?',
      [
        { text: 'Otkaži', style: 'cancel' },
        { 
          text: 'Odjavi se', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  const showComingSoon = (title: string) => {
    Alert.alert(title, 'Ova funkcionalnost će uskoro biti dostupna.');
  };

  const handleEditProfile = () => {
    showComingSoon('Izmena profila');
  };

  const handleChangePassword = () => {
    showComingSoon('Promena lozinke');
  };

  const handlePrivacySettings = () => {
    showComingSoon('Postavke privatnosti');
  };

  const handleAbout = () => {
    showComingSoon('O aplikaciji');
  };

  const handleSupport = () => {
    showComingSoon('Podrška');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text 
            size={80} 
            label={user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || 'Korisnik'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userRole}>
              {user?.role === 'admin' ? 'Administrator' : 
               user?.role === 'moderator' ? 'Moderator' : 'Korisnik'}
            </Text>
          </View>
          <IconButton
            icon="pencil"
            size={20}
            onPress={handleEditProfile}
            style={styles.editButton}
          />
        </Card.Content>
      </Card>

      {/* Quick Stats */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Text style={styles.statsTitle}>Vaša statistika</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Pratim borce</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Pratim događaje</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Članci</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Settings */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Postavke</Text>
          
          <List.Item
            title="Obaveštenja"
            description="Primaj obaveštenja o novim vestima i događajima"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color="#10b981"
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Tamna tema"
            description="Koristi tamnu temu aplikacije"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                color="#10b981"
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Account Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Nalog</Text>
          
          <List.Item
            title="Izmeni profil"
            description="Promeni lične informacije"
            left={(props) => <List.Icon {...props} icon="account-edit" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleEditProfile}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Promeni lozinku"
            description="Ažuriraj svoju lozinku"
            left={(props) => <List.Icon {...props} icon="lock-reset" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleChangePassword}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Privatnost"
            description="Upravljaj privatnošću i sigurnošću"
            left={(props) => <List.Icon {...props} icon="shield-account" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handlePrivacySettings}
          />
        </Card.Content>
      </Card>

      {/* Support & Info */}
      <Card style={styles.supportCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Podrška i informacije</Text>
          
          <List.Item
            title="Pomoć"
            description="FAQ i podrška"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleSupport}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="O aplikaciji"
            description="Verzija i informacije"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleAbout}
          />
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor="#ef4444"
        >
          Odjavi se
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  profileCard: {
    margin: 16,
    backgroundColor: '#1f2937',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    backgroundColor: '#10b981',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  editButton: {
    margin: 0,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1f2937',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1f2937',
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1f2937',
  },
  supportCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1f2937',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 16,
  },
  divider: {
    backgroundColor: '#374151',
    marginVertical: 8,
  },
  logoutContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    paddingVertical: 8,
  },
});

export default ProfileScreen;
