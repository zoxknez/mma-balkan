import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Image, Share } from 'react-native';
import { Text, Card, Button, Chip, Divider, ActivityIndicator, IconButton } from 'react-native-paper';
import { useQuery } from 'react-query';
import { apiClient } from '../services/api';
import { format } from 'date-fns';
import { sr } from 'date-fns/locale';
import type { ScreenNavigationProp, ScreenRouteProp } from '../types/navigation';

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
  views: number;
  likes: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  publishedAt: string;
  likes: number;
  replies: Comment[];
}

type NewsDetailScreenProps = {
  navigation: ScreenNavigationProp<'NewsDetail'>;
  route: ScreenRouteProp<'NewsDetail'>;
};

const NewsDetailScreen: React.FC<NewsDetailScreenProps> = ({ route, navigation }) => {
  const { articleId } = route.params;
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const { data: article, isLoading, error } = useQuery<NewsArticle>(
    ['news', articleId],
    async () => {
      const response = await apiClient.get(`/news/${articleId}`);
      return response.data.data;
    }
  );

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Pogledajte ovu vest: ${article?.title}`,
        url: `https://mmabalkan.com/news/${articleId}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBookmark = () => {
    // TODO: Implement bookmark functionality
  };

  const formatPublishDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd. MMMM yyyy, HH:mm', { locale: sr });
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Učitavanje vesti...</Text>
      </View>
    );
  }

  if (error || !article) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Greška pri učitavanju vesti</Text>
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
        {article.image ? (
          <Image source={{ uri: article.image }} style={styles.articleImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>MMA News</Text>
          </View>
        )}
        
        <View style={styles.headerActions}>
          <IconButton
            icon="share"
            size={24}
            onPress={handleShare}
            iconColor="#ffffff"
            style={styles.actionButton}
          />
          <IconButton
            icon="bookmark-outline"
            size={24}
            onPress={handleBookmark}
            iconColor="#ffffff"
            style={styles.actionButton}
          />
        </View>

        {article.isBreaking && (
          <View style={styles.breakingBadge}>
            <Text style={styles.breakingText}>BREAKING</Text>
          </View>
        )}
      </View>

      {/* Article Info */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.articleHeader}>
            <Chip 
              mode="outlined" 
              textStyle={{ color: getCategoryColor(article.category) }}
              style={{ borderColor: getCategoryColor(article.category) }}
            >
              {article.category}
            </Chip>
            <Text style={styles.publishDate}>{formatPublishDate(article.publishedAt)}</Text>
          </View>

          <Text style={styles.articleTitle}>{article.title}</Text>
          
          <Text style={styles.articleExcerpt}>{article.excerpt}</Text>

          <View style={styles.articleMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Autor</Text>
              <Text style={styles.metaValue}>{article.author}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Vreme čitanja</Text>
              <Text style={styles.metaValue}>{article.readTime} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Pregledi</Text>
              <Text style={styles.metaValue}>{article.views}</Text>
            </View>
          </View>

          {article.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsTitle}>Tagovi:</Text>
              <View style={styles.tagsList}>
                {article.tags.map((tag, index) => (
                  <Chip 
                    key={index} 
                    mode="outlined" 
                    compact
                    textStyle={{ fontSize: 12 }}
                    style={styles.tag}
                  >
                    {tag}
                  </Chip>
                ))}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Article Content */}
      <Card style={styles.contentCard}>
        <Card.Content>
          <Text style={styles.contentTitle}>Sadržaj</Text>
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>{article.content}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <View style={styles.actionButtons}>
            <Button
              mode={isLiked ? "contained" : "outlined"}
              onPress={handleLike}
              icon={isLiked ? "heart" : "heart-outline"}
              style={[styles.actionButton, isLiked && { backgroundColor: '#ef4444' }]}
              textColor={isLiked ? '#ffffff' : '#ef4444'}
            >
              {article.likes + (isLiked ? 1 : 0)}
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => setShowComments(!showComments)}
              icon="comment-outline"
              style={styles.actionButton}
              textColor="#3b82f6"
            >
              {article.comments.length}
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleShare}
              icon="share"
              style={styles.actionButton}
              textColor="#10b981"
            >
              Podeli
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Comments */}
      {showComments && (
        <Card style={styles.commentsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Komentari ({article.comments.length})</Text>
            
            {article.comments.length > 0 ? (
              article.comments.map((comment, index) => (
                <View key={comment.id}>
                  <View style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{comment.author}</Text>
                      <Text style={styles.commentDate}>
                        {format(new Date(comment.publishedAt), 'dd.MM.yyyy HH:mm')}
                      </Text>
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                    <View style={styles.commentActions}>
                      <Button
                        mode="text"
                        icon="thumb-up-outline"
                        textColor="#9ca3af"
                        compact
                      >
                        {comment.likes}
                      </Button>
                      <Button
                        mode="text"
                        textColor="#9ca3af"
                        compact
                      >
                        Odgovori
                      </Button>
                    </View>
                  </View>
                  {index < article.comments.length - 1 && <Divider style={styles.commentDivider} />}
                </View>
              ))
            ) : (
              <Text style={styles.noComments}>Nema komentara</Text>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Related Articles */}
      <Card style={styles.relatedCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Srodne vesti</Text>
          <Text style={styles.relatedText}>Funkcionalnost srodnih vesti će biti dodana u sledećoj verziji</Text>
        </Card.Content>
      </Card>
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
  articleImage: {
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
  breakingBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  breakingText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoCard: {
    margin: 16,
    marginTop: -40,
    backgroundColor: '#1f2937',
    zIndex: 1,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  publishDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 12,
    lineHeight: 32,
  },
  articleExcerpt: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
    marginBottom: 16,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    color: '#f9fafb',
    fontWeight: '600',
  },
  tagsContainer: {
    marginTop: 8,
  },
  tagsTitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#374151',
  },
  contentCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1f2937',
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 16,
  },
  contentContainer: {
    padding: 16,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  contentText: {
    fontSize: 16,
    color: '#f9fafb',
    lineHeight: 24,
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1f2937',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  commentsCard: {
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
  commentItem: {
    paddingVertical: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f9fafb',
  },
  commentDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  commentContent: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentDivider: {
    backgroundColor: '#374151',
    marginVertical: 8,
  },
  noComments: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    padding: 20,
  },
  relatedCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1f2937',
  },
  relatedText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default NewsDetailScreen;
