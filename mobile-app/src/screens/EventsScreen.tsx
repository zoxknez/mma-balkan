import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, Searchbar, Chip, Button, ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import { useQuery } from 'react-query';
import { apiClient } from '../services/api';
import { format } from 'date-fns';
import { sr } from 'date-fns/locale';
import type { ScreenNavigationProp } from '../types/navigation';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
  image?: string;
  description?: string;
  fights?: Fight[];
}

interface Fight {
  id: string;
  fighter1: string;
  fighter2: string;
  weightClass: string;
  rounds: number;
  isMainEvent: boolean;
}

type EventFilter = 'upcoming' | 'live' | 'completed' | 'all';

type EventsScreenProps = {
  navigation: ScreenNavigationProp<'Events'>;
};

const EventsScreen: React.FC<EventsScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<EventFilter>('upcoming');

  const { data: events, isLoading, error, refetch } = useQuery<Event[]>(
    ['events', searchQuery, filter],
    async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filter !== 'all') params.append('status', filter);
      
      const response = await apiClient.get(`/events?${params.toString()}`);
      return response.data.data;
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  const filteredEvents = events?.filter((event) => 
    searchQuery === '' || 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
    return format(date, 'dd. MMMM yyyy', { locale: sr });
  };

  const renderEventCard = (event: Event) => (
    <Card key={event.id} style={styles.eventCard}>
      <Card.Content>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Chip 
            mode="outlined" 
            textStyle={{ color: getStatusColor(event.status) }}
            style={{ borderColor: getStatusColor(event.status) }}
          >
            {getStatusText(event.status)}
          </Chip>
        </View>
        
        <View style={styles.eventDetails}>
          <Text style={styles.eventDate}>{formatEventDate(event.date)}</Text>
          <Text style={styles.eventLocation}>{event.venue}, {event.location}</Text>
        </View>

        {event.description && (
          <Text style={styles.eventDescription} numberOfLines={2}>
            {event.description}
          </Text>
        )}

        {event.fights && event.fights.length > 0 && (
          <View style={styles.fightsPreview}>
            <Text style={styles.fightsTitle}>Glavne borbe:</Text>
            {event.fights.slice(0, 2).map((fight, index) => (
              <Text key={index} style={styles.fightText}>
                {fight.fighter1} vs {fight.fighter2}
                {fight.isMainEvent && ' (Glavna borba)'}
              </Text>
            ))}
            {event.fights.length > 2 && (
              <Text style={styles.moreFightsText}>
                +{event.fights.length - 2} više borbi
              </Text>
            )}
          </View>
        )}
      </Card.Content>
      
      <Card.Actions>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
          style={styles.detailButton}
        >
          Detalji
        </Button>
        {event.status === 'upcoming' && (
          <Button 
            mode="outlined" 
            onPress={() => {/* Add to watchlist */}}
            style={styles.watchlistButton}
          >
            Prati
          </Button>
        )}
      </Card.Actions>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Učitavanje događaja...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Greška pri učitavanju događaja</Text>
        <Button mode="contained" onPress={() => refetch()}>
          Pokušaj ponovo
        </Button>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      {/* Search */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Pretraži događaje..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={(value) => setFilter(value as EventFilter)}
          buttons={[
            { value: 'upcoming', label: 'Predstojeći' },
            { value: 'live', label: 'U toku' },
            { value: 'completed', label: 'Završeni' },
            { value: 'all', label: 'Svi' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Events List */}
      <View style={styles.eventsList}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map(renderEventCard)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nema događaja koji odgovaraju vašoj pretrazi</Text>
          </View>
        )}
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
  searchContainer: {
    padding: 16,
  },
  searchbar: {
    backgroundColor: '#1f2937',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  segmentedButtons: {
    backgroundColor: '#1f2937',
  },
  eventsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  eventCard: {
    marginBottom: 16,
    backgroundColor: '#1f2937',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f9fafb',
    flex: 1,
    marginRight: 12,
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventDate: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#9ca3af',
  },
  eventDescription: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 12,
    lineHeight: 20,
  },
  fightsPreview: {
    marginBottom: 12,
  },
  fightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 8,
  },
  fightText: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 4,
  },
  moreFightsText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  detailButton: {
    backgroundColor: '#10b981',
  },
  watchlistButton: {
    borderColor: '#3b82f6',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EventsScreen;
