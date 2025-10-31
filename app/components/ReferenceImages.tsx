// components/ReferenceImages.tsx
// Componente per la generazione di video usando immagini di riferimento (max 3)

'use client';

import { useState } from 'react';
import { FiLayers, FiPlus, FiTrash2 } from 'react-icons/fi';
import ImageUpload from './ImageUpload';
import VideoConfig from './VideoConfig';
import VideoResult from './VideoResult';
import { VeoGenerationConfig } from '../types/veo';

interface ReferenceImage {
  id: string;
  image: string;
  referenceType: 'asset' | 'style';
}

export default function ReferenceImages() {
  const [prompt, setPrompt] = useState('');
  const [references, setReferences] = useState<ReferenceImage[]>([
    { id: '1', image: '', referenceType: 'asset' }
  ]);
  const [config, setConfig] = useState<VeoGenerationConfig>({
    aspectRatio: '16:9', // Must be 16:9 for reference images
    resolution: '720p',
    durationSeconds: 8, // Must be 8 for reference images
  });
  const [operationId, setOperationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addReference = () => {
    if (references.length < 3) {
      setReferences([
        ...references,
        { id: Date.now().toString(), image: '', referenceType: 'asset' }
      ]);
    }
  };

  const removeReference = (id: string) => {
    if (references.length > 1) {
      setReferences(references.filter(ref => ref.id !== id));
    }
  };

  const updateReference = (id: string, field: keyof ReferenceImage, value: any) => {
    setReferences(references.map(ref =>
      ref.id === id ? { ...ref, [field]: value } : ref
    ));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Inserisci un prompt per generare il video');
      return;
    }

    const validReferences = references.filter(ref => ref.image);
    if (validReferences.length === 0) {
      alert('Carica almeno un\'immagine di riferimento');
      return;
    }

    setLoading(true);
    setOperationId(null);

    try {
      const response = await fetch('/api/generate-with-references', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          referenceImages: validReferences,
          config
        }),
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
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-800">
          <strong>Immagini di Riferimento:</strong> Carica fino a 3 immagini per guidare 
          lo stile e il contenuto del video. Veo preserverà l'aspetto dei soggetti nel video finale.
          Le proporzioni devono essere 16:9 e la durata 8 secondi.
        </p>
      </div>

      <div className="space-y-4">
        {references.map((ref, index) => (
          <div key={ref.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                Immagine di Riferimento {index + 1}
              </h4>
              {references.length > 1 && (
                <button
                  onClick={() => removeReference(ref.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>

            <ImageUpload
              label=""
              onImageSelect={(img) => updateReference(ref.id, 'image', img)}
              currentImage={ref.image}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo di Riferimento
              </label>
              <select
                value={ref.referenceType}
                onChange={(e) => updateReference(ref.id, 'referenceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="asset">Asset (Persona/Oggetto/Prodotto)</option>
                <option value="style">Stile</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {references.length < 3 && (
        <button
          onClick={addReference}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 text-gray-600 px-4 py-3 rounded-lg hover:border-primary-500 hover:text-primary-600 transition-colors"
        >
          <FiPlus />
          Aggiungi Immagine di Riferimento ({references.length}/3)
        </button>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prompt Video
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Descrivi il video utilizzando i riferimenti... es: Una donna che indossa l'abito rosa cammina sulla spiaggia al tramonto con gli occhiali da sole"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <VideoConfig
        config={config}
        onChange={setConfig}
        showDuration={false} // Fixed at 8 seconds
        showAspectRatio={false} // Fixed at 16:9
        showResolution={true}
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim() || !references.some(ref => ref.image)}
        className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Avvio Generazione...
          </>
        ) : (
          <>
            <FiLayers />
            Genera Video con Riferimenti
          </>
        )}
      </button>

      {operationId && <VideoResult operationId={operationId} />}
    </div>
  );
}
