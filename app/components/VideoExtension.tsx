// components/VideoExtension.tsx
// Componente per l'estensione di video esistenti generati con Veo

'use client';

import { useState } from 'react';
import { FiPlayCircle } from 'react-icons/fi';
import VideoUpload from './VideoUpload';
import VideoConfig from './VideoConfig';
import VideoResult from './VideoResult';
import { VeoGenerationConfig } from '../types/veo';

export default function VideoExtension() {
  const [prompt, setPrompt] = useState('');
  const [video, setVideo] = useState('');
  const [config, setConfig] = useState<VeoGenerationConfig>({
    aspectRatio: '16:9',
    resolution: '720p', // Must be 720p for extension
    durationSeconds: 8,
  });
  const [operationId, setOperationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Inserisci un prompt per estendere il video');
      return;
    }

    if (!video) {
      alert('Carica un video da estendere');
      return;
    }

    setLoading(true);
    setOperationId(null);

    try {
      const response = await fetch('/api/extend-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, video, config }),
      });

      const data = await response.json();

      if (response.ok) {
        setOperationId(data.operationId);
      } else {
        alert(data.error || 'Errore nell\'estensione del video');
      }
    } catch (error: any) {
      alert(error.message || 'Errore nella richiesta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Estensione Video:</strong> Carica un video generato precedentemente da Veo 
          (max 141 secondi) per estenderlo di altri 7 secondi. Il video esteso combinerà 
          quello originale con la nuova sequenza generata.
        </p>
      </div>

      <VideoUpload
        label="Video da Estendere"
        onVideoSelect={setVideo}
        currentVideo={video}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prompt per l'Estensione
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Descrivi cosa accade dopo... es: La farfalla atterra su un fiore arancione di origami mentre un cucciolo bianco si avvicina curioso"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-2">
          💡 Veo estenderà l'ultimo secondo del video per creare la continuazione
        </p>
      </div>

      <VideoConfig
        config={config}
        onChange={setConfig}
        showDuration={false}
        showAspectRatio={true}
        showResolution={false} // Fixed at 720p for extension
      />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Requisiti:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Risoluzione: 720p</li>
            <li>Proporzioni: 9:16 o 16:9</li>
            <li>Durata max video originale: 141 secondi</li>
            <li>Solo video generati da Veo</li>
          </ul>
        </p>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim() || !video}
        className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Avvio Estensione...
          </>
        ) : (
          <>
            <FiPlayCircle />
            Estendi Video
          </>
        )}
      </button>

      {operationId && <VideoResult operationId={operationId} />}
    </div>
  );
}
