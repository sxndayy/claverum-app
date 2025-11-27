import { useState, useEffect } from 'react';
import { apiClient } from './apiClient';

/**
 * Hook to get and cache presigned URLs for uploaded files
 * Automatically refreshes URLs when they expire
 */
export function usePresignedUrl(
  orderId: string | null,
  uploadId: string | null,
  enabled: boolean = true
): { url: string | null; loading: boolean; error: string | null } {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !orderId || !uploadId) {
      setUrl(null);
      return;
    }

    let cancelled = false;

    const fetchUrl = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getDownloadUrl(orderId, uploadId);
        
        if (cancelled) return;

        if (response.success && response.downloadUrl) {
          setUrl(response.downloadUrl);
          
          // Refresh URL before it expires (refresh at 90% of expiration time)
          const expiresIn = response.expiresIn || 3600;
          const refreshTime = expiresIn * 0.9 * 1000; // Convert to milliseconds
          
          setTimeout(() => {
            if (!cancelled) {
              fetchUrl();
            }
          }, refreshTime);
        } else {
          setError(response.error || 'Failed to get download URL');
          setUrl(null);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
        setUrl(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUrl();

    return () => {
      cancelled = true;
    };
  }, [orderId, uploadId, enabled]);

  return { url, loading, error };
}

/**
 * Utility function to get presigned URL for a single upload
 * Useful for one-off URL fetching without hook overhead
 */
export async function getPresignedUrl(
  orderId: string,
  uploadId: string
): Promise<string | null> {
  try {
    const response = await apiClient.getDownloadUrl(orderId, uploadId);
    if (response.success && response.downloadUrl) {
      return response.downloadUrl;
    }
    return null;
  } catch (error) {
    console.error('Error getting presigned URL:', error);
    return null;
  }
}

