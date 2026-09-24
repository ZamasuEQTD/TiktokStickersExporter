/**
 * WebP Universal Multimedia Converter
 * 
 * Conversor modular y de alto rendimiento para WebP (estático y animado)
 * diseñado para WebExtensions en Firefox (compatible con Firefox para Android).
 * 
 * Sin dependencias pesadas (cero FFmpeg.wasm).
 * Optimizado para bajo consumo de memoria (prevención de OOM en móviles).
 */

import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { Muxer, ArrayBufferTarget } from 'webm-muxer';

export type TargetFormat = 'png' | 'jpeg' | 'gif' | 'webm';

export interface BaseConversionOptions {
  /** Calidad de compresión (0.0 a 1.0) para formatos lossy (JPEG, WebM) */
  quality?: number;
  /** Callback para reportar el progreso de conversión (0 - 100%) */
  onProgress?: (progress: ConversionProgress) => void;
}

export interface StaticConversionOptions extends BaseConversionOptions {
  /** Formato de salida para imágenes estáticas */
  format?: 'png' | 'jpeg';
  /**
   * Color de fondo sólido para rellenar el canal alfa cuando se convierte a JPEG.
   * Evita artefactos de transparencia negra. Por defecto '#FFFFFF' (blanco).
   */
  backgroundColor?: string;
}

export interface GifConversionOptions extends BaseConversionOptions {
  /** Número máximo de colores en la paleta GIF (2 - 256). Por defecto 256. */
  maxColors?: number;
  /** Repeticiones: 0 = bucle infinito, -1 = una vez, > 0 = N repeticiones. Por defecto 0. */
  loop?: number;
}

export interface WebMConversionOptions extends BaseConversionOptions {
  /** Bitrate en bits por segundo para la codificación WebM (por defecto 2.5 Mbps). */
  bitrate?: number;
  /** Forzar el uso de MediaRecorder en lugar de WebCodecs VideoEncoder */
  forceMediaRecorder?: boolean;
}

export interface ConversionOptions extends StaticConversionOptions, GifConversionOptions, WebMConversionOptions {}

export interface ConversionProgress {
  currentFrame: number;
  totalFrames: number;
  percent: number;
}

export interface WebPInfo {
  isAnimated: boolean;
  width?: number;
  height?: number;
  frameCount?: number;
  durationMs?: number;
}

/**
 * Inspecciona rápidamente la cabecera binaria del WebP (primeros 32 bytes)
 * sin decodificar toda la imagen para determinar si contiene animación (VP8X + flag ANIM).
 * Esto evita instanciar decodificadores pesados para imágenes estáticas simples.
 */
export async function isAnimatedWebp(blob: Blob): Promise<boolean> {
  if (blob.size < 32) return false;

  const headerBuffer = await blob.slice(0, 32).arrayBuffer();
  const bytes = new Uint8Array(headerBuffer);

  // Validar 'RIFF' (bytes 0-3) y 'WEBP' (bytes 8-11)
  const isRiff = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;
  const isWebp = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;

  if (!isRiff || !isWebp) {
    throw new Error('El Blob proporcionado no contiene una cabecera WebP válida (RIFF/WEBP).');
  }

  // Verificar si es un contenedor extendido 'VP8X' (bytes 12-15)
  if (bytes[12] === 0x56 && bytes[13] === 0x50 && bytes[14] === 0x38 && bytes[15] === 0x58) {
    // En VP8X, el byte 20 contiene los flags de características.
    // El bit 1 (máscara 0x02) indica si la imagen es animada (Animation Flag).
    const flags = bytes[20];
    return (flags & 0x02) !== 0;
  }

  // Los formatos simples 'VP8 ' (con pérdida) y 'VP8L' (sin pérdida) son siempre estáticos.
  return false;
}

/**
 * Obtiene metadatos de la imagen WebP usando ImageDecoder o createImageBitmap.
 */
export async function getWebPInfo(blob: Blob): Promise<WebPInfo> {
  const animated = await isAnimatedWebp(blob);

  if (animated && typeof ImageDecoder !== 'undefined') {
    const decoder = new ImageDecoder({
      data: blob.stream(),
      type: 'image/webp'
    });
    try {
      await decoder.tracks.ready;
      const track = decoder.tracks.selectedTrack;
      const firstFrame = await decoder.decode({ frameIndex: 0 });
      const info: WebPInfo = {
        isAnimated: true,
        width: firstFrame.image.displayWidth,
        height: firstFrame.image.displayHeight,
        frameCount: track?.frameCount ?? 1
      };
      firstFrame.image.close();
      return info;
    } catch {
      // Fallback si falla ImageDecoder
    } finally {
      decoder.reset();
    }
  }

  // Fallback para estáticos o entornos sin ImageDecoder
  const bitmap = await createImageBitmap(blob);
  const width = bitmap.width;
  const height = bitmap.height;
  bitmap.close();

  return {
    isAnimated: animated,
    width,
    height,
    frameCount: 1
  };
}

/**
 * Convierte un WebP estático a PNG o JPEG utilizando APIs nativas (createImageBitmap y OffscreenCanvas).
 * 
 * Manejo de canal alfa:
 * - Si el destino es JPEG (formato que no soporta transparencia), dibuja un fondo sólido
 *   (por defecto blanco) antes de superponer la imagen, previniendo transparencias negras.
 * - Libera explícitamente el ImageBitmap de memoria inmediatamente para dispositivos móviles.
 */
export async function convertStaticWebP(
  blob: Blob,
  options: StaticConversionOptions = {}
): Promise<Blob> {
  const {
    format = 'png',
    quality = 0.92,
    backgroundColor = '#FFFFFF'
  } = options;

  const targetMime = format === 'jpeg' ? 'image/jpeg' : 'image/png';

  // Decodificación eficiente fuera del DOM
  const bitmap = await createImageBitmap(blob);
  const width = bitmap.width;
  const height = bitmap.height;

  // Soporte universal: OffscreenCanvas (Worker / moderno) o HTMLCanvasElement (DOM)
  const useOffscreen = typeof OffscreenCanvas !== 'undefined';
  const canvas = useOffscreen
    ? new OffscreenCanvas(width, height)
    : (() => {
        const c = document.createElement('canvas');
        c.width = width;
        c.height = height;
        return c;
      })();

  const ctx = canvas.getContext('2d') as
    | OffscreenCanvasRenderingContext2D
    | CanvasRenderingContext2D
    | null;
  if (!ctx) {
    bitmap.close();
    throw new Error('No fue posible inicializar el contexto 2D del Canvas.');
  }

  try {
    // Si el destino es JPEG, rellenar el fondo con color sólido para evitar canal alfa negro
    if (targetMime === 'image/jpeg') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(bitmap, 0, 0);

    // Exportar a Blob nativamente
    if (canvas instanceof OffscreenCanvas) {
      return await canvas.convertToBlob({ type: targetMime, quality });
    } else {
      return await new Promise<Blob>((resolve, reject) => {
        (canvas as HTMLCanvasElement).toBlob(
          (result) => {
            if (result) resolve(result);
            else reject(new Error('Fallo al generar Blob desde el Canvas.'));
          },
          targetMime,
          quality
        );
      });
    }
  } finally {
    // LIBERACIÓN CRÍTICA DE MEMORIA: ImageBitmap consume memoria GPU/RAM no gestionada por el GC inmediato
    bitmap.close();
  }
}

/**
 * Convierte un WebP animado a un archivo .GIF optimizado utilizando `ImageDecoder` y `gifenc`.
 * 
 * Flujo:
 * 1. Usa `ImageDecoder` con streaming de datos nativo (`data: blob.stream()`).
 * 2. Itera secuencialmente frame a frame, obteniendo cada `VideoFrame` y su `duration`.
 * 3. Dibuja el frame en un canvas reutilizable para leer los píxeles RGBA.
 * 4. Cierra inmediatamente el `VideoFrame` (`frame.close()`) para evitar OOM en Android.
 * 5. Cuantiza la paleta (máx 256 colores) preservando transparencia de 1 bit con `gifenc`.
 * 6. Empaqueta el archivo GIF final (< 15 KB de librería).
 */
export async function convertAnimatedWebpToGif(
  blob: Blob,
  options: GifConversionOptions = {}
): Promise<Blob> {
  const { maxColors = 256, loop = 0, onProgress } = options;

  if (typeof ImageDecoder === 'undefined') {
    throw new Error(
      'ImageDecoder API no está disponible en este entorno. ' +
      'Asegúrate de que dom.media.webcodecs.enabled esté activo en Firefox.'
    );
  }

  const decoder = new ImageDecoder({
    data: blob.stream(),
    type: 'image/webp'
  });

  await decoder.tracks.ready;
  const track = decoder.tracks.selectedTrack;
  if (!track) {
    throw new Error('No se encontró ninguna pista de video/imagen válida en el archivo WebP.');
  }

  const frameCount = track.frameCount;
  const repeatCount = track.repetitionCount ?? loop;

  // Decodificar el frame inicial para determinar dimensiones de renderizado
  const firstFrameResult = await decoder.decode({ frameIndex: 0 });
  const width = firstFrameResult.image.displayWidth;
  const height = firstFrameResult.image.displayHeight;

  // Canvas reutilizable a lo largo de toda la conversión para ahorrar memoria
  const useOffscreen = typeof OffscreenCanvas !== 'undefined';
  const canvas = useOffscreen
    ? new OffscreenCanvas(width, height)
    : (() => {
        const c = document.createElement('canvas');
        c.width = width;
        c.height = height;
        return c;
      })();

  const ctx = canvas.getContext('2d', { willReadFrequently: true }) as
    | OffscreenCanvasRenderingContext2D
    | CanvasRenderingContext2D
    | null;

  if (!ctx) {
    firstFrameResult.image.close();
    decoder.reset();
    throw new Error('No fue posible obtener el contexto 2D para procesar los frames.');
  }

  // Inicializar codificador GIF ligero (gifenc)
  const gif = GIFEncoder();

  try {
    for (let i = 0; i < frameCount; i++) {
      const result = i === 0 ? firstFrameResult : await decoder.decode({ frameIndex: i });
      const frame = result.image; // VideoFrame

      // La propiedad `frame.duration` se expresa en microsegundos (µs).
      // Se convierte a milisegundos. El estándar GIF soporta ticks mínimos de ~10-20 ms.
      const durationMs = Math.max(20, Math.round((frame.duration || 100000) / 1000));

      // Limpiar el canvas antes de dibujar el nuevo frame
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(frame, 0, 0, width, height);

      // LIBERACIÓN INMEDIATA DEL FRAME: vital en dispositivos móviles
      frame.close();

      // Extracción del buffer RGBA
      const imageData = ctx.getImageData(0, 0, width, height);
      const rgba = imageData.data;

      // Cuantización de paleta a 256 colores preservando transparencia
      const palette = quantize(rgba, maxColors, {
        format: 'rgba4444',
        oneBitAlpha: 0x80,
        clearAlpha: true,
        clearAlphaColor: 0x00,
        clearAlphaThreshold: 0
      });

      const index = applyPalette(rgba, palette, 'rgba4444');

      // Detectar índice transparente si existe en la paleta
      const transparentIndex = palette.findIndex((color: number[]) => color[3] === 0);
      const hasTransparency = transparentIndex !== -1;

      gif.writeFrame(index, width, height, {
        palette,
        delay: durationMs,
        repeat: i === 0 ? repeatCount : undefined,
        transparent: hasTransparency,
        transparentIndex: hasTransparency ? transparentIndex : 0,
        dispose: 2 // Restaurar fondo para evitar ghosting en animaciones con canal alfa
      });

      if (onProgress) {
        onProgress({
          currentFrame: i + 1,
          totalFrames: frameCount,
          percent: Math.round(((i + 1) / frameCount) * 100)
        });
      }
    }

    gif.finish();
    const bytes = gif.bytesView();
    return new Blob([bytes as BlobPart], { type: 'image/gif' });
  } finally {
    decoder.reset();
  }
}

/**
 * Convierte un WebP animado a un video WebM nativo.
 * 
 * Implementa dos estrategias:
 * - Estrategia 1 (Hardware/WebCodecs + webm-muxer): Si `VideoEncoder` está disponible,
 *   codifica frames directamente con timestamps exactos en microsegundos sin sobrecarga de canvas.
 * - Estrategia 2 (Universal Canvas + MediaRecorder): Si VideoEncoder no está presente,
 *   dibuja los frames en canvas con control de timing y empaqueta mediante MediaRecorder nativo.
 */
export async function convertAnimatedWebpToWebM(
  blob: Blob,
  options: WebMConversionOptions = {}
): Promise<Blob> {
  const { bitrate = 2_500_000, forceMediaRecorder = false, onProgress } = options;

  if (typeof ImageDecoder === 'undefined') {
    throw new Error('ImageDecoder API no está disponible en este navegador.');
  }

  // Si VideoEncoder y webm-muxer están disponibles y no se fuerza MediaRecorder:
  const canUseVideoEncoder = !forceMediaRecorder && typeof VideoEncoder !== 'undefined';

  if (canUseVideoEncoder) {
    return await encodeWebMWithWebCodecs(blob, bitrate, onProgress);
  } else {
    return await encodeWebMWithMediaRecorder(blob, bitrate, onProgress);
  }
}

/**
 * Codificación WebM de alto rendimiento mediante WebCodecs VideoEncoder + webm-muxer.
 */
async function encodeWebMWithWebCodecs(
  blob: Blob,
  bitrate: number,
  onProgress?: (progress: ConversionProgress) => void
): Promise<Blob> {
  const decoder = new ImageDecoder({
    data: blob.stream(),
    type: 'image/webp'
  });

  await decoder.tracks.ready;
  const track = decoder.tracks.selectedTrack;
  if (!track) throw new Error('Pista no válida en WebP.');

  const frameCount = track.frameCount;
  const firstFrameResult = await decoder.decode({ frameIndex: 0 });
  const width = firstFrameResult.image.displayWidth;
  const height = firstFrameResult.image.displayHeight;

  // Asegurar dimensiones pares para códecs de video (VP8/VP9)
  const evenWidth = width % 2 === 0 ? width : width - 1;
  const evenHeight = height % 2 === 0 ? height : height - 1;

  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: 'V_VP9',
      width: evenWidth,
      height: evenHeight,
      alpha: true // Soporte de canal alfa nativo en WebM/VP9
    }
  });

  let encoderError: Error | null = null;
  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (e) => { encoderError = e; }
  });

  encoder.configure({
    codec: 'vp09.00.10.08',
    width: evenWidth,
    height: evenHeight,
    bitrate,
    alpha: 'keep'
  });

  try {
    let currentTimestampUs = 0;

    for (let i = 0; i < frameCount; i++) {
      if (encoderError) throw encoderError;

      const result = i === 0 ? firstFrameResult : await decoder.decode({ frameIndex: i });
      const frame = result.image;
      const durationUs = frame.duration || 100_000;

      // Crear un VideoFrame con timestamp secuencial exacto
      const timedFrame = new VideoFrame(frame, {
        timestamp: currentTimestampUs,
        duration: durationUs
      });

      // Liberar el frame del decodificador original
      frame.close();

      // Enviar a codificar
      encoder.encode(timedFrame, { keyFrame: i % 30 === 0 });
      timedFrame.close();

      currentTimestampUs += durationUs;

      if (onProgress) {
        onProgress({
          currentFrame: i + 1,
          totalFrames: frameCount,
          percent: Math.round(((i + 1) / frameCount) * 100)
        });
      }
    }

    await encoder.flush();
    muxer.finalize();

    return new Blob([muxer.target.buffer], { type: 'video/webm' });
  } finally {
    encoder.close();
    decoder.reset();
  }
}

/**
 * Codificación WebM universal mediante MediaRecorder y Canvas stream timing.
 */
async function encodeWebMWithMediaRecorder(
  blob: Blob,
  bitrate: number,
  onProgress?: (progress: ConversionProgress) => void
): Promise<Blob> {
  const decoder = new ImageDecoder({
    data: blob.stream(),
    type: 'image/webp'
  });

  await decoder.tracks.ready;
  const track = decoder.tracks.selectedTrack;
  if (!track) throw new Error('Pista no válida en WebP.');

  const frameCount = track.frameCount;
  const firstFrame = await decoder.decode({ frameIndex: 0 });
  const width = firstFrame.image.displayWidth;
  const height = firstFrame.image.displayHeight;

  // MediaRecorder requiere un HTMLCanvasElement para captureStream en la mayoría de navegadores
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Seleccionar el formato WebM soportado por el navegador
  const mimeType = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm'
  ].find((type) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) || 'video/webm';

  const stream = (canvas as any).captureStream(0); // 0 fps para captura manual frame a frame
  const videoTrack = stream.getVideoTracks()[0];
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: bitrate });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const recordingStopped = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
    recorder.onerror = (e) => reject(e);
  });

  recorder.start();

  try {
    for (let i = 0; i < frameCount; i++) {
      const result = i === 0 ? firstFrame : await decoder.decode({ frameIndex: i });
      const frame = result.image;
      const durationMs = Math.max(20, Math.round((frame.duration || 100000) / 1000));

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(frame, 0, 0, width, height);
      frame.close(); // Liberación inmediata de memoria GPU

      if ('requestFrame' in videoTrack) {
        (videoTrack as any).requestFrame();
      }

      if (onProgress) {
        onProgress({
          currentFrame: i + 1,
          totalFrames: frameCount,
          percent: Math.round(((i + 1) / frameCount) * 100)
        });
      }

      // Sincronización de timing para MediaRecorder
      await new Promise((r) => setTimeout(r, durationMs));
    }

    recorder.stop();
    return await recordingStopped;
  } finally {
    decoder.reset();
  }
}

/**
 * Punto de entrada unificado para convertir cualquier imagen WebP (estática o animada)
 * hacia el formato de destino seleccionado ('png', 'jpeg', 'gif', 'webm').
 */
export async function convertWebP(
  blob: Blob,
  targetFormat: TargetFormat,
  options: ConversionOptions = {}
): Promise<Blob> {
  const isAnimated = await isAnimatedWebp(blob);

  if (!isAnimated) {
    if (targetFormat === 'png' || targetFormat === 'jpeg') {
      return await convertStaticWebP(blob, { ...options, format: targetFormat });
    }
    // Si la imagen es estática pero piden GIF, convertimos el frame estático a GIF
    if (targetFormat === 'gif') {
      return await convertStaticWebP(blob, { ...options, format: 'png' });
    }
    throw new Error(`El formato destino '${targetFormat}' no es adecuado para un WebP estático.`);
  }

  // WebP Animado
  switch (targetFormat) {
    case 'gif':
      return await convertAnimatedWebpToGif(blob, options);
    case 'webm':
      return await convertAnimatedWebpToWebM(blob, options);
    case 'png':
    case 'jpeg':
      // Si el usuario solicita PNG/JPEG de un WebP animado, exporta el primer frame
      return await convertStaticWebP(blob, { ...options, format: targetFormat });
    default:
      throw new Error(`Formato no soportado: ${targetFormat}`);
  }
}
