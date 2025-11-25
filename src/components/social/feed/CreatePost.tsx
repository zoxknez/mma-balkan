'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Image as ImageIcon, Video, Link as LinkIcon } from 'lucide-react';
import { Post } from '../types';

interface CreatePostProps {
  onPostCreate: (post: Post) => void;
}

export function CreatePost({ onPostCreate }: CreatePostProps) {
  const [newPost, setNewPost] = useState('');

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    
    const post: Post = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        name: 'Vi',
        username: '@your_username',
        verified: false,
        followers: 0
      },
      content: newPost,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      tags: [],
      type: 'text'
    };
    
    onPostCreate(post);
    setNewPost('');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>V</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Šta se dešava u MMA svetu?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                Objavi
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
