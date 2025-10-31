// api/generate-text-to-video/route.ts
// Genera video da descrizione testuale

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

/**
 * API ROUTE: GENERA VIDEO DA TESTO
 * 
 * Questa route permette di generare video a partire da una descrizione testuale.
 * È la modalità più semplice e flessibile per creare video con Veo.
 * 
 * INPUT:
 * - prompt: string (richiesto) - Descrizione del video da generare
 * - model: string (opzionale) - Modello Veo da usare (default: veo-3.1-generate-preview)
 * - config: object (opzionale) - Configurazione video:
 *   - aspectRatio: "16:9" | "9:16" (default: "16:9")
 *   - resolution: "720p" | "1080p" (default: "720p")
 *   - durationSeconds: 4 | 6 | 8 (default: 8)
 *   - negativePrompt: string (opzionale) - Cosa NON includere
 *   - personGeneration: "allow_all" | "allow_adult" | "dont_allow"
 * 
 * OUTPUT:
 * - operationId: string - ID per il polling dello stato
 * - status: "pending" - Stato iniziale
 * - message: string - Messaggio di conferma
 * 
 * ESEMPIO:
 * POST /api/generate-text-to-video
 * Body: {
 *   "prompt": "Una ripresa cinematografica di un leone nella savana",
 *   "config": {
 *     "aspectRatio": "16:9",
 *     "resolution": "720p",
 *     "durationSeconds": 8
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key non configurata' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      prompt,
      model = 'veo-3.1-generate-preview',
      config = {}
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt richiesto' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Avvia la generazione del video
    const operation = await ai.models.generateVideos({
      model,
      prompt,
      config: {
        aspectRatio: config.aspectRatio || '16:9',
        resolution: config.resolution || '720p',
        durationSeconds: config.durationSeconds || 8,
        negativePrompt: config.negativePrompt || undefined,
        personGeneration: config.personGeneration || 'allow_adult',
      },
    });

    // Restituisci l'operation ID per il polling
    return NextResponse.json({
      operationId: operation.name,
      status: 'pending',
      message: 'Generazione video avviata'
    });

  } catch (error: any) {
    console.error('Errore generazione video:', error);
    return NextResponse.json(
      { error: error.message || 'Errore nella generazione del video' },
      { status: 500 }
    );
  }
}
