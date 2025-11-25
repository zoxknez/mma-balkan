import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bold, Italic, List, Link, Image as ImageIcon, Plus, X } from 'lucide-react';
import { NewsFormData } from './types';

interface NewsFormProps {
  data: Partial<NewsFormData>;
  onChange: (field: string, value: string | boolean | File | null | string[]) => void;
}

export function NewsForm({ data, onChange }: NewsFormProps) {
  const [newTag, setNewTag] = useState('');
  const tags = data.tags || [];

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      onChange('tags', updatedTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    onChange('tags', updatedTags);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Naslov vesti *</Label>
        <Input
          id="title"
          value={data.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Unesite naslov vesti"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="category">Kategorija *</Label>
          <Select value={data.category || ''} onValueChange={(value) => onChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Izaberite kategoriju" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="news">Vesti</SelectItem>
              <SelectItem value="analysis">Analize</SelectItem>
              <SelectItem value="interviews">Intervjui</SelectItem>
              <SelectItem value="results">Rezultati</SelectItem>
              <SelectItem value="transfers">Transferi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="excerpt">Kratak opis *</Label>
          <Input
            id="excerpt"
            value={data.excerpt || ''}
            onChange={(e) => onChange('excerpt', e.target.value)}
            placeholder="Kratak opis vesti..."
          />
        </div>
      </div>

      <div>
        <Label htmlFor="content">Sadržaj *</Label>
        <div className="border rounded-lg">
          <div className="border-b p-2 flex gap-2">
            <Button variant="ghost" size="sm">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            id="content"
            value={data.content || ''}
            onChange={(e) => onChange('content', e.target.value)}
            placeholder="Napišite sadržaj vesti..."
            rows={12}
            className="border-0 resize-none"
          />
        </div>
      </div>

      <div>
        <Label>Tagovi</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Dodaj tag..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
          />
          <Button onClick={handleAddTag} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleRemoveTag(tag)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="isBreaking"
            checked={data.isBreaking || false}
            onCheckedChange={(checked) => onChange('isBreaking', checked)}
          />
          <Label htmlFor="isBreaking">Breaking vest</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="isFeatured"
            checked={data.isFeatured || false}
            onCheckedChange={(checked) => onChange('isFeatured', checked)}
          />
          <Label htmlFor="isFeatured">Istaknuta vest</Label>
        </div>
      </div>
    </div>
  );
}
