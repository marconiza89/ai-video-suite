// components/VideoUpload.tsx
// Componente riutilizzabile per l'upload di video con preview

'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiX, FiVideo } from 'react-icons/fi';

interface VideoUploadProps {
  onVideoSelect: (video: string) => void;
  label: string;
  currentVideo?: string;
}

export default function VideoUpload({ onVideoSelect, label, currentVideo }: VideoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentVideo || null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert('Per favore seleziona un file video valido');
        return;
      }

      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('Il file è troppo grande. Massimo 100MB consentiti');
        return;
      }

      setFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onVideoSelect(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setFileName('');
    onVideoSelect('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
        >
          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Clicca per caricare un video
          </p>
          <p className="text-xs text-gray-500 mt-1">
            MP4 fino a 100MB
          </p>
        </div>
      ) : (
        <div className="relative">
          <video
            src={preview}
            controls
            className="w-full rounded-lg"
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors z-10"
          >
            <FiX />
          </button>
          {fileName && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <FiVideo />
              <span>{fileName}</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
