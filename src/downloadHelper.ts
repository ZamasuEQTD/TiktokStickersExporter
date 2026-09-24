/**
 * Download & Storage Helper
 * 
 * Gestiona la descarga o guardado local del archivo convertido en Firefox (Escritorio y Android).
 * Utiliza browser.downloads.download con fallback a Object URL (<a> download) para máxima compatibilidad.
 */

import browser from 'webextension-polyfill';

declare const chrome: any;

export interface DownloadOptions {
  filename: string;
  saveAs?: boolean;
}

/**
 * Descarga un Blob generado automáticamente utilizando la API de extensiones o el DOM.
 * 
 * En Android y Firefox, revoca adecuadamente la Object URL tras la descarga para prevenir fugas de memoria.
 */
export async function downloadBlob(blob: Blob, options: DownloadOptions): Promise<void> {
  const { filename, saveAs = false } = options;
  const objectUrl = URL.createObjectURL(blob);

  try {
    // 1. Intentar descargar mediante la API nativa de WebExtensions (browser o chrome)
    const ext = typeof browser !== 'undefined' && browser.downloads
      ? browser
      : (typeof chrome !== 'undefined' && (chrome as any).downloads ? (chrome as any) : null);

    if (ext && typeof ext.downloads?.download === 'function') {
      await ext.downloads.download({
        url: objectUrl,
        filename,
        saveAs
      });
      return;
    }

    // 2. Fallback: descarga directa en el DOM vía elemento ancla virtual (ideal para content scripts o Android)
    if (typeof document !== 'undefined') {
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    throw new Error('No hay ningún mecanismo disponible en el entorno actual para descargar el archivo.');
  } finally {
    // Revocar la URL de objeto tras un breve retraso para asegurar que la descarga ya haya iniciado
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 60000);
  }
}
