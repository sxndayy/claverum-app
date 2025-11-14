/**
 * Upload Queue Manager
 * Manages background uploads with retry logic
 * Ensures uploads don't block navigation
 */

import { apiClient } from './apiClient';
import { compressImage } from './imageCompression';

export interface UploadTask {
  id: string;
  orderId: string;
  area: string;
  file: File;
  status: 'pending' | 'compressing' | 'uploading' | 'recording' | 'completed' | 'failed';
  progress: number;
  retries: number;
  error?: string;
  publicUrl?: string;
}

export type UploadCallback = (task: UploadTask) => void;

class UploadQueue {
  private queue: UploadTask[] = [];
  private maxRetries = 2;
  private listeners: Set<UploadCallback> = new Set();
  private activeTasks: Set<string> = new Set();
  private maxConcurrentUploads = 3;

  /**
   * Add file to upload queue
   */
  addUpload(orderId: string, area: string, file: File): string {
    const taskId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const task: UploadTask = {
      id: taskId,
      orderId,
      area,
      file,
      status: 'pending',
      progress: 0,
      retries: 0,
    };

    this.queue.push(task);
    this.notifyListeners(task);
    
    // Start processing if we have capacity
    this.processQueue();

    return taskId;
  }

  /**
   * Add multiple uploads
   */
  addMultipleUploads(orderId: string, area: string, files: File[]): string[] {
    return files.map(file => this.addUpload(orderId, area, file));
  }

  /**
   * Subscribe to upload updates
   */
  subscribe(callback: UploadCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Get all tasks
   */
  getTasks(): UploadTask[] {
    return [...this.queue];
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): UploadTask | undefined {
    return this.queue.find(t => t.id === taskId);
  }

  /**
   * Get tasks by area
   */
  getTasksByArea(area: string): UploadTask[] {
    return this.queue.filter(t => t.area === area);
  }

  /**
   * Get pending/processing tasks count
   */
  getActiveTasksCount(): number {
    return this.queue.filter(
      t => t.status !== 'completed' && t.status !== 'failed'
    ).length;
  }

  /**
   * Check if any uploads are in progress
   */
  hasActiveUploads(): boolean {
    return this.getActiveTasksCount() > 0;
  }

  /**
   * Clear completed tasks
   */
  clearCompleted(): void {
    this.queue = this.queue.filter(t => t.status !== 'completed');
  }

  /**
   * Retry failed task
   */
  async retryTask(taskId: string): Promise<void> {
    const task = this.getTask(taskId);
    if (!task || task.status !== 'failed') return;

    task.status = 'pending';
    task.retries = 0;
    task.progress = 0;
    task.error = undefined;
    
    this.notifyListeners(task);
    
    // Try to process queue if we have capacity
    this.processQueue();
  }

  private notifyListeners(task: UploadTask): void {
    this.listeners.forEach(callback => callback({ ...task }));
  }

  private updateTask(taskId: string, updates: Partial<UploadTask>): void {
    const task = this.queue.find(t => t.id === taskId);
    if (task) {
      Object.assign(task, updates);
      this.notifyListeners(task);
    }
  }

  private async processQueue(): Promise<void> {
    // Start as many tasks as we can (up to maxConcurrentUploads)
    while (this.activeTasks.size < this.maxConcurrentUploads) {
      const pendingTask = this.queue.find(t => t.status === 'pending');
      if (!pendingTask) break;

      // Mark task as active and start processing
      this.activeTasks.add(pendingTask.id);
      this.processTask(pendingTask).finally(() => {
        // Remove from active tasks when done (success or failure)
        this.activeTasks.delete(pendingTask.id);
        // Try to start next pending task
        this.processQueue();
      });
    }
  }

  private async processTask(task: UploadTask): Promise<void> {
    try {
      // Step 1: Compress image
      this.updateTask(task.id, { status: 'compressing', progress: 10 });
      
      const compressedFile = await compressImage(task.file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.8,
      });

      this.updateTask(task.id, { progress: 30 });

      // Step 2: Get pre-signed URL
      const urlResponse = await apiClient.getUploadUrl(
        task.orderId,
        task.area,
        compressedFile.name,
        compressedFile.type
      );

      if (!urlResponse.success) {
        throw new Error(urlResponse.error || 'Failed to get upload URL');
      }

      this.updateTask(task.id, { status: 'uploading', progress: 40 });

      // Step 3: Upload to S3
      const uploadSuccess = await apiClient.uploadToS3(
        urlResponse.uploadUrl,
        compressedFile
      );

      if (!uploadSuccess) {
        throw new Error('Failed to upload to storage');
      }

      this.updateTask(task.id, { progress: 70 });

      // Step 4: Record upload in database
      this.updateTask(task.id, { status: 'recording', progress: 80 });

      const recordResponse = await apiClient.recordUpload({
        orderId: task.orderId,
        area: task.area,
        filePath: urlResponse.filePath,
        mimeType: compressedFile.type,
        fileSize: compressedFile.size,
      });

      if (!recordResponse.success) {
        throw new Error(recordResponse.error || 'Failed to record upload');
      }

      // Success!
      this.updateTask(task.id, {
        status: 'completed',
        progress: 100,
        publicUrl: recordResponse.publicUrl,
      });

    } catch (error) {
      console.error(`Upload task ${task.id} failed:`, error);

      // Retry logic
      if (task.retries < this.maxRetries) {
        task.retries++;
        task.status = 'pending';
        this.notifyListeners(task);
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * task.retries));
      } else {
        this.updateTask(task.id, {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Upload failed',
        });
      }
    }
  }
}

// Export singleton instance
export const uploadQueue = new UploadQueue();


