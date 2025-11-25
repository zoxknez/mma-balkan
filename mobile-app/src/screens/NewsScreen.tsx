import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl, Image } from 'react-native';
import { Text, Card, Searchbar, Chip, Button, ActivityIndicator } from 'react-native-paper';
import { useQuery } from 'react-query';
import { apiClient } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { sr } from 'date-fns/locale';
import type { ScreenNavigationProp } from '../types/navigation';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  image?: string;
  isBreaking: boolean;
  isFeatured: boolean;
  readTime: number;
}

type CategoryFilter = 'all' | 'news' | 'analysis' | 'interviews' | 'results' | 'transfers';

type NewsScreenProps = {
  navigation: ScreenNavigationProp<'News'>;
};

const NewsScreen: React.FC<NewsScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const categories: { label: string; value: CategoryFilter }[] = [
    { label: 'Sve', value: 'all' },
    { label: 'Vesti', value: 'news' },
    { label: 'Analize', value: 'analysis' },
    { label: 'Intervjui', value: 'interviews' },
    { label: 'Rezultati', value: 'results' },
    { label: 'Transferi', value: 'transfers' },
  ];

  const { data: articles, isLoading, error, refetch } = useQuery<NewsArticle[]>(
    ['news', searchQuery, category],
    async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (category !== 'all') params.append('category', category);
      
      const response = await apiClient.get(`/news?${params.toString()}`);
      return response.data.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const filteredArticles = articles?.filter((article) => 
    searchQuery === '' || 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const formatPublishDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: sr });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'news': '#3b82f6',
      'analysis': '#8b5cf6',
      'interviews': '#10b981',
      'results': '#f59e0b',
      'transfers': '#ef4444',
    };
    return colors[category] || '#6b7280';
  };

  const renderArticleCard = (article: NewsArticle, isFeatured = false) => (
    <Card 
      key={article.id} 
      style={[
        styles.articleCard, 
        isFeatured && styles.featuredCard
      ]}
    >
      {article.image && (
        <Image source={{ uri: article.image }} style={styles.articleImage} />
      )}
      
      <Card.Content style={styles.articleContent}>
        <View style={styles.articleHeader}>
          <Chip 
            mode="outlined" 
            compact
            textStyle={{ 
              color: getCategoryColor(article.category),
              fontSize: 12 
            }}
            style={{ 
              borderColor: getCategoryColor(article.category),
              marginBottom: 8 
            }}
          >
            {article.category}
          </Chip>
          
          {article.isBreaking && (
            <Chip 
              mode="flat" 
              compact
              textStyle={{ color: '#ffffff', fontSize: 12 }}
              style={{ backgroundColor: '#ef4444', marginLeft: 8 }}
            >
              BREAKING
            </Chip>
          )}
        </View>

        <Text style={styles.articleTitle} numberOfLines={isFeatured ? 3 : 2}>
          {article.title}
        </Text>
        
        <Text style={styles.articleExcerpt} numberOfLines={3}>
          {article.excerpt}
        </Text>

        <View style={styles.articleMeta}>
          <Text style={styles.articleAuthor}>{article.author}</Text>
          <Text style={styles.articleDate}>{formatPublishDate(article.publishedAt)}</Text>
          <Text style={styles.readTime}>{article.readTime} min čitanja</Text>
        </View>

        {article.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {article.tags.slice(0, 3).map((tag, index) => (
              <Chip 
                key={index} 
                mode="outlined" 
                compact
                textStyle={{ fontSize: 10 }}
                style={styles.tag}
              >
                {tag}
              </Chip>
            ))}
            {article.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{article.tags.length - 3}</Text>
            )}
          </View>
        )}
      </Card.Content>
      
      <Card.Actions>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('NewsDetail', { articleId: article.id })}
          style={styles.readButton}
        >
          Pročitaj
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => {/* Share functionality */}}
          style={styles.shareButton}
        >
          Podeli
        </Button>
      </Card.Actions>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Učitavanje vesti...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Greška pri učitavanju vesti</Text>
        <Button mode="contained" onPress={() => refetch()}>
          Pokušaj ponovo
        </Button>
      </View>
    );
  }

  const featuredArticles = filteredArticles.filter((article) => article.isFeatured);
  const regularArticles = filteredArticles.filter((article) => !article.isFeatured);

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
          placeholder="Pretraži vesti..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((cat) => (
            <Chip
              key={cat.value}
              selected={category === cat.value}
              onPress={() => setCategory(cat.value)}
              style={[
                styles.categoryChip,
                category === cat.value && styles.selectedCategoryChip
              ]}
              textStyle={[
                styles.categoryChipText,
                category === cat.value && styles.selectedCategoryChipText
              ]}
            >
              {cat.label}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Istaknute vesti</Text>
          {featuredArticles.map((article: NewsArticle) => renderArticleCard(article, true))}
        </View>
      )}

      {/* Regular Articles */}
      <View style={styles.articlesList}>
        {regularArticles.length > 0 ? (
          regularArticles.map((article: NewsArticle) => renderArticleCard(article))
        ) : filteredArticles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nema vesti koje odgovaraju vašoj pretrazi</Text>
          </View>
        ) : null}
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
    marginBottom: 16,
  },
  categoryContainer: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#374151',
  },
  selectedCategoryChip: {
    backgroundColor: '#10b981',
  },
  categoryChipText: {
    color: '#9ca3af',
  },
  selectedCategoryChipText: {
    color: '#ffffff',
  },
  featuredSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 16,
  },
  articlesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  articleCard: {
    marginBottom: 16,
    backgroundColor: '#1f2937',
  },
  featuredCard: {
    borderWidth: 1,
    borderColor: '#10b981',
  },
  articleImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  articleContent: {
    padding: 16,
  },
  articleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 8,
    lineHeight: 24,
  },
  articleExcerpt: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 12,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  articleAuthor: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  articleDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 8,
  },
  readTime: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    marginRight: 6,
    marginBottom: 4,
    backgroundColor: '#374151',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  readButton: {
    backgroundColor: '#10b981',
  },
  shareButton: {
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

export default NewsScreen;
