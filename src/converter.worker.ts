/**
 * Dedicated Web Worker para la conversión de imágenes WebP.
 * 
 * Permite ejecutar la cuantización de colores, el empaquetado GIF y la codificación
 * WebM fuera del hilo principal (UI thread), previniendo congelamientos de interfaz
 * y errores de ANR (Application Not Responding) en Firefox para Android.
 */

import { convertWebP, TargetFormat, ConversionOptions, ConversionProgress } from './converter';

export interface WorkerRequestMessage {
  id: string;
  action: 'convert';
  buffer: ArrayBuffer;
  mimeType: string;
  targetFormat: TargetFormat;
  options?: ConversionOptions;
}

export interface WorkerProgressMessage {
  id: string;
  type: 'progress';
  progress: ConversionProgress;
}

export interface WorkerSuccessMessage {
  id: string;
  type: 'success';
  buffer: ArrayBuffer;
  mimeType: string;
}

export interface WorkerErrorMessage {
  id: string;
  type: 'error';
  error: string;
}

export type WorkerResponseMessage = WorkerProgressMessage | WorkerSuccessMessage | WorkerErrorMessage;

self.onmessage = async (event: MessageEvent<WorkerRequestMessage>) => {
  const { id, action, buffer, mimeType, targetFormat, options = {} } = event.data;

  if (action !== 'convert') return;

  try {
    const inputBlob = new Blob([buffer], { type: mimeType || 'image/webp' });

    // Enviar reportes de progreso al hilo principal
    const conversionOptions: ConversionOptions = {
      ...options,
      onProgress: (progress: ConversionProgress) => {
        const progressMsg: WorkerProgressMessage = {
          id,
          type: 'progress',
          progress
        };
        (self as any).postMessage(progressMsg);
      }
    };

    const outputBlob = await convertWebP(inputBlob, targetFormat, conversionOptions);
    const outputBuffer = await outputBlob.arrayBuffer();

    const successMsg: WorkerSuccessMessage = {
      id,
      type: 'success',
      buffer: outputBuffer,
      mimeType: outputBlob.type
    };

    // Transferir el ArrayBuffer resultante con zero-copy para optimizar la memoria en Android
    (self as any).postMessage(successMsg, [outputBuffer]);
  } catch (err: any) {
    const errorMsg: WorkerErrorMessage = {
      id,
      type: 'error',
      error: err?.message || String(err)
    };
    (self as any).postMessage(errorMsg);
  }
};
