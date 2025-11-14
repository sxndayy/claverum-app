"use client";

import React, { useState, useEffect } from 'react';
import { uploadQueue, UploadTask } from '@/lib/uploadQueue';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  X,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadStatusProps {
  className?: string;
  showOnlyActive?: boolean;
}

const UploadStatus: React.FC<UploadStatusProps> = ({ 
  className,
  showOnlyActive = true 
}) => {
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Subscribe to upload queue updates
    const unsubscribe = uploadQueue.subscribe((task) => {
      setTasks(uploadQueue.getTasks());
    });

    // Initialize with current tasks
    setTasks(uploadQueue.getTasks());

    return unsubscribe;
  }, []);

  const activeTasks = tasks.filter(
    t => t.status !== 'completed' && t.status !== 'failed'
  );
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const failedTasks = tasks.filter(t => t.status === 'failed');

  const displayTasks = showOnlyActive ? activeTasks : tasks;

  if (displayTasks.length === 0) {
    return null;
  }

  const getStatusIcon = (status: UploadTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
      case 'compressing':
      case 'uploading':
      case 'recording':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Upload className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (task: UploadTask) => {
    switch (task.status) {
      case 'pending':
        return 'In Warteschlange...';
      case 'compressing':
        return 'Komprimiere...';
      case 'uploading':
        return 'Lade hoch...';
      case 'recording':
        return 'Speichere Metadaten...';
      case 'completed':
        return 'Erfolgreich';
      case 'failed':
        return task.error || 'Fehler beim Upload';
      default:
        return '';
    }
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 max-w-md',
        className
      )}
    >
      <Card className="shadow-lg border-2">
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer bg-muted/50"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-medium text-sm">Uploads</h3>
              <p className="text-xs text-muted-foreground">
                {activeTasks.length > 0 
                  ? `${activeTasks.length} aktiv`
                  : `${completedTasks.length} abgeschlossen`}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <X className="w-4 h-4" /> : '▼'}
          </Button>
        </div>

        {/* Task List */}
        {isExpanded && (
          <div className="max-h-96 overflow-y-auto">
            {displayTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 border-t border-border"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    {getStatusIcon(task.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {task.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {task.area}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getStatusText(task)}
                      </p>
                    </div>
                  </div>
                  {task.status === 'failed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => uploadQueue.retryTask(task.id)}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                {task.status !== 'completed' && task.status !== 'failed' && (
                  <Progress value={task.progress} className="mt-2 h-1" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Footer */}
        {isExpanded && tasks.length > 0 && (
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                {activeTasks.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {activeTasks.length} aktiv
                  </span>
                )}
                {completedTasks.length > 0 && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    {completedTasks.length}
                  </span>
                )}
                {failedTasks.length > 0 && (
                  <span className="flex items-center gap-1 text-red-600">
                    <XCircle className="w-3 h-3" />
                    {failedTasks.length}
                  </span>
                )}
              </div>
              {completedTasks.length > 0 && activeTasks.length === 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => uploadQueue.clearCompleted()}
                  className="text-xs"
                >
                  Bereinigen
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UploadStatus;


