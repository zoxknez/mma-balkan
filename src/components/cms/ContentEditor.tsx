'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Save, 
  Upload, 
  X
} from 'lucide-react';
import { FighterForm } from './forms/FighterForm';
import { EventForm } from './forms/EventForm';
import { NewsForm } from './forms/NewsForm';
import { ContentFormData, FighterFormData, EventFormData, NewsFormData } from './forms/types';

interface ContentEditorProps {
  type: 'fighter' | 'event' | 'news';
  initialData?: Partial<ContentFormData>;
  onSave: (data: ContentFormData) => void;
  onCancel: () => void;
}

export function ContentEditor({ type, initialData, onSave, onCancel }: ContentEditorProps) {
  const [formData, setFormData] = useState(initialData || getDefaultData());
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function getDefaultData() {
    switch (type) {
      case 'fighter':
        return {
          name: '',
          record: '',
          weightClass: '',
          nationality: '',
          age: '',
          height: '',
          reach: '',
          bio: '',
          fightingStyle: '',
          gym: '',
          coach: '',
          isActive: true,
          image: null
        };
      case 'event':
        return {
          title: '',
          date: '',
          location: '',
          venue: '',
          description: '',
          status: 'upcoming',
          image: null,
          ticketPrice: '',
          ticketUrl: '',
          streamUrl: ''
        };
      case 'news':
        return {
          title: '',
          content: '',
          excerpt: '',
          category: '',
          tags: [],
          isBreaking: false,
          isFeatured: false,
          image: null
        };
      default:
        return {};
    }
  }

  const handleInputChange = (field: string, value: string | boolean | File | null | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, image: e.target?.result as string }));
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(formData as ContentFormData);
    setIsDirty(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {initialData ? 'Izmeni' : 'Kreiraj'} {type === 'fighter' ? 'borca' : type === 'event' ? 'događaj' : 'vest'}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Otkaži
              </Button>
              <Button onClick={handleSave} disabled={!isDirty}>
                <Save className="h-4 w-4 mr-2" />
                Sačuvaj
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label>Slika</Label>
              <div className="mt-2">
                {formData.image ? (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={formData.image as string} 
                      alt="Preview" 
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="solid"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => handleInputChange('image', null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Dodaj sliku</p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Form Content */}
            {type === 'fighter' && (
              <FighterForm 
                data={formData as Partial<FighterFormData>} 
                onChange={handleInputChange} 
              />
            )}
            {type === 'event' && (
              <EventForm 
                data={formData as Partial<EventFormData>} 
                onChange={handleInputChange} 
              />
            )}
            {type === 'news' && (
              <NewsForm 
                data={formData as Partial<NewsFormData>} 
                onChange={handleInputChange} 
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
