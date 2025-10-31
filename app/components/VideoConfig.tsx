// components/VideoConfig.tsx
// Pannello di configurazione per parametri video (risoluzione, durata, aspect ratio, ecc.)

'use client';

import { VeoGenerationConfig } from '../types/veo';

interface VideoConfigProps {
  config: VeoGenerationConfig;
  onChange: (config: VeoGenerationConfig) => void;
  showDuration?: boolean;
  showAspectRatio?: boolean;
  showResolution?: boolean;
}

export default function VideoConfig({
  config,
  onChange,
  showDuration = true,
  showAspectRatio = true,
  showResolution = true,
}: VideoConfigProps) {
  
  const updateConfig = (field: keyof VeoGenerationConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold text-gray-900">Configurazione Video</h3>
      
      {showAspectRatio && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proporzioni
          </label>
          <select
            value={config.aspectRatio || '16:9'}
            onChange={(e) => updateConfig('aspectRatio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="16:9">16:9 (Orizzontale)</option>
            <option value="9:16">9:16 (Verticale)</option>
          </select>
        </div>
      )}

      {showResolution && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risoluzione
          </label>
          <select
            value={config.resolution || '720p'}
            onChange={(e) => updateConfig('resolution', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="720p">720p</option>
            <option value="1080p">1080p (solo 8 secondi)</option>
          </select>
        </div>
      )}

      {showDuration && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durata (secondi)
          </label>
          <select
            value={config.durationSeconds || 8}
            onChange={(e) => updateConfig('durationSeconds', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="4">4 secondi</option>
            <option value="6">6 secondi</option>
            <option value="8">8 secondi</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prompt Negativo (opzionale)
        </label>
        <textarea
          value={config.negativePrompt || ''}
          onChange={(e) => updateConfig('negativePrompt', e.target.value)}
          placeholder="es: cartoon, disegno, bassa qualità"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Descrivi cosa NON vuoi vedere nel video
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Generazione Persone
        </label>
        <select
          value={config.personGeneration || 'allow_adult'}
          onChange={(e) => updateConfig('personGeneration', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="allow_all">Consenti Tutte</option>
          <option value="allow_adult">Solo Adulti</option>
          <option value="dont_allow">Non Consentire</option>
        </select>
      </div>
    </div>
  );
}
