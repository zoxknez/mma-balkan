import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Card, Button, Chip, Avatar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { ScreenNavigationProp } from '../types/navigation';

type IconName = keyof typeof Ionicons.glyphMap;
type QuickActionRoute = 'Fighters' | 'Events' | 'News' | 'Profile';

interface QuickAction {
  title: string;
  icon: IconName;
  color: string;
  navigateTo: QuickActionRoute;
}

interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  location: string;
}

interface FighterSummary {
  id: number;
  name: string;
  record: string;
  weight: string;
}

type HomeScreenProps = {
  navigation: ScreenNavigationProp<'Home'>;
};

const QUICK_ACTIONS: QuickAction[] = [
  { title: 'Borci', icon: 'people', color: '#3b82f6', navigateTo: 'Fighters' },
  { title: 'Događaji', icon: 'calendar', color: '#8b5cf6', navigateTo: 'Events' },
  { title: 'Vesti', icon: 'newspaper', color: '#10b981', navigateTo: 'News' },
  { title: 'Profil', icon: 'person', color: '#f59e0b', navigateTo: 'Profile' },
];

const UPCOMING_EVENTS: UpcomingEvent[] = [
  { id: 1, title: 'UFC 300', date: '2024-04-13', location: 'Las Vegas' },
  { id: 2, title: 'Bellator 300', date: '2024-04-20', location: 'San Diego' },
];

const TOP_FIGHTERS: FighterSummary[] = [
  { id: 1, name: 'Jon Jones', record: '27-1-0', weight: 'Heavyweight' },
  { id: 2, name: 'Islam Makhachev', record: '24-1-0', weight: 'Lightweight' },
  { id: 3, name: 'Leon Edwards', record: '22-3-0', weight: 'Welterweight' },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#3b82f6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Dobrodošli u MMA Balkan</Text>
        <Text style={styles.headerSubtitle}>Vaša MMA zajednica</Text>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Brze akcije</Text>
        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <Card key={action.navigateTo} style={[styles.actionCard, { borderLeftColor: action.color }]}>
              <Card.Content style={styles.actionContent}>
                <Ionicons name={action.icon} size={24} color={action.color} />
                <Text style={styles.actionTitle}>{action.title}</Text>
              </Card.Content>
              <Card.Actions>
                <Button
                  onPress={() => navigation.navigate(action.navigateTo)}
                  mode="text"
                  textColor={action.color}
                >
                  Idi
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Predstojeći događaji</Text>
        {UPCOMING_EVENTS.map((event) => (
          <Card key={event.id} style={styles.eventCard}>
            <Card.Content>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Chip mode="outlined" textStyle={{ color: '#10b981' }}>
                  {event.date}
                </Chip>
              </View>
              <Text style={styles.eventLocation}>{event.location}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}>
                Detalji
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>

      {/* Top Fighters */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top borci</Text>
        {TOP_FIGHTERS.map((fighter) => (
          <Card key={fighter.id} style={styles.fighterCard}>
            <Card.Content style={styles.fighterContent}>
              <Avatar.Text size={40} label={fighter.name.split(' ').map(n => n[0]).join('')} />
              <View style={styles.fighterInfo}>
                <Text style={styles.fighterName}>{fighter.name}</Text>
                <Text style={styles.fighterRecord}>{fighter.record}</Text>
                <Text style={styles.fighterWeight}>{fighter.weight}</Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('FighterDetail', { fighterId: fighter.id })}>
                Profil
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e5e7eb',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    borderLeftWidth: 4,
    backgroundColor: '#1f2937',
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9fafb',
    marginTop: 8,
  },
  eventCard: {
    marginBottom: 12,
    backgroundColor: '#1f2937',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f9fafb',
  },
  eventLocation: {
    fontSize: 14,
    color: '#9ca3af',
  },
  fighterCard: {
    marginBottom: 12,
    backgroundColor: '#1f2937',
  },
  fighterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fighterInfo: {
    marginLeft: 16,
    flex: 1,
  },
  fighterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f9fafb',
  },
  fighterRecord: {
    fontSize: 14,
    color: '#10b981',
    marginTop: 2,
  },
  fighterWeight: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
});

export default HomeScreen;
