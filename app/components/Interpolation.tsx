// components/Interpolation.tsx
// Componente per la generazione di video con interpolazione (primo + ultimo frame)

'use client';

import { useState } from 'react';
import { FiFilm } from 'react-icons/fi';
import ImageUpload from './ImageUpload';
import VideoConfig from './VideoConfig';
import VideoResult from './VideoResult';
import { VeoGenerationConfig } from '../types/veo';

export default function Interpolation() {
  const [prompt, setPrompt] = useState('');
  const [firstFrame, setFirstFrame] = useState('');
  const [lastFrame, setLastFrame] = useState('');
  const [config, setConfig] = useState<VeoGenerationConfig>({
    aspectRatio: '16:9',
    resolution: '720p',
    durationSeconds: 8, // Must be 8 for interpolation
  });
  const [operationId, setOperationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Inserisci un prompt per generare il video');
      return;
    }

    if (!firstFrame || !lastFrame) {
      alert('Carica sia il primo che l\'ultimo frame');
      return;
    }

    setLoading(true);
    setOperationId(null);

    try {
      const response = await fetch('/api/generate-interpolation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, firstFrame, lastFrame, config }),
      });

      const data = await response.json();

      if (response.ok) {
        setOperationId(data.operationId);
      } else {
        alert(data.error || 'Errore nella generazione del video');
      }
    } catch (error: any) {
      alert(error.message || 'Errore nella richiesta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Interpolazione:</strong> Veo genererà un video che transiziona dal primo 
          all'ultimo frame, creando il movimento intermedio. La durata deve essere 8 secondi.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ImageUpload
          label="Primo Frame"
          onImageSelect={setFirstFrame}
          currentImage={firstFrame}
        />
        
        <ImageUpload
          label="Ultimo Frame"
          onImageSelect={setLastFrame}
          currentImage={lastFrame}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prompt Video
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Descrivi la transizione tra i due frame... es: Un gatto alla guida di una decappottabile rossa si lancia da una scogliera e decolla"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <VideoConfig
        config={config}
        onChange={setConfig}
        showDuration={false} // Fixed at 8 seconds
        showAspectRatio={true}
        showResolution={true}
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim() || !firstFrame || !lastFrame}
        className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Avvio Interpolazione...
          </>
        ) : (
          <>
            <FiFilm />
            Genera Video con Interpolazione
          </>
        )}
      </button>

      {operationId && <VideoResult operationId={operationId} />}
    </div>
  );
}
