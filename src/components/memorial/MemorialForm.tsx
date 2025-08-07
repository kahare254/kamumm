import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, MapPin } from 'lucide-react';
import { MemorialData } from './MemorialCard';

interface MemorialFormProps {
  onSubmit: (data: Partial<MemorialData>) => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  birthDate: string;
  deathDate: string;
  cardType: 'male' | 'female' | 'child';
  photo: FileList;
  photoPath: string; // ✅ new
  enableGPS: boolean;
  locationName: string;

}

export const MemorialForm: React.FC<MemorialFormProps> = ({ onSubmit, onCancel }) => {
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);


  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>();



 const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    setPhotoPreview(URL.createObjectURL(file)); // preview

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await fetch('http://localhost:5000/api/upload/photo', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.photo_path) {
        // Set this hidden field to use on form submission
        setValue('photoPath', data.photo_path);
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
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



  const onFormSubmit = (data: FormData) => {
    const photoFile = data.photo?.[0];
    const photoUrl = photoFile ? URL.createObjectURL(photoFile) : '/placeholder.svg';

    const memorialData: Partial<MemorialData> = {
      name: data.name,
      birthDate: data.birthDate,
      deathDate: data.deathDate,
      memoryText: '',
      cardType: data.cardType,
      photo: data.photoPath, // ✅ correct uploaded path
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
          <input type="hidden" {...register('photoPath')} />
        </form>
      </Card>
    </motion.div>
  );
};