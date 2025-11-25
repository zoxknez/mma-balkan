import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventFormData } from './types';

interface EventFormProps {
  data: Partial<EventFormData>;
  onChange: (field: string, value: string | boolean | File | null) => void;
}

export function EventForm({ data, onChange }: EventFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Naziv događaja *</Label>
        <Input
          id="title"
          value={data.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Unesite naziv događaja"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="date">Datum i vreme *</Label>
          <Input
            id="date"
            type="datetime-local"
            value={data.date || ''}
            onChange={(e) => onChange('date', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={data.status || ''} onValueChange={(value) => onChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Predstojeći</SelectItem>
              <SelectItem value="live">U toku</SelectItem>
              <SelectItem value="completed">Završen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="venue">Lokacija *</Label>
          <Input
            id="venue"
            value={data.venue || ''}
            onChange={(e) => onChange('venue', e.target.value)}
            placeholder="npr. T-Mobile Arena"
          />
        </div>
        <div>
          <Label htmlFor="location">Grad *</Label>
          <Input
            id="location"
            value={data.location || ''}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder="npr. Las Vegas, NV"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Opis</Label>
        <Textarea
          id="description"
          value={data.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Opis događaja..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="ticketPrice">Cena karata</Label>
          <Input
            id="ticketPrice"
            type="number"
            value={data.ticketPrice || ''}
            onChange={(e) => onChange('ticketPrice', e.target.value)}
            placeholder="100"
          />
        </div>
        <div>
          <Label htmlFor="ticketUrl">Link za karte</Label>
          <Input
            id="ticketUrl"
            value={data.ticketUrl || ''}
            onChange={(e) => onChange('ticketUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div>
          <Label htmlFor="streamUrl">Link za stream</Label>
          <Input
            id="streamUrl"
            value={data.streamUrl || ''}
            onChange={(e) => onChange('streamUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>
    </div>
  );
}
