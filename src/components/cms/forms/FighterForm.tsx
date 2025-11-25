import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FighterFormData } from './types';

interface FighterFormProps {
  data: Partial<FighterFormData>;
  onChange: (field: string, value: string | boolean | File | null) => void;
}

export function FighterForm({ data, onChange }: FighterFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Ime i prezime *</Label>
          <Input
            id="name"
            value={data.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Unesite ime i prezime"
          />
        </div>
        <div>
          <Label htmlFor="record">Rezultat *</Label>
          <Input
            id="record"
            value={data.record || ''}
            onChange={(e) => onChange('record', e.target.value)}
            placeholder="npr. 27-1-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="weightClass">Kategorija *</Label>
          <Select value={data.weightClass || ''} onValueChange={(value) => onChange('weightClass', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Izaberite kategoriju" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flyweight">Flyweight</SelectItem>
              <SelectItem value="bantamweight">Bantamweight</SelectItem>
              <SelectItem value="featherweight">Featherweight</SelectItem>
              <SelectItem value="lightweight">Lightweight</SelectItem>
              <SelectItem value="welterweight">Welterweight</SelectItem>
              <SelectItem value="middleweight">Middleweight</SelectItem>
              <SelectItem value="light_heavyweight">Light Heavyweight</SelectItem>
              <SelectItem value="heavyweight">Heavyweight</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="nationality">Nacionalnost *</Label>
          <Input
            id="nationality"
            value={data.nationality || ''}
            onChange={(e) => onChange('nationality', e.target.value)}
            placeholder="npr. Srbija"
          />
        </div>
        <div>
          <Label htmlFor="age">Godine *</Label>
          <Input
            id="age"
            type="number"
            value={data.age || ''}
            onChange={(e) => onChange('age', e.target.value)}
            placeholder="28"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="height">Visina</Label>
          <Input
            id="height"
            value={data.height || ''}
            onChange={(e) => onChange('height', e.target.value)}
            placeholder="npr. 185cm"
          />
        </div>
        <div>
          <Label htmlFor="reach">Domet</Label>
          <Input
            id="reach"
            value={data.reach || ''}
            onChange={(e) => onChange('reach', e.target.value)}
            placeholder="npr. 193cm"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Biografija</Label>
        <Textarea
          id="bio"
          value={data.bio || ''}
          onChange={(e) => onChange('bio', e.target.value)}
          placeholder="Kratka biografija borca..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="fightingStyle">Stil borbe</Label>
          <Input
            id="fightingStyle"
            value={data.fightingStyle || ''}
            onChange={(e) => onChange('fightingStyle', e.target.value)}
            placeholder="npr. Striker, Grappler"
          />
        </div>
        <div>
          <Label htmlFor="gym">Gym</Label>
          <Input
            id="gym"
            value={data.gym || ''}
            onChange={(e) => onChange('gym', e.target.value)}
            placeholder="Naziv gym-a"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="coach">Trener</Label>
        <Input
          id="coach"
          value={data.coach || ''}
          onChange={(e) => onChange('coach', e.target.value)}
          placeholder="Ime trenera"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={data.isActive || false}
          onCheckedChange={(checked) => onChange('isActive', checked)}
        />
        <Label htmlFor="isActive">Aktivan borac</Label>
      </div>
    </div>
  );
}
