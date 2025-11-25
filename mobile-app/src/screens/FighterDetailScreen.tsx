import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Image } from 'react-native';
import { Text, Card, Button, Chip, Divider, ActivityIndicator, IconButton } from 'react-native-paper';
import { useQuery } from 'react-query';
import { apiClient } from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import type { ScreenNavigationProp, ScreenRouteProp } from '../types/navigation';

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
  bio?: string;
  fightingStyle?: string;
  gym?: string;
  coach?: string;
  stats: {
    wins: number;
    losses: number;
    draws: number;
    noContests: number;
    knockouts: number;
    submissions: number;
    decisions: number;
  };
  recentFights: Fight[];
}

interface Fight {
  id: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw' | 'nc';
  method: string;
  round: number;
  date: string;
  event: string;
}

type FighterDetailScreenProps = {
  navigation: ScreenNavigationProp<'FighterDetail'>;
  route: ScreenRouteProp<'FighterDetail'>;
};

const FighterDetailScreen: React.FC<FighterDetailScreenProps> = ({ route, navigation }) => {
  const { fighterId } = route.params;
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: fighter, isLoading, error } = useQuery<Fighter>(
    ['fighter', fighterId],
    async () => {
      const response = await apiClient.get(`/fighters/${fighterId}`);
      return response.data.data;
    }
  );

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow functionality
  };

  const handleShare = () => {
    // TODO: Implement share functionality
  };

  const getResultColor = (result: Fight['result']) => {
    switch (result) {
      case 'win': return '#10b981';
      case 'loss': return '#ef4444';
      case 'draw': return '#f59e0b';
      case 'nc': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getResultText = (result: Fight['result']) => {
    switch (result) {
      case 'win': return 'Pobeda';
      case 'loss': return 'Poraz';
      case 'draw': return 'Nerešeno';
      case 'nc': return 'Bez rezultata';
      default: return result;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Učitavanje borca...</Text>
      </View>
    );
  }

  if (error || !fighter) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Greška pri učitavanju borca</Text>
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
        {fighter.image ? (
          <Image source={{ uri: fighter.image }} style={styles.fighterImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              {fighter.name.split(' ').map(n => n[0]).join('')}
            </Text>
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
            icon={isFollowing ? "heart" : "heart-outline"}
            size={24}
            onPress={handleFollow}
            iconColor={isFollowing ? "#ef4444" : "#ffffff"}
            style={styles.actionButton}
          />
        </View>
      </View>

      {/* Fighter Info */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.fighterHeader}>
            <Text style={styles.fighterName}>{fighter.name}</Text>
            <Chip mode="outlined" textStyle={{ color: '#10b981' }}>
              {fighter.weightClass}
            </Chip>
          </View>
          
          <Text style={styles.fighterRecord}>{fighter.record}</Text>
          
          <View style={styles.fighterDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Nacionalnost</Text>
              <Text style={styles.detailValue}>{fighter.nationality}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Godine</Text>
              <Text style={styles.detailValue}>{fighter.age}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Visina</Text>
              <Text style={styles.detailValue}>{fighter.height}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Domet</Text>
              <Text style={styles.detailValue}>{fighter.reach}</Text>
            </View>
          </View>

          {fighter.bio && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.bioTitle}>Biografija</Text>
              <Text style={styles.bioText}>{fighter.bio}</Text>
            </>
          )}

          {fighter.fightingStyle && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.bioTitle}>Stil borbe</Text>
              <Text style={styles.bioText}>{fighter.fightingStyle}</Text>
            </>
          )}

          {fighter.gym && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.bioTitle}>Gym</Text>
              <Text style={styles.bioText}>{fighter.gym}</Text>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Stats */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Statistika</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{fighter.stats.wins}</Text>
              <Text style={styles.statLabel}>Pobede</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{fighter.stats.losses}</Text>
              <Text style={styles.statLabel}>Porazi</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{fighter.stats.draws}</Text>
              <Text style={styles.statLabel}>Nerešeno</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{fighter.stats.knockouts}</Text>
              <Text style={styles.statLabel}>KO/TKO</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{fighter.stats.submissions}</Text>
              <Text style={styles.statLabel}>Submission</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{fighter.stats.decisions}</Text>
              <Text style={styles.statLabel}>Odluka</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Fights */}
      <Card style={styles.fightsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Poslednje borbe</Text>
          {fighter.recentFights?.map((fight, index) => (
            <View key={fight.id}>
              <View style={styles.fightItem}>
                <View style={styles.fightInfo}>
                  <Text style={styles.fightOpponent}>{fight.opponent}</Text>
                  <Text style={styles.fightEvent}>{fight.event}</Text>
                  <Text style={styles.fightDate}>{fight.date}</Text>
                </View>
                <View style={styles.fightResult}>
                  <Chip
                    mode="flat"
                    textStyle={{ 
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}
                    style={{ 
                      backgroundColor: getResultColor(fight.result)
                    }}
                  >
                    {getResultText(fight.result)}
                  </Chip>
                  <Text style={styles.fightMethod}>
                    {fight.method} {fight.round && `R${fight.round}`}
                  </Text>
                </View>
              </View>
              {index < fighter.recentFights.length - 1 && <Divider style={styles.fightDivider} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={handleFollow}
          style={[styles.actionButton, { backgroundColor: isFollowing ? '#ef4444' : '#10b981' }]}
          contentStyle={styles.buttonContent}
        >
          {isFollowing ? 'Ne prati' : 'Prati'}
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
    height: 300,
    position: 'relative',
  },
  fighterImage: {
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
    fontSize: 48,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
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
    marginTop: -50,
    backgroundColor: '#1f2937',
    zIndex: 1,
  },
  fighterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fighterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f9fafb',
    flex: 1,
  },
  fighterRecord: {
    fontSize: 20,
    color: '#10b981',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  fighterDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  detailItem: {
    width: '50%',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#f9fafb',
    fontWeight: '600',
  },
  divider: {
    backgroundColor: '#374151',
    marginVertical: 16,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1f2937',
  },
  fightsCard: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
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
  fightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  fightInfo: {
    flex: 1,
  },
  fightOpponent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 4,
  },
  fightEvent: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 2,
  },
  fightDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  fightResult: {
    alignItems: 'flex-end',
  },
  fightMethod: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
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

export default FighterDetailScreen;
