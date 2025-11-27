"use client";

import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ImagePlus, X, Camera, Loader2, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaUploadItem, UploadKind } from '@/types/uploads';

interface AreaUploadProps {
  areaName: string;
  areaDescription: string;
  items: AreaUploadItem[];
  text: string;
  onFilesSelected: (files: File[]) => void;
  onRemoveItem: (itemId: string) => void;
  onTextChange: (text: string) => void;
  maxPhotos?: number;
  maxWords?: number;
  textPlaceholder?: string;
  allowPdf?: boolean;
}

const AreaUpload: React.FC<AreaUploadProps> = ({
  areaName,
  areaDescription,
  items,
  text,
  onFilesSelected,
  onRemoveItem,
  onTextChange,
  maxPhotos = 20,
  maxWords = 200,
  textPlaceholder,
  allowPdf = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(event.target.files || []);
      if (newFiles.length > 0) {
        onFilesSelected(newFiles);
      }
      if (event.target) {
        event.target.value = '';
      }
    },
    [onFilesSelected],
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

      const droppedFiles = Array.from(e.dataTransfer.files || []);
      if (droppedFiles.length > 0) {
        onFilesSelected(droppedFiles);
      }
    },
    [onFilesSelected],
  );

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const isWordLimitExceeded = wordCount > maxWords;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusBadge = (item: AreaUploadItem) => {
    switch (item.status) {
      case 'local':
        return <span className="text-xs text-muted-foreground">Wartet auf Upload</span>;
      case 'uploading':
        return (
          <span className="flex items-center gap-1 text-xs text-blue-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            Upload läuft...
          </span>
        );
      case 'uploaded':
        return (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle className="h-3 w-3" />
            Hochgeladen
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-xs text-red-600">
            <AlertTriangle className="h-3 w-3" />
            Upload fehlgeschlagen
          </span>
        );
      default:
        return null;
    }
  };

  const renderPdfCard = (item: AreaUploadItem) => {
    const isUploadedLink = item.remoteUrl && item.remoteUrl.startsWith('http');
    return (
      <div
        key={item.id}
        className="relative flex h-36 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-muted-foreground/40 bg-muted/50 p-3 text-center"
      >
        <FileText className="h-8 w-8 text-muted-foreground" />
        <p className="w-full truncate text-xs font-medium text-muted-foreground" title={item.name}>
          {item.name}
        </p>
        <p className="text-xs text-muted-foreground/70">{formatFileSize(item.size)}</p>
        {isUploadedLink && (
          <a
            href={item.remoteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline"
          >
            Öffnen
          </a>
        )}
        <div>{getStatusBadge(item)}</div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute right-1 top-1 h-6 w-6 rounded-full"
          onClick={() => onRemoveItem(item.id)}
          disabled={item.status === 'uploading'}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  const renderImageCard = (item: AreaUploadItem) => {
    // Use remoteUrl if available (after upload), otherwise previewUrl (local blob)
    const imageUrl = item.remoteUrl || item.previewUrl;
    
    return (
      <div key={item.id} className="group relative h-36 w-full overflow-hidden rounded-md bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${areaName} Upload ${item.name}`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback if image fails to load - replace with placeholder
              console.error(`Failed to load image: ${imageUrl}`);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              // Show placeholder instead
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.image-placeholder')) {
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder flex h-full w-full flex-col items-center justify-center gap-2 bg-muted p-3';
                placeholder.innerHTML = `
                  <svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-xs text-muted-foreground text-center truncate w-full px-2">${item.name}</p>
                `;
                parent.appendChild(placeholder);
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted p-3">
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <p className="text-xs text-muted-foreground text-center truncate w-full px-2">{item.name}</p>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          <span className="truncate">{item.name}</span>
          <span>{formatFileSize(item.size)}</span>
        </div>
        <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
          {getStatusBadge(item)}
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute right-1 top-1 h-6 w-6 rounded-full"
          onClick={() => onRemoveItem(item.id)}
          disabled={item.status === 'uploading'}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center gap-2">
        <Camera className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium">{areaName}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{areaDescription}</p>

      <div className="space-y-2">
        <Label htmlFor={`uploads-${areaName}`}>Uploads ({items.length}/{maxPhotos})</Label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex h-48 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted',
            isDragging && 'border-primary/50 bg-primary/5',
          )}
        >
          <div className="rounded-full bg-background p-3 shadow-sm">
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Dateien auswählen</p>
            <p className="text-xs text-muted-foreground">
              oder hierher ziehen (max. {maxPhotos} Dateien, max. 10 MB pro Datei)
            </p>
            {allowPdf && <p className="text-xs text-muted-foreground">Unterstützt: Fotos & PDFs</p>}
          </div>
          <Input
            id={`uploads-${areaName}`}
            type="file"
            accept={allowPdf ? 'image/*,application/pdf' : 'image/*'}
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        {items.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map(item => {
              // Check if item is PDF by mimeType or kind
              const isPdfFile = item.mimeType === 'application/pdf' || (item.kind as string) === 'pdf';
              return isPdfFile ? renderPdfCard(item) : renderImageCard(item);
            })}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`description-${areaName}`}>Zusätzliche Informationen (optional)</Label>
        <p className="text-sm text-muted-foreground">
          Falls Sie noch weitere Informationen haben, können Sie diese hier ergänzen.
        </p>
        <Textarea
          id={`description-${areaName}`}
          placeholder={textPlaceholder || `Beschreiben Sie den ${areaName.toLowerCase()}...`}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={6}
          maxLength={maxWords * 5}
          className={cn(isWordLimitExceeded && 'border-destructive')}
        />
        <p className={cn('text-sm text-muted-foreground', isWordLimitExceeded && 'text-destructive')}>
          {wordCount}/{maxWords} Wörter
        </p>
      </div>
    </div>
  );
};

export default AreaUpload;
