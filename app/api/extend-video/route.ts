// api/extend-video/route.ts
// Estende un video generato precedentemente con Veo di altri 7 secondi

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
      video, // base64 string or file
      model = 'veo-3.1-generate-preview',
      config = {}
    } = body;

    if (!prompt || !video) {
      return NextResponse.json(
        { error: 'Prompt e video richiesti' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Se il video è in base64, convertilo
    let videoData;
    if (typeof video === 'string') {
      videoData = Buffer.from(video.split(',')[1] || video, 'base64');
    } else {
      videoData = video;
    }

    // Avvia l'estensione del video
    const operation = await ai.models.generateVideos({
      model,
      prompt,
      video: {
        videoBytes: videoData,
        mimeType: 'video/mp4',
      },
      config: {
        aspectRatio: config.aspectRatio || '16:9',
        resolution: '720p', // Must be 720p for extension
        durationSeconds: 8,
        personGeneration: 'allow_adult',
      },
    });

    return NextResponse.json({
      operationId: operation.name,
      status: 'pending',
      message: 'Estensione video avviata'
    });

  } catch (error: any) {
    console.error('Errore estensione video:', error);
    return NextResponse.json(
      { error: error.message || 'Errore nell\'estensione del video' },
      { status: 500 }
    );
  }
}
