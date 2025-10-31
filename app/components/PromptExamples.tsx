// components/PromptExamples.tsx
// Componente con esempi di prompt categorizzati per diverse tipologie di video

'use client';

import { FiCopy } from 'react-icons/fi';

interface PromptExample {
  title: string;
  prompt: string;
  category: string;
}

const examples: PromptExample[] = [
  {
    title: 'Ripresa Cinematografica',
    prompt: 'Una ripresa cinematografica con drone che segue una decappottabile rossa vintage su una strada costiera al tramonto. Le onde si infrangono sugli scogli sottostanti, luce dorata, atmosfera drammatica.',
    category: 'Realismo'
  },
  {
    title: 'Animazione Creativa',
    prompt: 'Animazione in stop-motion di una farfalla di origami che sbatte le ali e vola attraverso una finestra verso un giardino magico. Colori vivaci, atmosfera giocosa e allegra.',
    category: 'Animazione'
  },
  {
    title: 'Natura e Paesaggi',
    prompt: 'Primo piano di stalattite di ghiaccio che gocciola su una parete rocciosa ghiacciata, tonalità fredde di blu e bianco, zoom lento che mantiene i dettagli delle gocce d\'acqua. Atmosfera serena e gelida.',
    category: 'Natura'
  },
  {
    title: 'Scena Urbana',
    prompt: 'Inquadratura in soggettiva da un\'auto che guida di notte sotto la pioggia in una città neon. Luci sfocate, parabrezza con gocce di pioggia, atmosfera noir cinematografica.',
    category: 'Urbano'
  },
  {
    title: 'Con Dialoghi',
    prompt: 'Primo piano di un uomo disperato con impermeabile verde che compone un numero su un telefono a disco. Illuminazione al neon verde. "Devo assolutamente parlarle", dice con voce tesa. Atmosfera thriller.',
    category: 'Audio'
  },
  {
    title: 'Animali',
    prompt: 'Rendering 3D in stile cartone animato di un cucciolo di leopardo delle nevi che trotterella felice in una foresta invernale fantastica. Alberi innevati, fiocchi di neve che cadono, movimenti rimbalzanti.',
    category: 'Animazione'
  }
];

interface PromptExamplesProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function PromptExamples({ onSelectPrompt }: PromptExamplesProps) {
  const handleCopy = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    onSelectPrompt(prompt);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          💡 Esempi di Prompt
        </h3>
        <span className="text-xs text-gray-500">
          Clicca per copiare
        </span>
      </div>

      <div className="grid gap-3">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => handleCopy(example.prompt)}
            className="text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-1 bg-primary-100 text-primary-700 rounded">
                    {example.category}
                  </span>
                  <h4 className="font-medium text-gray-900">
                    {example.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {example.prompt}
                </p>
              </div>
              <FiCopy className="text-gray-400 group-hover:text-primary-600 flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
