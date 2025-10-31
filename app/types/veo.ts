// types/veo.ts
// TypeScript type definitions per l'API Veo e le configurazioni video

// Types for Veo API
export interface VeoGenerationConfig {
  aspectRatio?: '16:9' | '9:16';
  resolution?: '720p' | '1080p';
  durationSeconds?: 4 | 6 | 8;
  negativePrompt?: string;
  personGeneration?: 'allow_all' | 'allow_adult' | 'dont_allow';
  numberOfVideos?: number;
}

export interface VideoGenerationRequest {
  model: string;
  prompt: string;
  config?: VeoGenerationConfig;
  image?: string; // base64
  lastFrame?: string; // base64
  referenceImages?: ReferenceImage[];
  video?: string; // base64 for extension
}

export interface ReferenceImage {
  image: string; // base64
  referenceType: 'asset' | 'style';
}

export interface Operation {
  name: string;
  done: boolean;
  response?: {
    generatedVideos: GeneratedVideo[];
  };
  error?: {
    message: string;
    code: number;
  };
}

export interface GeneratedVideo {
  video: {
    uri: string;
    mimeType: string;
  };
}

export interface OperationStatus {
  operationId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  videoUrl?: string;
  error?: string;
}
