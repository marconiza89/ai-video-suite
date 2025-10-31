// api/poll-operation/route.ts
// Controlla lo stato di un'operazione di generazione video in corso

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
    const { operationId } = body;

    if (!operationId) {
      return NextResponse.json(
        { error: 'Operation ID richiesto' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Recupera lo stato dell'operazione usando il metodo corretto
    const operation = await ai.operations.get(operationId);

    if (operation.done) {
      if (operation.error) {
        return NextResponse.json({
          operationId,
          status: 'failed',
          error: operation.error.message,
        });
      }

      // Video completato - prepara il download
      const video = (operation.response as any)?.generatedVideos?.[0];
      
      if (video) {
        return NextResponse.json({
          operationId,
          status: 'completed',
          videoUri: video.video.uri,
          message: 'Video generato con successo',
        });
      }
    }

    return NextResponse.json({
      operationId,
      status: 'processing',
      message: 'Video in elaborazione...',
    });

  } catch (error: any) {
    console.error('Errore polling operazione:', error);
    return NextResponse.json(
      { error: error.message || 'Errore nel recupero dello stato' },
      { status: 500 }
    );
  }
}