'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Bookmark,
  Flag,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { Post } from './types';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onFollow?: (userId: string) => void;
  onReport?: (postId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export function PostCard({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onBookmark, 
  onFollow,
  onReport,
  showActions = true,
  compact = false
}: PostCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleLike = () => {
    onLike?.(post.id);
  };

  const handleComment = () => {
    onComment?.(post.id);
  };

  const handleShare = () => {
    onShare?.(post.id);
  };

  const handleBookmark = () => {
    onBookmark?.(post.id);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow?.(post.author.id);
  };

  const handleReport = () => {
    onReport?.(post.id);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'upravo sada';
    if (diffInHours < 24) return `pre ${diffInHours}h`;
    return date.toLocaleDateString('sr-RS');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const shouldTruncate = post.content.length > 200 && !showFullContent;
  const displayContent = shouldTruncate 
    ? post.content.substring(0, 200) + '...' 
    : post.content;

  return (
    <Card className={`${compact ? 'mb-2' : 'mb-4'}`}>
      <CardContent className={`${compact ? 'p-4' : 'p-6'}`}>
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-sm">{post.author.name}</span>
              <span className="text-gray-500 text-sm">{post.author.username}</span>
              {post.author.verified && (
                <Badge variant="secondary" className="text-xs px-1">✓</Badge>
              )}
              <span className="text-gray-500 text-sm">•</span>
              <span className="text-gray-500 text-sm">{formatTime(post.timestamp)}</span>
              {post.location && (
                <>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-500 text-sm">{post.location}</span>
                </>
              )}
              <div className="ml-auto flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleFollow}
                  className="h-6 px-2 text-xs"
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="h-3 w-3 mr-1" />
                      Ne prati
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3 w-3 mr-1" />
                      Prati
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-500">
                {formatNumber(post.author.followers)} pratilaca
              </span>
            </div>
            
            {/* Content */}
            <div className="mb-3">
              <p className="text-gray-900 text-sm leading-relaxed">
                {displayContent}
                {shouldTruncate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto text-blue-600 hover:bg-transparent hover:text-blue-500"
                    onClick={() => setShowFullContent(true)}
                  >
                    ...pročitaj više
                  </Button>
                )}
              </p>
            </div>
            
            {/* Images */}
            {post.images && post.images.length > 0 && (
              <div className={`grid gap-2 mb-3 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {post.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={image} 
                      alt={`Post image ${index + 1}`}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                    {post.images && post.images.length > 4 && index === 3 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold">
                          +{post.images.length - 4} više
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Video */}
            {post.video && (
              <div className="mb-3">
                <video 
                  src={post.video} 
                  controls
                  className="rounded-lg w-full h-48 object-cover"
                />
              </div>
            )}
            
            {/* Link Preview */}
            {post.link && (
              <div className="border rounded-lg p-3 mb-3 bg-gray-50">
                <div className="flex gap-3">
                  {post.link.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={post.link.image} 
                      alt="Link preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm line-clamp-2">{post.link.title}</h4>
                    <p className="text-gray-600 text-xs line-clamp-2">{post.link.description}</p>
                    <p className="text-blue-600 text-xs truncate">{post.link.url}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Actions */}
            {showActions && (
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLike}
                    className={`${post.isLiked ? 'text-red-600' : 'text-gray-600'}`}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                    {formatNumber(post.likes)}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleComment}
                    className="text-gray-600"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {formatNumber(post.comments)}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleShare}
                    className="text-gray-600"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    {formatNumber(post.shares)}
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleBookmark}
                    className={`${post.isBookmarked ? 'text-blue-600' : 'text-gray-600'}`}
                  >
                    <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleReport}
                    className="text-gray-600"
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}