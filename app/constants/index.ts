// constants/index.ts
// Costanti dell'applicazione (modelli, configurazioni, messaggi, limiti)

// Application constants

export const MODELS = {
  VEO_3_1: 'veo-3.1-generate-preview',
  VEO_3_1_FAST: 'veo-3.1-fast-generate-preview',
  VEO_3: 'veo-3.0-generate-001',
  VEO_3_FAST: 'veo-3.0-fast-generate-001',
} as const;

export const ASPECT_RATIOS = {
  HORIZONTAL: '16:9',
  VERTICAL: '9:16',
} as const;

export const RESOLUTIONS = {
  HD: '720p',
  FULL_HD: '1080p',
} as const;

export const DURATIONS = {
  SHORT: 4,
  MEDIUM: 6,
  LONG: 8,
} as const;

export const PERSON_GENERATION = {
  ALLOW_ALL: 'allow_all',
  ALLOW_ADULT: 'allow_adult',
  DONT_ALLOW: 'dont_allow',
} as const;

export const REFERENCE_TYPES = {
  ASSET: 'asset',
  STYLE: 'style',
} as const;

export const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 100 * 1024 * 1024, // 100MB
} as const;

export const POLLING_INTERVAL = 10000; // 10 seconds
export const GENERATION_TIMEOUT = 600000; // 10 minutes

export const VIDEO_STORAGE_DURATION = 2; // days

export const MAX_REFERENCE_IMAGES = 3;
export const MAX_VIDEO_DURATION_FOR_EXTENSION = 141; // seconds

export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

export const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/webm',
] as const;

export const PROMPT_EXAMPLES_BY_CATEGORY = {
  REALISM: [
    'Una ripresa cinematografica con drone che segue una decappottabile rossa vintage su una strada costiera al tramonto',
    'Primo piano di un leone maestoso nella savana africana al tramonto, criniera che ondeggia nel vento',
  ],
  ANIMATION: [
    'Animazione in stop-motion di una farfalla di origami che sbatte le ali',
    'Rendering 3D in stile cartone animato di un cucciolo che gioca nella neve',
  ],
  NATURE: [
    'Primo piano di stalattite di ghiaccio che gocciola con tonalità fredde di blu',
    'Cascata hawaiana maestosa in una lussureggiante foresta pluviale',
  ],
  URBAN: [
    'Inquadratura in soggettiva da un\'auto che guida di notte sotto la pioggia in città neon',
    'Time-lapse di una metropoli trafficata con luci che si accendono al tramonto',
  ],
} as const;

export const ERROR_MESSAGES = {
  NO_API_KEY: 'API key non configurata. Verifica il file .env.local',
  NO_PROMPT: 'Inserisci un prompt per generare il video',
  NO_IMAGE: 'Carica un\'immagine per generare il video',
  NO_VIDEO: 'Carica un video per l\'estensione',
  NO_FRAMES: 'Carica sia il primo che l\'ultimo frame',
  NO_REFERENCES: 'Carica almeno un\'immagine di riferimento',
  MAX_REFERENCES: 'Massimo 3 immagini di riferimento consentite',
  INVALID_IMAGE: 'File immagine non valido',
  INVALID_VIDEO: 'File video non valido',
  FILE_TOO_LARGE: 'File troppo grande',
  GENERATION_FAILED: 'Errore nella generazione del video',
  TIMEOUT: 'Timeout: la generazione ha impiegato troppo tempo',
  NETWORK_ERROR: 'Errore di connessione',
} as const;

export const SUCCESS_MESSAGES = {
  GENERATION_STARTED: 'Generazione video avviata',
  VIDEO_READY: 'Video generato con successo!',
  VIDEO_DOWNLOADED: 'Video scaricato con successo',
} as const;
