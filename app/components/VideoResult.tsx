// components/VideoResult.tsx
// Componente per visualizzare il risultato della generazione con polling automatico

'use client';

import { useState, useEffect } from 'react';
import { FiLoader, FiCheckCircle, FiAlertCircle, FiDownload } from 'react-icons/fi';

interface VideoResultProps {
  operationId: string | null;
  onComplete?: (videoUrl: string) => void;
}

export default function VideoResult({ operationId, onComplete }: VideoResultProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (operationId && !polling) {
      startPolling();
    }
  }, [operationId]);

  const startPolling = async () => {
    if (!operationId) return;
    
    setPolling(true);
    setStatus('processing');
    setError(null);

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/poll-operation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationId }),
        });

        const data = await response.json();

        if (data.status === 'completed') {
          clearInterval(pollInterval);
          setStatus('completed');
          setPolling(false);
          
          // Download del video
          await downloadVideo(data.videoUri);
        } else if (data.status === 'failed') {
          clearInterval(pollInterval);
          setStatus('failed');
          setError(data.error || 'Errore nella generazione del video');
          setPolling(false);
        }
        // Continua il polling se status è 'processing'
      } catch (err: any) {
        clearInterval(pollInterval);
        setStatus('failed');
        setError(err.message || 'Errore nel polling');
        setPolling(false);
      }
    }, 10000); // Poll ogni 10 secondi

    // Timeout dopo 10 minuti
    setTimeout(() => {
      clearInterval(pollInterval);
      if (status === 'processing') {
        setStatus('failed');
        setError('Timeout: la generazione del video ha impiegato troppo tempo');
        setPolling(false);
      }
    }, 600000);
  };

  const downloadVideo = async (videoUri: string) => {
    try {
      const response = await fetch('/api/download-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUri }),
      });

      const data = await response.json();
      
      if (data.videoData) {
        setVideoUrl(data.videoData);
        if (onComplete) {
          onComplete(data.videoData);
        }
      }
    } catch (err: any) {
      setError('Errore nel download del video');
    }
  };

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `veo-video-${Date.now()}.mp4`;
      link.click();
    }
  };

  if (!operationId) return null;

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
      {status === 'processing' && (
        <div className="text-center">
          <FiLoader className="animate-spin h-12 w-12 text-primary-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Generazione Video in Corso...
          </h3>
          <p className="text-gray-600">
            Questo può richiedere alcuni minuti. La pagina si aggiornerà automaticamente.
          </p>
        </div>
      )}

      {status === 'completed' && videoUrl && (
        <div className="space-y-4">
          <div className="flex items-center justify-center text-green-600 mb-4">
            <FiCheckCircle className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
            Video Generato con Successo!
          </h3>
          
          <video
            src={videoUrl}
            controls
            className="w-full rounded-lg shadow-md"
          />
          
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiDownload />
            Scarica Video
          </button>
        </div>
      )}

      {status === 'failed' && (
        <div className="text-center">
          <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Errore nella Generazione
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
