// api/generate-with-references/route.ts
// Genera video usando fino a 3 immagini di riferimento per guidare stile e contenuto

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

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
      referenceImages, // array of {image: base64, referenceType: 'asset' | 'style'}
      model = 'veo-3.1-generate-preview',
      config = {}
    } = body;

    if (!prompt || !referenceImages || referenceImages.length === 0) {
      return NextResponse.json(
        { error: 'Prompt e almeno una immagine di riferimento richiesti' },
        { status: 400 }
      );
    }

    if (referenceImages.length > 3) {
      return NextResponse.json(
        { error: 'Massimo 3 immagini di riferimento consentite' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Prepara le immagini di riferimento
    const processedReferenceImages = referenceImages.map((ref: any) => {
      const imageBytes = Buffer.from(ref.image.split(',')[1] || ref.image, 'base64');
      return {
        image: {
          imageBytes,
          mimeType: 'image/png',
        },
        referenceType: ref.referenceType || 'asset',
      };
    });

    // Avvia la generazione del video con immagini di riferimento
    const operation = await ai.models.generateVideos({
      model,
      prompt,
      config: {
        referenceImages: processedReferenceImages,
        aspectRatio: '16:9', // Must be 16:9 for reference images
        resolution: config.resolution || '720p',
        durationSeconds: 8, // Must be 8 for reference images
        personGeneration: 'allow_adult',
      },
    });

    return NextResponse.json({
      operationId: operation.name,
      status: 'pending',
      message: 'Generazione video con immagini di riferimento avviata'
    });

  } catch (error: any) {
    console.error('Errore generazione con immagini di riferimento:', error);
    return NextResponse.json(
      { error: error.message || 'Errore nella generazione del video' },
      { status: 500 }
    );
  }
}
