// api/generate-image-to-video/route.ts
// Genera video partendo da un'immagine statica

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

/**
 * API ROUTE: GENERA VIDEO DA IMMAGINE
 * 
 * Questa route anima un'immagine statica creando un video dove l'immagine
 * diventa il primo frame. Ideale per dare vita a illustrazioni, foto o disegni.
 * 
 * INPUT:
 * - prompt: string (richiesto) - Descrizione di come animare l'immagine
 * - image: string (richiesto) - Immagine in base64 (con o senza data URI prefix)
 * - model: string (opzionale) - Modello Veo da usare (default: veo-3.1-generate-preview)
 * - config: object (opzionale) - Configurazione video (vedi generate-text-to-video)
 * 
 * OUTPUT:
 * - operationId: string - ID per il polling dello stato
 * - status: "pending" - Stato iniziale
 * - message: string - Messaggio di conferma
 * 
 * NOTE:
 * - L'immagine viene usata come primo frame del video
 * - Supporta formati: PNG, JPG, JPEG, WebP
 * - Max dimensione: 10MB
 * 
 * ESEMPIO:
 * POST /api/generate-image-to-video
 * Body: {
 *   "prompt": "La farfalla sbatte le ali e vola via",
 *   "image": "data:image/png;base64,iVBORw0KG...",
 *   "config": { "durationSeconds": 8 }
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
      image, // base64 string
      model = 'veo-3.1-generate-preview',
      config = {}
    } = body;

    if (!prompt || !image) {
      return NextResponse.json(
        { error: 'Prompt e immagine richiesti' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Estrai base64 pulito (senza data URI prefix se presente)
    const base64Image = image.includes(',') ? image.split(',')[1] : image;
// Passa una stringa base64 pura
    // Avvia la generazione del video
    const operation = await ai.models.generateVideos({
      model,
      prompt,
      image: {
        imageBytes: base64Image,
        mimeType: 'image/png',
      },
      config: {
        aspectRatio: config.aspectRatio || '16:9',
        resolution: config.resolution || '720p',
        durationSeconds: config.durationSeconds || 8,
        negativePrompt: config.negativePrompt || undefined,
        personGeneration: 'allow_adult',
      },
    });

    return NextResponse.json({
      operationId: operation.name,
      status: 'pending',
      message: 'Generazione video da immagine avviata'
    });

  } catch (error: any) {
    console.error('Errore generazione video da immagine:', error);
    return NextResponse.json(
      { error: error.message || 'Errore nella generazione del video' },
      { status: 500 }
    );
  }
}
