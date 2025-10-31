// api/generate-text-to-video/route.ts
// Genera video da descrizione testuale

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
    let operation = await ai.models.generateVideos({
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

    while (!operation.done) {
      console.log("Waiting for video generation to complete...")
      await new Promise((resolve) => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({
        operation: operation,
      });
    }

    if (!operation.response || !operation.response.generatedVideos || operation.response.generatedVideos.length === 0) {
      return NextResponse.json(
        { error: 'Nessun video generato' },
        { status: 500 }
      );
    }

    const video = operation.response.generatedVideos[0].video;
    if (!video) {
      return NextResponse.json(
        { error: 'Video non disponibile' },
        { status: 500 }
      );
    }

    ai.files.download({
      file: video,
      downloadPath: "dialogue_example.mp4",
    });
    console.log(`Generated video saved to dialogue_example.mp4`);

    return NextResponse.json({
      success: true,
      message: 'Video generato con successo'
    });

  } catch (error: any) {
    console.error('Errore generazione video:', error);
    return NextResponse.json(
      { error: error.message || 'Errore nella generazione del video' },
      { status: 500 }
    );
  }
}
