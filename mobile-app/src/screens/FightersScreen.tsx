import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, Searchbar, Chip, Avatar, Button, ActivityIndicator } from 'react-native-paper';
import { useQuery } from 'react-query';
import { apiClient } from '../services/api';
import type { ScreenNavigationProp } from '../types/navigation';

interface Fighter {
  id: string;
  name: string;
  record: string;
  weightClass: string;
  nationality: string;
  age: number;
  height: string;
  reach: string;
  image?: string;
  isActive: boolean;
}

type FightersScreenProps = {
  navigation: ScreenNavigationProp<'Fighters'>;
};

type WeightClassFilter = Fighter['weightClass'] | 'all';

const FightersScreen: React.FC<FightersScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeightClass, setSelectedWeightClass] = useState<WeightClassFilter>('all');

  const weightClasses: { label: string; value: WeightClassFilter }[] = [
    { label: 'Svi', value: 'all' },
    { label: 'Flyweight', value: 'flyweight' },
    { label: 'Bantamweight', value: 'bantamweight' },
    { label: 'Featherweight', value: 'featherweight' },
    { label: 'Lightweight', value: 'lightweight' },
    { label: 'Welterweight', value: 'welterweight' },
    { label: 'Middleweight', value: 'middleweight' },
    { label: 'Light Heavyweight', value: 'light_heavyweight' },
    { label: 'Heavyweight', value: 'heavyweight' },
  ];

  const { data: fighters, isLoading, error, refetch } = useQuery<Fighter[]>(
    ['fighters', searchQuery, selectedWeightClass],
    async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedWeightClass !== 'all') params.append('weightClass', selectedWeightClass);
      
      const response = await apiClient.get(`/fighters?${params.toString()}`);
      return response.data.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const filteredFighters = fighters?.filter((fighter) => 
    fighter.isActive && 
    (searchQuery === '' || 
     fighter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     fighter.nationality.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const renderFighterCard = (fighter: Fighter) => (
    <Card key={fighter.id} style={styles.fighterCard}>
      <Card.Content style={styles.fighterContent}>
        <Avatar.Text 
          size={60} 
          label={fighter.name.split(' ').map(n => n[0]).join('')}
          style={styles.avatar}
        />
        <View style={styles.fighterInfo}>
          <Text style={styles.fighterName}>{fighter.name}</Text>
          <Text style={styles.fighterRecord}>{fighter.record}</Text>
          <View style={styles.fighterDetails}>
            <Chip mode="outlined" compact style={styles.chip}>
              {fighter.weightClass}
            </Chip>
            <Chip mode="outlined" compact style={styles.chip}>
              {fighter.nationality}
            </Chip>
          </View>
          <Text style={styles.fighterStats}>
            {fighter.age} god • {fighter.height} • {fighter.reach}
          </Text>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('FighterDetail', { fighterId: fighter.id })}
          style={styles.detailButton}
        >
          Profil
        </Button>
      </Card.Actions>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Učitavanje boraca...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Greška pri učitavanju boraca</Text>
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
          placeholder="Pretraži borce..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {/* Weight Class Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.chipContainer}
        contentContainerStyle={styles.chipContent}
      >
        {weightClasses.map((weightClass) => (
          <Chip
            key={weightClass.value}
            selected={selectedWeightClass === weightClass.value}
            onPress={() => setSelectedWeightClass(weightClass.value)}
            style={[
              styles.weightChip,
              selectedWeightClass === weightClass.value && styles.selectedChip
            ]}
            textStyle={[
              styles.chipText,
              selectedWeightClass === weightClass.value && styles.selectedChipText
            ]}
          >
            {weightClass.label}
          </Chip>
        ))}
      </ScrollView>

      {/* Fighters List */}
      <View style={styles.fightersList}>
        {filteredFighters.length > 0 ? (
          filteredFighters.map(renderFighterCard)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nema boraca koji odgovaraju vašoj pretrazi</Text>
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
  chipContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  chipContent: {
    paddingRight: 16,
  },
  weightChip: {
    marginRight: 8,
    backgroundColor: '#374151',
  },
  selectedChip: {
    backgroundColor: '#10b981',
  },
  chipText: {
    color: '#9ca3af',
  },
  selectedChipText: {
    color: '#ffffff',
  },
  fightersList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  fighterCard: {
    marginBottom: 16,
    backgroundColor: '#1f2937',
  },
  fighterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    backgroundColor: '#10b981',
  },
  fighterInfo: {
    flex: 1,
    marginLeft: 16,
  },
  fighterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 4,
  },
  fighterRecord: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
    marginBottom: 8,
  },
  fighterDetails: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  chip: {
    marginRight: 8,
    backgroundColor: '#374151',
  },
  fighterStats: {
    fontSize: 12,
    color: '#9ca3af',
  },
  detailButton: {
    backgroundColor: '#10b981',
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

export default FightersScreen;
