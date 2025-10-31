// api/generate-interpolation/route.ts
// Genera video con interpolazione tra primo e ultimo frame

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

/**
 * API ROUTE: GENERA VIDEO CON INTERPOLAZIONE
 * 
 * Questa route crea un video specificando il primo e l'ultimo frame.
 * Veo genera automaticamente i frame intermedi per creare una transizione fluida.
 * Ideale per creare animazioni con controllo preciso su inizio e fine.
 * 
 * INPUT:
 * - prompt: string (richiesto) - Descrizione della transizione tra i frame
 * - firstFrame: string (richiesto) - Primo frame in base64
 * - lastFrame: string (richiesto) - Ultimo frame in base64
 * - model: string (opzionale) - Modello Veo da usare (default: veo-3.1-generate-preview)
 * - config: object (opzionale) - Configurazione video
 * 
 * OUTPUT:
 * - operationId: string - ID per il polling dello stato
 * - status: "pending" - Stato iniziale
 * - message: string - Messaggio di conferma
 * 
 * LIMITAZIONI:
 * - La durata DEVE essere 8 secondi (fisso)
 * - Supporta aspect ratio 16:9 e 9:16
 * - Risoluzione 720p o 1080p
 * - personGeneration deve essere "allow_adult"
 * 
 * ESEMPIO:
 * POST /api/generate-interpolation
 * Body: {
 *   "prompt": "Un gatto alla guida si lancia dalla scogliera e decolla",
 *   "firstFrame": "data:image/png;base64,...",
 *   "lastFrame": "data:image/png;base64,...",
 *   "config": { "resolution": "720p" }
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
      firstFrame, // base64 string
      lastFrame,  // base64 string
      model = 'veo-3.1-generate-preview',
      config = {}
    } = body;

    if (!prompt || !firstFrame || !lastFrame) {
      return NextResponse.json(
        { error: 'Prompt, primo frame e ultimo frame richiesti' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Estrai la parte base64 dalle stringhe
    const firstImageBase64 = firstFrame.split(',')[1] || firstFrame;
    const lastImageBase64 = lastFrame.split(',')[1] || lastFrame;

    // Avvia la generazione del video con interpolazione
    const operation = await ai.models.generateVideos({
      model,
      prompt,
      image: {
        imageBytes: firstImageBase64,
        mimeType: 'image/png',
      },
      config: {
        lastFrame: {
          imageBytes: lastImageBase64,
          mimeType: 'image/png',
        },
        aspectRatio: config.aspectRatio || '16:9',
        resolution: config.resolution || '720p',
        durationSeconds: 8, // Must be 8 for interpolation
        personGeneration: 'allow_adult',
      },
    });

    return NextResponse.json({
      operationId: operation.name,
      status: 'pending',
      message: 'Generazione video con interpolazione avviata'
    });

  } catch (error: any) {
    console.error('Errore interpolazione video:', error);
    return NextResponse.json(
      { error: error.message || 'Errore nella generazione del video' },
      { status: 500 }
    );
  }
}
