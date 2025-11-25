import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Image } from 'react-native';
import { Text, Card, Button, Chip, Divider, ActivityIndicator, IconButton, List } from 'react-native-paper';
import { useQuery } from 'react-query';
import { apiClient } from '../services/api';
import { format } from 'date-fns';
import { sr } from 'date-fns/locale';
import { LinearGradient } from 'expo-linear-gradient';
import type { ScreenNavigationProp, ScreenRouteProp } from '../types/navigation';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
  image?: string;
  description?: string;
  fights: Fight[];
  mainEvent: Fight;
  coMainEvent?: Fight;
}

interface Fight {
  id: string;
  fighter1: {
    name: string;
    record: string;
    image?: string;
  };
  fighter2: {
    name: string;
    record: string;
    image?: string;
  };
  weightClass: string;
  rounds: number;
  isMainEvent: boolean;
  isCoMainEvent: boolean;
  result?: {
    winner: 'fighter1' | 'fighter2' | 'draw' | 'nc';
    method: string;
    round: number;
    time: string;
  };
}

type FightResultWinner = 'fighter1' | 'fighter2' | 'draw' | 'nc';

type EventDetailScreenProps = {
  navigation: ScreenNavigationProp<'EventDetail'>;
  route: ScreenRouteProp<'EventDetail'>;
};

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [isWatching, setIsWatching] = useState(false);

  const { data: event, isLoading, error } = useQuery<Event>(
    ['event', eventId],
    async () => {
      const response = await apiClient.get(`/events/${eventId}`);
      return response.data.data;
    }
  );

  const handleWatch = () => {
    setIsWatching(!isWatching);
    // TODO: Implement watch functionality
  };

  const handleShare = () => {
    // TODO: Implement share functionality
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming': return '#3b82f6';
      case 'live': return '#ef4444';
      case 'completed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: Event['status']) => {
    switch (status) {
      case 'upcoming': return 'Predstojeći';
      case 'live': return 'U toku';
      case 'completed': return 'Završen';
      default: return status;
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd. MMMM yyyy, HH:mm', { locale: sr });
  };

  const getResultColor = (winner: FightResultWinner) => {
    switch (winner) {
      case 'fighter1': return '#10b981';
      case 'fighter2': return '#ef4444';
      case 'draw': return '#f59e0b';
      case 'nc': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getResultText = (winner: FightResultWinner) => {
    switch (winner) {
      case 'fighter1': return 'Pobeda 1';
      case 'fighter2': return 'Pobeda 2';
      case 'draw': return 'Nerešeno';
      case 'nc': return 'Bez rezultata';
      default: return winner;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Učitavanje događaja...</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Greška pri učitavanju događaja</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Nazad
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        {event.image ? (
          <Image source={{ uri: event.image }} style={styles.eventImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>MMA Event</Text>
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.imageGradient}
        />
        
        <View style={styles.headerActions}>
          <IconButton
            icon="share"
            size={24}
            onPress={handleShare}
            iconColor="#ffffff"
            style={styles.actionButton}
          />
          <IconButton
            icon={isWatching ? "eye" : "eye-outline"}
            size={24}
            onPress={handleWatch}
            iconColor={isWatching ? "#10b981" : "#ffffff"}
            style={styles.actionButton}
          />
        </View>
      </View>

      {/* Event Info */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Chip 
              mode="flat"
              textStyle={{ color: '#ffffff', fontWeight: 'bold' }}
              style={{ backgroundColor: getStatusColor(event.status) }}
            >
              {getStatusText(event.status)}
            </Chip>
          </View>
          
          <View style={styles.eventDetails}>
            <List.Item
              title="Datum i vreme"
              description={formatEventDate(event.date)}
              left={(props) => <List.Icon {...props} icon="calendar" />}
              titleStyle={styles.detailTitle}
              descriptionStyle={styles.detailDescription}
            />
            <List.Item
              title="Lokacija"
              description={`${event.venue}, ${event.location}`}
              left={(props) => <List.Icon {...props} icon="map-marker" />}
              titleStyle={styles.detailTitle}
              descriptionStyle={styles.detailDescription}
            />
          </View>

          {event.description && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.descriptionTitle}>Opis</Text>
              <Text style={styles.descriptionText}>{event.description}</Text>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Main Event */}
      {event.mainEvent && (
        <Card style={styles.mainEventCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Glavna borba</Text>
            <View style={styles.fightCard}>
              <View style={styles.fighter}>
                <Image 
                  source={{ uri: event.mainEvent.fighter1.image || 'https://via.placeholder.com/60' }} 
                  style={styles.fighterImage}
                />
                <Text style={styles.fighterName}>{event.mainEvent.fighter1.name}</Text>
                <Text style={styles.fighterRecord}>{event.mainEvent.fighter1.record}</Text>
              </View>
              
              <View style={styles.vsContainer}>
                <Text style={styles.vsText}>VS</Text>
                <Text style={styles.weightClass}>{event.mainEvent.weightClass}</Text>
                {event.mainEvent.result && (
                  <Chip
                    mode="flat"
                    textStyle={{ color: '#ffffff', fontSize: 10 }}
                    style={{ 
                      backgroundColor: getResultColor(event.mainEvent.result.winner),
                      marginTop: 4
                    }}
                  >
                    {getResultText(event.mainEvent.result.winner)}
                  </Chip>
                )}
              </View>
              
              <View style={styles.fighter}>
                <Image 
                  source={{ uri: event.mainEvent.fighter2.image || 'https://via.placeholder.com/60' }} 
                  style={styles.fighterImage}
                />
                <Text style={styles.fighterName}>{event.mainEvent.fighter2.name}</Text>
                <Text style={styles.fighterRecord}>{event.mainEvent.fighter2.record}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Co-Main Event */}
      {event.coMainEvent && (
        <Card style={styles.coMainEventCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Co-Main Event</Text>
            <View style={styles.fightCard}>
              <View style={styles.fighter}>
                <Image 
                  source={{ uri: event.coMainEvent.fighter1.image || 'https://via.placeholder.com/60' }} 
                  style={styles.fighterImage}
                />
                <Text style={styles.fighterName}>{event.coMainEvent.fighter1.name}</Text>
                <Text style={styles.fighterRecord}>{event.coMainEvent.fighter1.record}</Text>
              </View>
              
              <View style={styles.vsContainer}>
                <Text style={styles.vsText}>VS</Text>
                <Text style={styles.weightClass}>{event.coMainEvent.weightClass}</Text>
                {event.coMainEvent.result && (
                  <Chip
                    mode="flat"
                    textStyle={{ color: '#ffffff', fontSize: 10 }}
                    style={{ 
                      backgroundColor: getResultColor(event.coMainEvent.result.winner),
                      marginTop: 4
                    }}
                  >
                    {getResultText(event.coMainEvent.result.winner)}
                  </Chip>
                )}
              </View>
              
              <View style={styles.fighter}>
                <Image 
                  source={{ uri: event.coMainEvent.fighter2.image || 'https://via.placeholder.com/60' }} 
                  style={styles.fighterImage}
                />
                <Text style={styles.fighterName}>{event.coMainEvent.fighter2.name}</Text>
                <Text style={styles.fighterRecord}>{event.coMainEvent.fighter2.record}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Fight Card */}
      <Card style={styles.fightCardList}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Kompletna karta borbi</Text>
          {event.fights?.map((fight, index) => (
            <View key={fight.id}>
              <View style={styles.fightItem}>
                <View style={styles.fightInfo}>
                  <Text style={styles.fightTitle}>
                    {fight.fighter1.name} vs {fight.fighter2.name}
                  </Text>
                  <Text style={styles.fightWeightClass}>{fight.weightClass}</Text>
                  <Text style={styles.fightRounds}>{fight.rounds} runda</Text>
                </View>
                <View style={styles.fightResult}>
                  {fight.result ? (
                    <Chip
                      mode="flat"
                      textStyle={{ color: '#ffffff', fontSize: 12 }}
                      style={{ 
                        backgroundColor: getResultColor(fight.result.winner)
                      }}
                    >
                      {getResultText(fight.result.winner)}
                    </Chip>
                  ) : (
                    <Text style={styles.fightPending}>TBD</Text>
                  )}
                </View>
              </View>
              {index < event.fights.length - 1 && <Divider style={styles.fightDivider} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={handleWatch}
          style={[styles.actionButton, { backgroundColor: isWatching ? '#ef4444' : '#10b981' }]}
          contentStyle={styles.buttonContent}
        >
          {isWatching ? 'Ne prati' : 'Prati'}
        </Button>
        <Button
          mode="outlined"
          onPress={handleShare}
          style={styles.actionButton}
          contentStyle={styles.buttonContent}
        >
          Podeli
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  loadingText: {
    marginTop: 16,
    color: '#9ca3af',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  headerActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginLeft: 8,
  },
  infoCard: {
    margin: 16,
    marginTop: -40,
    backgroundColor: '#1f2937',
    zIndex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f9fafb',
    flex: 1,
    marginRight: 12,
  },
  eventDetails: {
    marginBottom: 16,
  },
  detailTitle: {
    color: '#9ca3af',
    fontSize: 14,
  },
  detailDescription: {
    color: '#f9fafb',
    fontSize: 16,
  },
  divider: {
    backgroundColor: '#374151',
    marginVertical: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
  mainEventCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1f2937',
    borderWidth: 2,
    borderColor: '#10b981',
  },
  coMainEventCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  fightCardList: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1f2937',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 16,
  },
  fightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fighter: {
    flex: 1,
    alignItems: 'center',
  },
  fighterImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  fighterName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f9fafb',
    textAlign: 'center',
    marginBottom: 4,
  },
  fighterRecord: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  vsContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  weightClass: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  fightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  fightInfo: {
    flex: 1,
  },
  fightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 4,
  },
  fightWeightClass: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 2,
  },
  fightRounds: {
    fontSize: 12,
    color: '#6b7280',
  },
  fightResult: {
    alignItems: 'flex-end',
  },
  fightPending: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  fightDivider: {
    backgroundColor: '#374151',
    marginVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default EventDetailScreen;
