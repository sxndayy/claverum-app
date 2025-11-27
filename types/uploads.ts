export type UploadableFile = File & { 
  __uploadQueued?: boolean;
  previewUrl?: string;
};

export type UploadKind = 'image' | 'pdf';

export type UploadStatus = 'local' | 'uploading' | 'uploaded' | 'failed';

export interface AreaUploadItem {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  kind: UploadKind;
  previewUrl?: string; // Optional - can be empty when loading presigned URL
  status: UploadStatus;
  remoteUrl?: string;
  progress?: number;
  error?: string;
  queueId?: string;
  uploadId?: string; // Backend upload ID for fetching presigned URLs
}

export const markFileAsQueued = (file: File) => {
  (file as UploadableFile).__uploadQueued = true;
};

export const isFileQueued = (file: File): boolean => {
  return Boolean((file as UploadableFile).__uploadQueued);
};

