// page.tsx
// Pagina principale dell'applicazione con tab navigation per le 5 modalità di generazione

'use client';

import { useState } from 'react';
import TextToVideo from './components/TextToVideo';
import ImageToVideo from './components/ImageToVideo';
import Interpolation from './components/Interpolation';
import ReferenceImages from './components/ReferenceImages';
import VideoExtension from './components/VideoExtension';

type TabType = 'text' | 'image' | 'interpolation' | 'references' | 'extension';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('text');

  const tabs = [
    { id: 'text' as TabType, label: 'Testo → Video', icon: '📝' },
    { id: 'image' as TabType, label: 'Immagine → Video', icon: '🖼️' },
    { id: 'interpolation' as TabType, label: 'Interpolazione', icon: '🎬' },
    { id: 'references' as TabType, label: 'Con Riferimenti', icon: '🎨' },
    { id: 'extension' as TabType, label: 'Estensione', icon: '➕' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Veo 3.1 Video Generator
          </h1>
          <p className="text-gray-600">
            Genera video professionali con l'AI di Google
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 min-w-[120px] py-4 px-4 text-center border-b-2 font-medium text-sm
                    transition-colors duration-200
                    ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === 'text' && <TextToVideo />}
            {activeTab === 'image' && <ImageToVideo />}
            {activeTab === 'interpolation' && <Interpolation />}
            {activeTab === 'references' && <ReferenceImages />}
            {activeTab === 'extension' && <VideoExtension />}
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">🎥 Alta Qualità</h3>
            <p className="text-sm text-gray-600">
              Video fino a 1080p con 8 secondi di durata e audio nativo
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">🎨 Versatile</h3>
            <p className="text-sm text-gray-600">
              Supporta stili cinematografici, animazioni e realismo fotografico
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">⚡ Potente</h3>
            <p className="text-sm text-gray-600">
              Interpolazione, riferimenti e estensioni per controllo creativo totale
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Powered by Veo 3.1 - Google GenAI</p>
        </div>
      </div>
    </div>
  );
}
