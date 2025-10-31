// components/ImageToVideo.tsx
// Componente per la generazione di video da immagine statica

'use client';

import { useState } from 'react';
import { FiImage } from 'react-icons/fi';
import ImageUpload from './ImageUpload';
import VideoConfig from './VideoConfig';
import VideoResult from './VideoResult';
import { VeoGenerationConfig } from '../types/veo';

export default function ImageToVideo() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [config, setConfig] = useState<VeoGenerationConfig>({
    aspectRatio: '16:9',
    resolution: '720p',
    durationSeconds: 8,
  });
  const [operationId, setOperationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Inserisci un prompt per generare il video');
      return;
    }

    if (!image) {
      alert('Carica un\'immagine per generare il video');
      return;
    }

    setLoading(true);
    setOperationId(null);

    try {
      const response = await fetch('/api/generate-image-to-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, image, config }),
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
      <ImageUpload
        label="Immagine di Partenza"
        onImageSelect={setImage}
        currentImage={image}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prompt Video
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Descrivi come animare l'immagine... es: La farfalla sbatte le ali e vola via verso il giardino"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-2">
          💡 L'immagine sarà usata come primo frame del video
        </p>
      </div>

      <VideoConfig
        config={config}
        onChange={setConfig}
        showDuration={true}
        showAspectRatio={true}
        showResolution={true}
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim() || !image}
        className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Avvio Generazione...
          </>
        ) : (
          <>
            <FiImage />
            Genera Video da Immagine
          </>
        )}
      </button>

      {operationId && <VideoResult operationId={operationId} />}
    </div>
  );
}
