import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ImagePlus, X, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AreaUploadProps {
  areaName: string;
  areaDescription: string;
  photos: string[]; // Array of image URLs (preview)
  files: File[]; // Array of actual File objects
  text: string;
  onPhotosChange: (photos: string[]) => void;
  onFilesChange: (files: File[]) => void;
  onTextChange: (text: string) => void;
  maxPhotos?: number;
  maxWords?: number;
  textPlaceholder?: string; // Optional custom placeholder text for the textarea
}


const AreaUpload: React.FC<AreaUploadProps> = ({
  areaName,
  areaDescription,
  photos,
  files,
  text,
  onPhotosChange,
  onFilesChange,
  onTextChange,
  maxPhotos = 20,
  maxWords = 200,
  textPlaceholder,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(event.target.files || []);
      const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
      
      // Check max photos limit
      const remainingSlots = maxPhotos - files.length;
      if (remainingSlots <= 0) {
        console.warn('Max photos limit reached');
        return;
      }
      
      // Take only what fits
      const filesToAdd = imageFiles.slice(0, remainingSlots);
      const updatedFiles = [...files, ...filesToAdd];
      onFilesChange(updatedFiles);
      
      // Create preview URLs for display
      const newPhotos = updatedFiles.map(file => URL.createObjectURL(file));
      onPhotosChange(newPhotos);
      
      // Reset input
      if (event.target) {
        event.target.value = '';
      }
    },
    [files, onFilesChange, onPhotosChange, maxPhotos],
  );

  const handleRemovePhoto = useCallback(
    (index: number) => {
      // Clean up object URL
      URL.revokeObjectURL(photos[index]);
      
      // Remove from files array
      const newFiles = files.filter((_, i) => i !== index);
      onFilesChange(newFiles);
      
      // Update photos based on remaining files
      const newPhotos = newFiles.map(file => URL.createObjectURL(file));
      onPhotosChange(newPhotos);
    },
    [photos, files, onFilesChange, onPhotosChange],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const newFiles = Array.from(e.dataTransfer.files || []).filter(file =>
        file.type.startsWith('image/'),
      );
      
      // Check max photos limit
      const remainingSlots = maxPhotos - files.length;
      if (remainingSlots <= 0) {
        console.warn('Max photos limit reached');
        return;
      }
      
      // Take only what fits
      const filesToAdd = newFiles.slice(0, remainingSlots);
      const updatedFiles = [...files, ...filesToAdd];
      onFilesChange(updatedFiles);
      
      // Create preview URLs for display
      const newPhotos = updatedFiles.map(file => URL.createObjectURL(file));
      onPhotosChange(newPhotos);
    },
    [files, onFilesChange, onPhotosChange, maxPhotos],
  );

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const isWordLimitExceeded = wordCount > maxWords;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium">{areaName}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{areaDescription}</p>

      {/* Photo Upload */}
      <div className="space-y-2">
        <Label htmlFor={`photos-${areaName}`}>Fotos ({photos.length}/{maxPhotos} hochgeladen)</Label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex h-48 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted",
            isDragging && "border-primary/50 bg-primary/5",
          )}
        >
          <div className="rounded-full bg-background p-3 shadow-sm">
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Fotos auswählen</p>
            <p className="text-xs text-muted-foreground">
              oder hierher ziehen (max. {maxPhotos} Fotos)
            </p>
          </div>
          <Input
            id={`photos-${areaName}`}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
        {photos.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((url, index) => (
              <div key={index} className="relative h-32 w-full rounded-md overflow-hidden">
                <img src={url} alt={`Uploaded ${index + 1}`} className="object-cover w-full h-full" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                  onClick={() => handleRemovePhoto(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Text Description - Optional */}
      <div className="space-y-2">
        <Label htmlFor={`description-${areaName}`}>
          Zusätzliche Informationen (optional)
        </Label>
        <p className="text-sm text-muted-foreground">
          Falls Sie noch weitere Informationen haben, können Sie diese hier ergänzen.
        </p>
        <Textarea
          id={`description-${areaName}`}
          placeholder={textPlaceholder || `Beschreiben Sie den ${areaName.toLowerCase()}...`}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={6} // 5-6 lines long
          maxLength={maxWords * 5} // Rough estimate for max characters based on words
          className={cn(isWordLimitExceeded && "border-destructive")}
        />
        <p className={cn("text-sm text-muted-foreground", isWordLimitExceeded && "text-destructive")}>
          {wordCount}/{maxWords} Wörter
        </p>
      </div>
    </div>
  );
};

export default AreaUpload;
