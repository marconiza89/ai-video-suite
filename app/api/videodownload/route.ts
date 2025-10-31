import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { readFile } from 'fs/promises';

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
    const { videoUri } = body;

    if (!videoUri) {
      return NextResponse.json(
        { error: 'Video URI richiesto' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    // Download del video
    await ai.files.download({
      file: { uri: videoUri },
      downloadPath: './temp_video.mp4'
    });

    // Leggi il file scaricato e convertilo in base64
    const videoBuffer = await readFile('./temp_video.mp4');
    const videoBase64 = videoBuffer.toString('base64');

    return NextResponse.json({
      videoData: `data:video/mp4;base64,${videoBase64}`,
      message: 'Video scaricato con successo',
    });

  } catch (error: any) {
    console.error('Errore download video:', error);
    return NextResponse.json(
      { error: error.message || 'Errore nel download del video' },
      { status: 500 }
    );
  }
}