import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Sparkles, MapPin } from 'lucide-react';
import { MemorialData } from './MemorialCard';

interface MemorialFormProps {
  onSubmit: (data: Partial<MemorialData>) => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  birthDate: string;
  deathDate: string;
  memoryText: string;
  cardType: 'male' | 'female' | 'child';
  photo: FileList;
  enableGPS: boolean;
  locationName: string;
}

export const MemorialForm: React.FC<MemorialFormProps> = ({ onSubmit, onCancel }) => {
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>();

  const cardType = watch('cardType');
  const name = watch('name');

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const generateAISuggestions = (name: string, cardType: string) => {
    // Simple AI-like suggestions based on name and type
    const baseSuggestions = {
      male: [
        `A loving father and devoted husband, ${name} touched many hearts with his kindness and wisdom.`,
        `${name} was a pillar of strength in our community, always ready to lend a helping hand.`,
        `In memory of ${name}, whose legacy of love and compassion will live on forever.`
      ],
      female: [
        `A beautiful soul and caring mother, ${name} brought joy and warmth to everyone she met.`,
        `${name} was a beacon of grace and strength, inspiring all who knew her.`,
        `Forever remembered for her gentle spirit and loving heart, ${name} will be deeply missed.`
      ],
      child: [
        `Our precious ${name}, taken too soon but forever in our hearts.`,
        `${name} brought sunshine and laughter to every day, leaving beautiful memories behind.`,
        `Though ${name}'s time with us was brief, the love and joy shared will last forever.`
      ]
    };

    setAiSuggestions(baseSuggestions[cardType as keyof typeof baseSuggestions] || []);
  };

  const onFormSubmit = (data: FormData) => {
    const photoFile = data.photo?.[0];
    const photoUrl = photoFile ? URL.createObjectURL(photoFile) : '/placeholder.svg';

    const memorialData: Partial<MemorialData> = {
      name: data.name,
      birthDate: data.birthDate,
      deathDate: data.deathDate,
      memoryText: data.memoryText,
      cardType: data.cardType,
      photo: photoUrl,
      gpsLocation: gpsLocation ? {
        lat: gpsLocation.lat,
        lng: gpsLocation.lng,
        name: data.locationName || 'Memorial Location'
      } : undefined
    };

    onSubmit(memorialData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <Card className="p-8 shadow-soft border-primary/20">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-primary mb-2">Create Memorial Card</h2>
          <p className="text-muted-foreground">
            Honor the memory of your loved one with a digital memorial
          </p>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-foreground font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
              className="border-primary/30 focus:border-primary"
              onChange={(e) => {
                if (e.target.value && cardType) {
                  generateAISuggestions(e.target.value, cardType);
                }
              }}
            />
            {errors.name && (
              <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Card Type */}
          <div>
            <Label className="text-foreground font-medium">Memorial Type *</Label>
            <Select onValueChange={(value) => {
              setValue('cardType', value as 'male' | 'female' | 'child');
              if (name && value) {
                generateAISuggestions(name, value);
              }
            }}>
              <SelectTrigger className="border-primary/30 focus:border-primary">
                <SelectValue placeholder="Select memorial type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="child">Child</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="birthDate" className="text-foreground font-medium">
                Birth Date *
              </Label>
              <Input
                id="birthDate"
                type="date"
                {...register('birthDate', { required: 'Birth date is required' })}
                className="border-primary/30 focus:border-primary"
              />
              {errors.birthDate && (
                <p className="text-destructive text-sm mt-1">{errors.birthDate.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="deathDate" className="text-foreground font-medium">
                Death Date *
              </Label>
              <Input
                id="deathDate"
                type="date"
                {...register('deathDate', { required: 'Death date is required' })}
                className="border-primary/30 focus:border-primary"
              />
              {errors.deathDate && (
                <p className="text-destructive text-sm mt-1">{errors.deathDate.message}</p>
              )}
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <Label className="text-foreground font-medium">Memorial Photo *</Label>
            <div className="mt-2">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    {...register('photo', { required: 'Photo is required' })}
                    onChange={handlePhotoUpload}
                    className="border-primary/30 focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a clear photo for the memorial
                  </p>
                </div>
              </div>
              {errors.photo && (
                <p className="text-destructive text-sm mt-1">{errors.photo.message}</p>
              )}
            </div>
          </div>

          {/* Memory Text with AI Suggestions */}
          <div>
            <Label htmlFor="memoryText" className="text-foreground font-medium flex items-center gap-2">
              Memorial Message *
              <Sparkles className="w-4 h-4 text-primary" />
            </Label>
            <Textarea
              id="memoryText"
              {...register('memoryText', { required: 'Memorial message is required' })}
              placeholder="Share a loving memory, quote, or message..."
              className="border-primary/30 focus:border-primary min-h-24"
            />
            {errors.memoryText && (
              <p className="text-destructive text-sm mt-1">{errors.memoryText.message}</p>
            )}
            
            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2">
                  AI Suggestions (click to use):
                </p>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setValue('memoryText', suggestion)}
                      className="w-full text-left h-auto p-3 text-xs leading-relaxed bg-primary/5 border-primary/20 hover:bg-primary/10"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* GPS Location */}
          <div>
            <Label className="text-foreground font-medium flex items-center gap-2">
              Memorial Location
              <MapPin className="w-4 h-4 text-primary" />
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                {...register('locationName')}
                placeholder="Location name (optional)"
                className="border-primary/30 focus:border-primary"
              />
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                className="border-primary/30 hover:bg-primary hover:text-primary-foreground"
              >
                Get GPS
              </Button>
            </div>
            {gpsLocation && (
              <p className="text-xs text-muted-foreground mt-1">
                Location captured: {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Create Memorial Card
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-primary/30 hover:bg-primary/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};