// utils/helpers.ts
// Funzioni utility per validazione file, conversioni, e operazioni comuni

// Utility functions for the Veo app

/**
 * Converts a file to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Validates image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Il file deve essere un\'immagine' };
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'L\'immagine non può superare i 10MB' };
  }

  return { valid: true };
};

/**
 * Validates video file
 */
export const validateVideoFile = (file: File): { valid: boolean; error?: string } => {
  if (!file.type.startsWith('video/')) {
    return { valid: false, error: 'Il file deve essere un video' };
  }

  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Il video non può superare i 100MB' };
  }

  return { valid: true };
};

/**
 * Formats operation status message
 */
export const getStatusMessage = (status: string): string => {
  const messages: Record<string, string> = {
    'pending': 'In attesa di elaborazione...',
    'processing': 'Generazione in corso...',
    'completed': 'Video generato con successo!',
    'failed': 'Errore nella generazione',
  };

  return messages[status] || status;
};

/**
 * Estimates generation time based on duration
 */
export const estimateGenerationTime = (durationSeconds: number): string => {
  const baseTime = 60; // 1 minute base
  const perSecond = 15; // 15 seconds per video second
  const total = baseTime + (durationSeconds * perSecond);
  
  const minutes = Math.ceil(total / 60);
  return `~${minutes} minuti`;
};

/**
 * Validates aspect ratio and resolution compatibility
 */
export const validateVideoConfig = (
  aspectRatio: string,
  resolution: string,
  durationSeconds: number
): { valid: boolean; error?: string } => {
  // 1080p only supported for 8 seconds
  if (resolution === '1080p' && durationSeconds !== 8) {
    return { 
      valid: false, 
      error: 'La risoluzione 1080p è disponibile solo per video di 8 secondi' 
    };
  }

  // 1080p only for 16:9 aspect ratio
  if (resolution === '1080p' && aspectRatio === '9:16') {
    return { 
      valid: false, 
      error: 'La risoluzione 1080p è disponibile solo per proporzioni 16:9' 
    };
  }

  return { valid: true };
};

/**
 * Downloads a video from base64 data
 */
export const downloadVideoFromBase64 = (base64Data: string, filename?: string) => {
  const link = document.createElement('a');
  link.href = base64Data;
  link.download = filename || `veo-video-${Date.now()}.mp4`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Formats file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Checks if a video meets extension requirements
 */
export const validateVideoForExtension = (
  duration: number,
  resolution: string,
  aspectRatio: string
): { valid: boolean; error?: string } => {
  if (duration > 141) {
    return {
      valid: false,
      error: 'Il video non può superare i 141 secondi per l\'estensione'
    };
  }

  if (resolution !== '720p') {
    return {
      valid: false,
      error: 'Solo video a 720p possono essere estesi'
    };
  }

  if (aspectRatio !== '16:9' && aspectRatio !== '9:16') {
    return {
      valid: false,
      error: 'Le proporzioni devono essere 16:9 o 9:16'
    };
  }

  return { valid: true };
};
