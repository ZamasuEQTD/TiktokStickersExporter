/**
 * Worker Bridge & Helper
 * 
 * Gestiona el ciclo de vida del Web Worker en WebExtensions y provee
 * una interfaz unificada basada en Promises con transferencia zero-copy.
 */

import browser from 'webextension-polyfill';
import { TargetFormat, ConversionOptions, ConversionProgress, convertWebP } from './converter';
import { WorkerRequestMessage, WorkerResponseMessage } from './converter.worker';

declare const chrome: any;

let activeWorker: Worker | null = null;
const pendingRequests = new Map<
  string,
  {
    resolve: (blob: Blob) => void;
    reject: (error: Error) => void;
    onProgress?: (progress: ConversionProgress) => void;
  }
>();

/**
 * Obtiene o instancia el Web Worker dedicado utilizando la URL de la extensión.
 */
function getOrCreateWorker(): Worker {
  if (activeWorker) return activeWorker;

  try {
    const ext = typeof browser !== 'undefined' && browser?.runtime
      ? browser
      : (typeof chrome !== 'undefined' && chrome?.runtime ? chrome : null);

    if (ext?.runtime?.getURL) {
      const workerUrl = ext.runtime.getURL('converter.worker.js');
      activeWorker = new Worker(workerUrl);
    } else {
      activeWorker = new Worker(new URL('./converter.worker.ts', import.meta.url), { type: 'module' });
    }
  } catch {
    // Fallback estándar si se ejecuta fuera del contexto de extensión o en testing
    activeWorker = new Worker(new URL('./converter.worker.ts', import.meta.url), { type: 'module' });
  }

  activeWorker.onmessage = (event: MessageEvent<WorkerResponseMessage>) => {
    const msg = event.data;
    const pending = pendingRequests.get(msg.id);
    if (!pending) return;

    if (msg.type === 'progress') {
      if (pending.onProgress) pending.onProgress(msg.progress);
    } else if (msg.type === 'success') {
      pendingRequests.delete(msg.id);
      const resultBlob = new Blob([msg.buffer], { type: msg.mimeType });
      pending.resolve(resultBlob);
    } else if (msg.type === 'error') {
      pendingRequests.delete(msg.id);
      pending.reject(new Error(msg.error));
    }
  };

  activeWorker.onerror = (err) => {
    console.error('Error no capturado en WebP Converter Worker:', err);
  };

  return activeWorker;
}

/**
 * Convierte un Blob WebP utilizando un Web Worker en segundo plano para no congelar la UI.
 * 
 * Incluye optimización de memoria zero-copy mediante transferencia de ArrayBuffer
 * y fallback automático al hilo local si el entorno no permite instanciar Workers.
 */
export async function convertWebPInWorker(
  blob: Blob,
  targetFormat: TargetFormat,
  options: ConversionOptions = {}
): Promise<Blob> {
  // Si los Workers no están disponibles en el contexto actual, ejecutar en hilo local
  if (typeof Worker === 'undefined') {
    return await convertWebP(blob, targetFormat, options);
  }

  try {
    const worker = getOrCreateWorker();
    const id = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const buffer = await blob.arrayBuffer();

    return await new Promise<Blob>((resolve, reject) => {
      pendingRequests.set(id, {
        resolve,
        reject,
        onProgress: options.onProgress
      });

      const message: WorkerRequestMessage = {
        id,
        action: 'convert',
        buffer,
        mimeType: blob.type,
        targetFormat,
        options: {
          ...options,
          onProgress: undefined // Los callbacks no son clonables por structuredClone
        }
      };

      // Transferencia zero-copy del buffer para optimizar la RAM en dispositivos Android
      worker.postMessage(message, [buffer]);
    });
  } catch (workerErr) {
    console.warn('Fallo al procesar en Worker, ejecutando fallback en hilo principal:', workerErr);
    return await convertWebP(blob, targetFormat, options);
  }
}

/**
 * Termina el Worker activo y libera los recursos del sistema.
 */
export function terminateConverterWorker(): void {
  if (activeWorker) {
    activeWorker.terminate();
    activeWorker = null;
    pendingRequests.clear();
  }
}
