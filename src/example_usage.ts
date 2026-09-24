/**
 * Ejemplo de Invocación y Uso Completo
 * WebP Universal Converter (Firefox Desktop & Android)
 */

import { convertWebP, isAnimatedWebp, getWebPInfo } from './converter';
import { convertWebPInWorker } from './workerBridge';
import { downloadBlob } from './downloadHelper';

/**
 * Ejemplo 1: Conversión directa de un Blob WebP (Estático o Animado)
 */
export async function exampleDirectConversion(webpBlob: Blob) {
  try {
    // 1. Detección rápida sin sobrecarga
    const isAnimated = await isAnimatedWebp(webpBlob);
    console.log(`¿Es WebP animado?: ${isAnimated}`);

    let convertedBlob: Blob;

    if (isAnimated) {
      // 2a. Convertir WebP animado a GIF (con gifenc e ImageDecoder)
      console.log('Convirtiendo WebP animado a GIF...');
      convertedBlob = await convertWebP(webpBlob, 'gif', {
        maxColors: 256,
        onProgress: (p) => console.log(`Progreso GIF: ${p.percent}% (Frame ${p.currentFrame}/${p.totalFrames})`)
      });

      // Descargar el archivo resultante
      await downloadBlob(convertedBlob, { filename: 'sticker-animado.gif' });
    } else {
      // 2b. Convertir WebP estático a JPEG con relleno blanco anti-artefactos negros
      console.log('Convirtiendo WebP estático a JPEG...');
      convertedBlob = await convertWebP(webpBlob, 'jpeg', {
        quality: 0.95,
        backgroundColor: '#FFFFFF' // Relleno de fondo para canal alfa
      });

      // Descargar el archivo resultante
      await downloadBlob(convertedBlob, { filename: 'sticker-estatico.jpg' });
    }

    return convertedBlob;
  } catch (err) {
    console.error('Error durante la conversión:', err);
    throw err;
  }
}

/**
 * Ejemplo 2: Conversión optimizada en Web Worker para Móviles (Firefox Android)
 * Ejecuta la cuantización y codificación fuera del hilo de UI para evitar congelamientos.
 */
export async function exampleWorkerConversion(webpBlob: Blob) {
  try {
    console.log('Iniciando conversión en segundo plano (Web Worker)...');

    const gifBlob = await convertWebPInWorker(webpBlob, 'gif', {
      maxColors: 256,
      onProgress: (p) => {
        console.log(`[Worker] Progreso: ${p.percent}% (${p.currentFrame}/${p.totalFrames})`);
      }
    });

    console.log(`Conversión completada. Tamaño: ${gifBlob.size} bytes, Tipo: ${gifBlob.type}`);

    // Descarga automática segura en Firefox Android
    await downloadBlob(gifBlob, {
      filename: `sticker-${Date.now()}.gif`
    });

    return gifBlob;
  } catch (err) {
    console.error('Error en conversión con Worker:', err);
    throw err;
  }
}

/**
 * Ejemplo 3: Conversión de WebP animado a Video WebM nativo
 */
export async function exampleWebMConversion(animatedWebpBlob: Blob) {
  try {
    console.log('Convirtiendo WebP animado a WebM...');

    const webmBlob = await convertWebP(animatedWebpBlob, 'webm', {
      bitrate: 2_500_000, // 2.5 Mbps
      onProgress: (p) => console.log(`Progreso WebM: ${p.percent}%`)
    });

    await downloadBlob(webmBlob, {
      filename: `sticker-video.webm`
    });

    return webmBlob;
  } catch (err) {
    console.error('Error al exportar a WebM:', err);
    throw err;
  }
}
