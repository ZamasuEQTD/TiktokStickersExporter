import JSZip from 'jszip';
import browser from 'webextension-polyfill';

const translations = {
  en: {
    settings: "Settings",
    delayLabel: "Delay between downloads (seconds):",
    clearHistory: "Clear Download History",
    historyCleared: "History cleared. Reload the page to see changes.",
    confirmClear: "Are you sure you want to clear the history? All stickers will appear as 'New'.",
    close: "Close",
    download: "Download",
    downloadZip: "Download ZIP",
    confirmZipTitle: "Compress stickers in a ZIP?",
    confirmSeqTitle: "Download stickers?",
    noStickersOnScreen: "No stickers found in this chat!",
    errorDownload: "Error downloading:",
    errorZip: "An error occurred while creating the ZIP file.",
    downloadCount: "Download ({count})",
    newStickers: "New ({count})",
    oldStickers: "On device ({count})",
    noNewStickers: "No new stickers on screen.",
    noOldStickers: "No downloaded stickers found.",
    selectAll: "Select all",
    cancelSelection: "Cancel selection",
    cancel: "Cancel",
    downloadThis: "Download this sticker",
    alreadyDownloadedTooltip: "Already downloaded (click to re-download)",
    languageLabel: "Language / Idioma:",
    langAuto: "Auto",
    langEn: "English",
    langEs: "Español",
    compressingTitle: "Compressing stickers...",
    compressingProgress: "Processing sticker {current} of {total}...",
    generatingZip: "Generating ZIP file...",
    downloadingTitle: "Downloading stickers...",
    downloadingProgress: "Downloading sticker {current} of {total}...",
    completedTitle: "Completed!",
    completedZip: "ZIP file generated and downloaded successfully.",
    completedSeq: "Stickers downloaded successfully.",
    scanChat: "Scan chat",
    scanningProgress: "Scanning ({count})...",
    scanFinished: "Scan complete! Found {count} stickers.",
    stopScan: "Stop scan",
    scanningTitle: "Scanning stickers...",
    scanningSubtitle: "Searching chat history for stickers...",
    stickersFound: "{count} stickers found",
    chatFullyScanned: "Full history",
    chatFullyScannedTooltip: "Entire chat history has been scanned from the beginning. Click to re-scan.",
    viewStickers: "View stickers ({count})",
    viewStickersNoCount: "View stickers",
    viewStickersTitle: "TikTok Stickers",
    downloadSelectedBtn: "Download stickers ({count})",
    chooseDownloadFormat: "Choose download format",
    downloadZipOption: "ZIP File (.zip)",
    downloadZipOptionDesc: "Package all selected stickers into a single archive",
    downloadSeqOption: "Individual download",
    downloadSeqOptionDesc: "Download each sticker one by one to your device",
    downloadSeqBtn: "Download ({count})",
    downloadZipBtn: "Download ZIP ({count})",
    downloadSeqTooltip: "Download selected stickers one by one",
    downloadZipTooltip: "Compress and download all selected stickers in a single ZIP",
  
    redirectTitle: "TikTok Stickers Exporter",
    redirectQuestion: "Do you want to download stickers?",
    redirectSubtitle: "Go to your TikTok messages to view, scan, and download all your stickers.",
    goToMessages: "Go to Messages",
    notNow: "Not now",
    cancelScanTitle: "Cancel scan?",
    cancelScanSubtitle: "A scan is in progress. Switching chats or leaving will cancel the current scan.",
    cancelScanConfirm: "Cancel scan",
    continueScanning: "Keep scanning",
  },
  es: {
    settings: "Configuración",
    delayLabel: "Retraso entre descargas (segundos):",
    clearHistory: "Limpiar Historial de Descargas",
    historyCleared: "Historial borrado. Recarga la página para ver los cambios.",
    confirmClear: "¿Estás seguro de borrar el historial? Todos los stickers volverán a aparecer como 'Nuevos'.",
    close: "Cerrar",
    download: "Descargar",
    downloadZip: "Descargar ZIP",
    confirmZipTitle: "¿Comprimir stickers en un ZIP?",
    confirmSeqTitle: "¿Descargar stickers?",
    noStickersOnScreen: "¡No se encontraron stickers en este chat!",
    errorDownload: "Error al descargar:",
    errorZip: "Ocurrió un error al crear el archivo ZIP.",
    downloadCount: "Descargar ({count})",
    newStickers: "Nuevos ({count})",
    oldStickers: "En el dispositivo ({count})",
    noNewStickers: "No hay stickers nuevos en la pantalla.",
    noOldStickers: "No hay stickers descargados aún.",
    selectAll: "Seleccionar todos",
    cancelSelection: "Cancelar selección",
    cancel: "Cancelar",
    downloadThis: "Descargar este sticker",
    alreadyDownloadedTooltip: "Ya descargado (clic para volver a descargar)",
    languageLabel: "Idioma / Language:",
    langAuto: "Automático",
    langEn: "English",
    langEs: "Español",
    compressingTitle: "Comprimiendo stickers...",
    compressingProgress: "Procesando sticker {current} de {total}...",
    generatingZip: "Generando archivo ZIP...",
    downloadingTitle: "Descargando stickers...",
    downloadingProgress: "Descargando sticker {current} de {total}...",
    completedTitle: "¡Completado!",
    completedZip: "Archivo ZIP generado y descargado con éxito.",
    completedSeq: "Stickers descargados con éxito.",
    scanChat: "Escanear chat",
    scanningProgress: "Analizando ({count})...",
    scanFinished: "¡Análisis terminado! Se encontraron {count} stickers.",
    stopScan: "Detener",
    scanningTitle: "Escaneando stickers...",
    scanningSubtitle: "Buscando stickers en el historial del chat...",
    stickersFound: "{count} stickers encontrados",
    chatFullyScanned: "Historial completo",
    chatFullyScannedTooltip: "Se ha analizado todo el historial del chat desde el inicio. Clic para volver a escanear.",
    viewStickers: "Ver stickers ({count})",
    viewStickersNoCount: "Ver stickers",
    viewStickersTitle: "Stickers de TikTok",
    downloadSelectedBtn: "Descargar stickers ({count})",
    chooseDownloadFormat: "Elige el formato de descarga",
    downloadZipOption: "Archivo ZIP (.zip)",
    downloadZipOptionDesc: "Empaqueta todos los stickers seleccionados en un único archivo",
    downloadSeqOption: "Descarga individual",
    downloadSeqOptionDesc: "Descarga cada sticker uno por uno directamente a tu dispositivo",
    downloadSeqBtn: "Descargar ({count})",
    downloadZipBtn: "Descargar ZIP ({count})",
    downloadSeqTooltip: "Descargar los stickers seleccionados uno por uno",
    downloadZipTooltip: "Comprimir y descargar todos los stickers seleccionados en un archivo ZIP",
  
    redirectTitle: "TikTok Stickers Exporter",
    redirectQuestion: "¿Quieres descargar tus stickers?",
    redirectSubtitle: "Entra a tus Mensajes de TikTok para ver, escanear y descargar todos tus stickers.",
    goToMessages: "Ir a Mensajes",
    notNow: "Ahora no",
    cancelScanTitle: "¿Cancelar escaneo?",
    cancelScanSubtitle: "Hay un escaneo en curso. Si cambias de chat o sales, se cancelará el escaneo actual.",
    cancelScanConfirm: "Cancelar escaneo",
    continueScanning: "Continuar escaneando",
  }
};

const getLang = (): 'en' | 'es' => {
  const forced = localStorage.getItem("tiktok-stickers-exporter-lang");
  if (forced === "es" || forced === "en") return forced;
  const lang = navigator.language.toLowerCase();
  return lang.startsWith("es") ? "es" : "en";
};

const t = (key: keyof typeof translations['en'], params?: Record<string, string | number>) => {
  const lang = getLang();
  let text = translations[lang][key] || translations['en'][key] || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
};

console.log("TikTok Stickers Exporter content script loaded!");

const getExtension = (res: Response): string => {
  const contentType = res.headers.get("content-type");
  if (!contentType) return "webp";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  if (contentType.includes("gif")) return "gif";
  return "webp";
};

// Helper para detectar si estamos en un dispositivo móvil (Firefox Android, Chrome Android/iOS, o probando con resolución móvil)
const isMobileDevice = (): boolean => {
  // 1. Detección estándar si el User-Agent contiene indicadores móviles:
  const ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) {
    return true;
  }

  // 2. Detección por hardware para smartphones físicos:
  const hasTouch = typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || 'ontouchstart' in window);
  const isPhoneScreen = typeof window !== 'undefined' && typeof window.screen !== 'undefined' && Math.min(window.screen.width, window.screen.height) <= 600;
  if (hasTouch && isPhoneScreen) {
    return true;
  }

  // 3. Detección por ancho de viewport para pruebas en Chrome en PC (resolución <= 650px):
  if (typeof window !== 'undefined' && window.innerWidth > 0 && window.innerWidth <= 650) {
    return true;
  }

  return false;
};

// Funciones para manejar el historial de descargas en localStorage
const getStickerId = (url: string): string => {
  try {
    return url.split('?')[0]; // La base de la URL es única y estable, los query params caducan
  } catch(e) {
    return url;
  }
};

const isDownloaded = (url: string): boolean => {
  return localStorage.getItem(`tiktok-sticker-downloaded-${getStickerId(url)}`) === "true";
};

const markAsDownloaded = (url: string) => {
  localStorage.setItem(`tiktok-sticker-downloaded-${getStickerId(url)}`, "true");
};

const deduplicateStickerUrls = (urls: string[]): string[] => {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const url of urls) {
    const id = getStickerId(url);
    if (!seen.has(id)) {
      seen.add(id);
      unique.push(url);
    }
  }
  return unique;
};

let executeChatScan: () => Promise<void> = async () => {};

interface CustomConfirmResult {
  action: 'zip' | 'seq';
  urls: string[];
}

// Función para mostrar un diálogo modal personalizado con vista previa amplia en PC
// Helper para registrar animaciones de Bottom Sheet
const ensureModalAnimationsStyle = () => {
  if (typeof document === 'undefined') return;
  if (!document.getElementById("tt-modal-animations-style")) {
    const animStyle = document.createElement("style");
    animStyle.id = "tt-modal-animations-style";
    animStyle.textContent = `
      @keyframes ttSlideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
    `;
    document.head.appendChild(animStyle);
  }
};

// Bottom Sheet minimalista idéntico al menú nativo de TikTok para seleccionar el tipo de descarga
const showMobileDownloadOptionsBottomSheet = (
  selectedCount: number,
  onSelect: (action: 'seq' | 'zip') => void
) => {
  ensureModalAnimationsStyle();

  const overlay = document.createElement("div");
  overlay.id = "tt-download-options-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  overlay.style.zIndex = "10000000";
  overlay.style.display = "flex";
  overlay.style.alignItems = "flex-end";
  overlay.style.justifyContent = "center";
  overlay.style.padding = "0";
  overlay.style.boxSizing = "border-box";

  const sheet = document.createElement("div");
  sheet.style.position = "relative";
  sheet.style.backgroundColor = "#1a1a1a";
  sheet.style.borderRadius = "16px 16px 0 0";
  sheet.style.padding = "12px 16px 20px 16px";
  sheet.style.width = "100%";
  sheet.style.maxWidth = "100%";
  sheet.style.boxSizing = "border-box";
  sheet.style.color = "white";
  sheet.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  sheet.style.animation = "ttSlideUp 0.24s cubic-bezier(0.16, 1, 0.3, 1)";
  sheet.style.boxShadow = "0 -4px 30px rgba(0, 0, 0, 0.8)";

  // Barra de arrastre superior
  const handle = document.createElement("div");
  handle.style.width = "36px";
  handle.style.height = "4px";
  handle.style.borderRadius = "2px";
  handle.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
  handle.style.margin = "0 auto 16px auto";
  sheet.appendChild(handle);

  // Contenedor agrupado de opciones estilo tarjeta nativa de TikTok
  const group = document.createElement("div");
  group.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
  group.style.borderRadius = "14px";
  group.style.overflow = "hidden";
  group.style.marginBottom = "10px";

  const createTikTokRow = (
    iconSvg: string,
    label: string,
    hasDivider: boolean,
    onClick: () => void
  ) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.padding = "15px 18px";
    row.style.cursor = "pointer";
    row.style.userSelect = "none";
    row.style.transition = "background-color 0.15s";
    if (hasDivider) {
      row.style.borderBottom = "1px solid rgba(255, 255, 255, 0.06)";
    }

    const iconEl = document.createElement("div");
    iconEl.style.display = "flex";
    iconEl.style.alignItems = "center";
    iconEl.style.justifyContent = "center";
    iconEl.style.marginRight = "14px";
    iconEl.style.color = "#ffffff";
    iconEl.style.flexShrink = "0";
    iconEl.innerHTML = iconSvg;
    row.appendChild(iconEl);

    const labelEl = document.createElement("div");
    labelEl.innerText = label;
    labelEl.style.fontSize = "15px";
    labelEl.style.fontWeight = "500";
    labelEl.style.color = "#ffffff";
    row.appendChild(labelEl);

    row.addEventListener("touchstart", () => {
      row.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    }, { passive: true });
    row.addEventListener("touchend", () => {
      row.style.backgroundColor = "transparent";
    }, { passive: true });

    row.onclick = () => {
      overlay.remove();
      onClick();
    };

    return row;
  };

  // Ícono de archivo ZIP (paquete minimalista con trazo fino como TikTok)
  const svgZip = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V8"></path><path d="M1 3h22v5H1z"></path><path d="M10 12h4"></path></svg>`;

  // Ícono de Descarga individual (flecha minimalista estilo guardar de TikTok)
  const svgDownload = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;

  const rowZip = createTikTokRow(svgZip, t("downloadZipOption"), true, () => onSelect('zip'));
  const rowSeq = createTikTokRow(svgDownload, t("downloadSeqOption"), false, () => onSelect('seq'));

  group.appendChild(rowZip);
  group.appendChild(rowSeq);
  sheet.appendChild(group);

  // Botón Cancelar separado estilo tarjeta TikTok
  const btnCancel = document.createElement("button");
  btnCancel.innerText = t("cancel");
  btnCancel.style.width = "100%";
  btnCancel.style.padding = "14px";
  btnCancel.style.borderRadius = "14px";
  btnCancel.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
  btnCancel.style.color = "#ffffff";
  btnCancel.style.border = "none";
  btnCancel.style.fontSize = "15px";
  btnCancel.style.fontWeight = "600";
  btnCancel.style.cursor = "pointer";
  btnCancel.style.transition = "background-color 0.15s";
  btnCancel.onclick = () => overlay.remove();

  sheet.appendChild(btnCancel);

  overlay.onclick = (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  };

  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
};

// Diálogo / Bottom Sheet de confirmación si el usuario intenta cambiar de chat o salir durante un escaneo
const showCancelScanConfirmationDialog = (
  onConfirmCancel: () => void,
  onContinue: () => void
) => {
  ensureModalAnimationsStyle();

  if (document.getElementById('tt-cancel-scan-dialog')) return;

  const isMobile = isMobileDevice();
  const overlay = document.createElement("div");
  overlay.id = "tt-cancel-scan-dialog";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  overlay.style.zIndex = "100000005";
  overlay.style.display = "flex";
  overlay.style.alignItems = isMobile ? "flex-end" : "center";
  overlay.style.justifyContent = "center";
  overlay.style.padding = isMobile ? "0" : "20px";
  overlay.style.boxSizing = "border-box";
  overlay.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  const card = document.createElement("div");
  card.style.position = "relative";
  card.style.backgroundColor = "#1a1a1a";
  card.style.borderRadius = isMobile ? "16px 16px 0 0" : "16px";
  card.style.padding = isMobile ? "12px 16px 20px 16px" : "24px 22px 20px 22px";
  card.style.width = isMobile ? "100%" : "380px";
  card.style.maxWidth = isMobile ? "100%" : "380px";
  card.style.boxSizing = "border-box";
  card.style.color = "white";
  card.style.textAlign = "center";
  card.style.boxShadow = isMobile ? "0 -4px 30px rgba(0, 0, 0, 0.8)" : "0 10px 40px rgba(0, 0, 0, 0.8)";
  
  if (isMobile) {
    card.style.animation = "ttSlideUp 0.24s cubic-bezier(0.16, 1, 0.3, 1)";
    const dragHandle = document.createElement("div");
    dragHandle.style.width = "36px";
    dragHandle.style.height = "4px";
    dragHandle.style.borderRadius = "2px";
    dragHandle.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
    dragHandle.style.margin = "0 auto 16px auto";
    card.appendChild(dragHandle);
  }

  // Ícono de alerta estilo TikTok
  const icon = document.createElement("div");
  icon.style.margin = "0 auto 14px auto";
  icon.style.display = "flex";
  icon.style.alignItems = "center";
  icon.style.justifyContent = "center";
  icon.style.width = "48px";
  icon.style.height = "48px";
  icon.style.borderRadius = "50%";
  icon.style.backgroundColor = "rgba(254, 0, 79, 0.12)";
  icon.style.color = "#FE004F";
  icon.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  card.appendChild(icon);

  // Título
  const title = document.createElement("h3");
  title.innerText = t("cancelScanTitle");
  title.style.margin = "0 0 8px 0";
  title.style.fontSize = "17px";
  title.style.fontWeight = "700";
  title.style.color = "#ffffff";
  card.appendChild(title);

  // Subtítulo explicativo
  const subtitle = document.createElement("p");
  subtitle.innerText = t("cancelScanSubtitle");
  subtitle.style.margin = "0 0 20px 0";
  subtitle.style.fontSize = "14px";
  subtitle.style.lineHeight = "1.45";
  subtitle.style.color = "rgba(255, 255, 255, 0.7)";
  card.appendChild(subtitle);

  // Botón 1: Cancelar escaneo (Rojo neon TikTok / Acción destructiva)
  const btnCancelScan = document.createElement("button");
  btnCancelScan.innerText = t("cancelScanConfirm");
  btnCancelScan.style.width = "100%";
  btnCancelScan.style.padding = "13px";
  btnCancelScan.style.borderRadius = "12px";
  btnCancelScan.style.backgroundColor = "rgba(254, 0, 79, 0.15)";
  btnCancelScan.style.border = "1px solid rgba(254, 0, 79, 0.35)";
  btnCancelScan.style.color = "#ff4d6d";
  btnCancelScan.style.fontWeight = "600";
  btnCancelScan.style.fontSize = "15px";
  btnCancelScan.style.cursor = "pointer";
  btnCancelScan.style.marginBottom = "10px";
  btnCancelScan.style.transition = "background-color 0.15s, transform 0.1s";
  btnCancelScan.onclick = () => {
    overlay.remove();
    onConfirmCancel();
  };
  card.appendChild(btnCancelScan);

  // Botón 2: Continuar escaneando (Mantener escaneo)
  const btnContinue = document.createElement("button");
  btnContinue.innerText = t("continueScanning");
  btnContinue.style.width = "100%";
  btnContinue.style.padding = "13px";
  btnContinue.style.borderRadius = "12px";
  btnContinue.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
  btnContinue.style.border = "none";
  btnContinue.style.color = "#ffffff";
  btnContinue.style.fontWeight = "600";
  btnContinue.style.fontSize = "15px";
  btnContinue.style.cursor = "pointer";
  btnContinue.style.transition = "background-color 0.15s, transform 0.1s";
  btnContinue.onclick = () => {
    overlay.remove();
    onContinue();
  };
  card.appendChild(btnContinue);

  overlay.appendChild(card);
  document.body.appendChild(overlay);
};

const showCustomConfirm = async (rawNewStickers: string[], rawOldStickers: string[], convId?: string): Promise<CustomConfirmResult | null> => {
  const newStickers = deduplicateStickerUrls(rawNewStickers);
  const oldStickers = deduplicateStickerUrls(rawOldStickers);

  return new Promise((resolve) => {
    const isMobile = isMobileDevice();
    const scaleFactor = Math.max(1, window.innerWidth / window.screen.width);
    const s = (px: number) => isMobile ? (px * scaleFactor) + "px" : px + "px";

    const overlay = document.createElement("div");
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        resolve(null);
      }
    };
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
    overlay.style.zIndex = "999999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    const modal = document.createElement("div");
    modal.style.position = "relative";
    modal.style.backgroundColor = "#252525";
    modal.style.borderRadius = isMobile ? s(16) : "16px";
    modal.style.padding = isMobile ? s(20) : "24px 28px";
    modal.style.width = isMobile ? "92%" : "820px";
    modal.style.maxWidth = isMobile ? s(460) : "920px";
    modal.style.maxHeight = isMobile ? "85vh" : "82vh";
    modal.style.display = "flex";
    modal.style.flexDirection = "column";
    modal.style.boxShadow = `0 ${s(10)} ${s(40)} rgba(0,0,0,0.6)`;
    modal.style.color = "white";
    modal.style.fontFamily = "sans-serif";

    // Botón X grande y visible para cerrar
    const btnX = document.createElement("button");
    btnX.title = t("close");
    btnX.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`;
    btnX.style.position = "absolute";
    btnX.style.top = isMobile ? s(12) : "16px";
    btnX.style.right = isMobile ? s(12) : "16px";
    btnX.style.width = isMobile ? s(36) : "36px";
    btnX.style.height = isMobile ? s(36) : "36px";
    btnX.style.display = "flex";
    btnX.style.alignItems = "center";
    btnX.style.justifyContent = "center";
    btnX.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
    btnX.style.borderRadius = "50%";
    btnX.style.border = "none";
    btnX.style.color = "#ffffff";
    btnX.style.cursor = "pointer";
    btnX.style.zIndex = "1000";
    btnX.style.transition = "background-color 0.2s, transform 0.2s";

    btnX.addEventListener("mouseenter", () => {
      btnX.style.backgroundColor = "rgba(254, 44, 85, 0.9)";
      btnX.style.transform = "scale(1.1)";
    });
    btnX.addEventListener("mouseleave", () => {
      btnX.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
      btnX.style.transform = "scale(1)";
    });
    btnX.onclick = () => {
      document.body.removeChild(overlay);
      resolve(null);
    };
    modal.appendChild(btnX);
    
    const header = document.createElement("h2");
    header.innerText = t("viewStickersTitle");
    header.style.marginTop = "0";
    header.style.textAlign = "center";
    header.style.fontSize = isMobile ? s(18) : "20px";
    header.style.marginBottom = isMobile ? s(15) : "18px";
    modal.appendChild(header);

    const tabsContainer = document.createElement("div");
    tabsContainer.style.display = "flex";
    tabsContainer.style.borderBottom = "1px solid #444";
    tabsContainer.style.marginBottom = isMobile ? s(15) : "16px";

    const tabNew = document.createElement("div");
    tabNew.innerText = t("newStickers", { count: newStickers.length });
    tabNew.style.flex = "1";
    tabNew.style.textAlign = "center";
    tabNew.style.padding = isMobile ? s(10) : "10px";
    tabNew.style.cursor = "pointer";
    tabNew.style.fontWeight = "bold";
    tabNew.style.fontSize = isMobile ? s(14) : "15px";
    tabNew.style.transition = "color 0.2s, border-bottom 0.2s";

    const tabOld = document.createElement("div");
    tabOld.innerText = t("oldStickers", { count: oldStickers.length });
    tabOld.style.flex = "1";
    tabOld.style.textAlign = "center";
    tabOld.style.padding = isMobile ? s(10) : "10px";
    tabOld.style.cursor = "pointer";
    tabOld.style.fontWeight = "bold";
    tabOld.style.fontSize = isMobile ? s(14) : "15px";
    tabOld.style.transition = "color 0.2s, border-bottom 0.2s";

    tabsContainer.appendChild(tabNew);
    tabsContainer.appendChild(tabOld);
    modal.appendChild(tabsContainer);

    const scrollContainer = document.createElement("div");
    scrollContainer.style.overflowY = "auto";
    scrollContainer.style.flexGrow = "1";
    scrollContainer.style.marginBottom = isMobile ? s(15) : "16px";
    scrollContainer.style.scrollbarWidth = "thin";
    scrollContainer.style.scrollbarColor = "#fe2c55 #252525";
    scrollContainer.style.display = "flex";
    scrollContainer.style.flexDirection = "column";
    
    const selectedUrls = new Set<string>([...newStickers]);
    const imageElements = new Map<string, HTMLImageElement[]>();

    const setUrlVisualState = (url: string, isSelected: boolean) => {
      const imgs = imageElements.get(url) || [];
      imgs.forEach(img => {
        img.style.opacity = isSelected ? "1" : "0.3";
        img.style.transform = isSelected ? "scale(1)" : "scale(0.9)";
        img.style.filter = isSelected ? "none" : "grayscale(100%)";
      });
    };
    
    const svgDownload = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 6px; display: inline-block;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;
    const svgZip = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 6px; display: inline-block;"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>`;

    const btnSeq = document.createElement("button");
    const btnZip = document.createElement("button");
    btnSeq.style.display = "inline-flex";
    btnSeq.style.alignItems = "center";
    btnSeq.style.justifyContent = "center";
    btnZip.style.display = "inline-flex";
    btnZip.style.alignItems = "center";
    btnZip.style.justifyContent = "center";

    let updateActionButtons = () => {
      const count = selectedUrls.size;
      btnSeq.innerHTML = `${svgDownload}<span>${t("downloadSeqBtn", { count })}</span>`;
      btnZip.innerHTML = `${svgZip}<span>${t("downloadZipBtn", { count })}</span>`;
      const isDisabled = count === 0;
      btnSeq.disabled = isDisabled;
      btnZip.disabled = isDisabled;
      btnSeq.style.opacity = isDisabled ? "0.4" : "1";
      btnZip.style.opacity = isDisabled ? "0.4" : "1";
      btnSeq.style.cursor = isDisabled ? "not-allowed" : "pointer";
      btnZip.style.cursor = isDisabled ? "not-allowed" : "pointer";
    };
    
    const createSectionWithGrid = (urls: string[], initiallySelected: boolean, emptyText: string) => {
      const section = document.createElement("div");
      section.style.display = "flex";
      section.style.flexDirection = "column";

      if (urls.length === 0) {
        const emptyEl = document.createElement("div");
        emptyEl.innerText = emptyText;
        emptyEl.style.textAlign = "center";
        emptyEl.style.color = "#888";
        emptyEl.style.fontSize = isMobile ? s(14) : "14px";
        emptyEl.style.marginTop = isMobile ? s(20) : "24px";
        section.appendChild(emptyEl);
        return section;
      }

      const sectionHeader = document.createElement("div");
      sectionHeader.style.display = "flex";
      sectionHeader.style.justifyContent = "space-between";
      sectionHeader.style.alignItems = "center";
      sectionHeader.style.marginBottom = isMobile ? s(10) : "12px";

      const btnToggle = document.createElement("button");
      btnToggle.style.padding = isMobile ? `${s(5)} ${s(10)}` : "6px 14px";
      btnToggle.style.borderRadius = isMobile ? s(6) : "6px";
      btnToggle.style.cursor = "pointer";
      btnToggle.style.fontSize = isMobile ? s(12) : "13px";
      btnToggle.style.fontWeight = "bold";
      btnToggle.style.transition = "all 0.2s";

      const isAllSelected = () => urls.every(u => selectedUrls.has(u));

      const updateToggleBtn = () => {
        const allSel = isAllSelected();
        btnToggle.innerText = allSel ? t("cancelSelection") : t("selectAll");
        btnToggle.style.border = allSel ? "1px solid #fe2c55" : "1px solid #888";
        btnToggle.style.color = allSel ? "#fe2c55" : "#ccc";
        btnToggle.style.backgroundColor = allSel ? "rgba(254, 44, 85, 0.1)" : "transparent";
      };

      updateToggleBtn();

      btnToggle.onclick = () => {
        const shouldSelectAll = !isAllSelected();
        urls.forEach(url => {
          if (shouldSelectAll) {
            selectedUrls.add(url);
          } else {
            selectedUrls.delete(url);
          }
          setUrlVisualState(url, shouldSelectAll);
        });
        updateToggleBtn();
        updateActionButtons();
      };

      sectionHeader.appendChild(btnToggle);
      section.appendChild(sectionHeader);

      const grid = document.createElement("div");
      grid.style.display = "grid";
      // En PC mostrar cuadrícula espaciosa y grande (min 88px), en móvil compacta
      grid.style.gridTemplateColumns = isMobile 
        ? `repeat(auto-fill, minmax(${s(70)}, 1fr))` 
        : "repeat(auto-fill, minmax(88px, 1fr))";
      grid.style.gap = isMobile ? s(8) : "12px";

      urls.forEach(url => {
        const container = document.createElement("div");
        container.style.position = "relative";
        container.style.cursor = "pointer";

        const img = document.createElement("img");
        img.src = url;
        img.style.width = "100%";
        img.style.aspectRatio = "1/1";
        img.style.objectFit = "cover";
        img.style.borderRadius = isMobile ? s(8) : "8px";
        img.style.backgroundColor = "#181818";
        img.style.transition = "all 0.2s";

        if (!initiallySelected) {
          img.style.opacity = "0.3";
          img.style.transform = "scale(0.9)";
          img.style.filter = "grayscale(100%)";
        }

        container.appendChild(img);
        grid.appendChild(container);
        const existing = imageElements.get(url) || [];
        existing.push(img);
        imageElements.set(url, existing);

        container.onclick = () => {
          const nextSelected = !selectedUrls.has(url);
          if (nextSelected) {
            selectedUrls.add(url);
          } else {
            selectedUrls.delete(url);
          }
          setUrlVisualState(url, nextSelected);
          updateToggleBtn();
          updateActionButtons();
        };
      });

      section.appendChild(grid);
      return section;
    };

    const contentNew = createSectionWithGrid(newStickers, true, t("noNewStickers"));
    const contentOld = createSectionWithGrid(oldStickers, false, t("noOldStickers"));
    contentOld.style.display = "none";
    
    const setActiveTab = (isNew: boolean) => {
      tabNew.style.color = isNew ? "#fe2c55" : "#888";
      tabNew.style.borderBottom = isNew ? `2px solid #fe2c55` : `2px solid transparent`;
      
      tabOld.style.color = !isNew ? "#fe2c55" : "#888";
      tabOld.style.borderBottom = !isNew ? `2px solid #fe2c55` : `2px solid transparent`;
      
      contentNew.style.display = isNew ? "flex" : "none";
      contentOld.style.display = !isNew ? "flex" : "none";
    };
    
    tabNew.onclick = () => setActiveTab(true);
    tabOld.onclick = () => setActiveTab(false);
    
    setActiveTab(true);

    scrollContainer.appendChild(contentNew);
    scrollContainer.appendChild(contentOld);
    modal.appendChild(scrollContainer);

    // Fila con botones de descarga: 1 botón con Bottom Sheet en móvil, 2 botones lado a lado en PC
    const downloadBtnsRow = document.createElement("div");
    downloadBtnsRow.style.display = "flex";
    downloadBtnsRow.style.flexDirection = "row";
    downloadBtnsRow.style.alignItems = "center";
    downloadBtnsRow.style.gap = isMobile ? s(10) : "12px";
    downloadBtnsRow.style.marginTop = isMobile ? s(12) : "14px";
    downloadBtnsRow.style.width = "100%";

    // Botón Escanear chat (botón gris elegante de ancho completo con misma altura)
    const currentConvId = convId || getActiveConversationId();
    const scanStateInModal = loadConversationScanState(currentConvId);
    const isAlreadyAtBeginning = scanStateInModal.hasReachedBeginning;

    const btnScanInModal = document.createElement("button");
    btnScanInModal.style.width = "100%";
    btnScanInModal.style.marginTop = isMobile ? s(10) : "12px";
    btnScanInModal.style.padding = isMobile ? s(12) : "12px 18px";
    btnScanInModal.style.borderRadius = isMobile ? s(10) : "10px";
    btnScanInModal.style.border = "none";
    btnScanInModal.style.outline = "none";
    btnScanInModal.style.fontWeight = "600";
    btnScanInModal.style.fontSize = isMobile ? s(14) : "14px";
    btnScanInModal.style.textAlign = "center";
    btnScanInModal.style.display = "flex";
    btnScanInModal.style.alignItems = "center";
    btnScanInModal.style.justifyContent = "center";
    btnScanInModal.style.gap = "8px";
    btnScanInModal.style.boxSizing = "border-box";
    btnScanInModal.style.transition = "background-color 0.2s, transform 0.15s, opacity 0.2s";

    const svgSearchModal = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; display: inline-block;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
    const svgCheckModal = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2ed573" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; display: inline-block;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

    if (isAlreadyAtBeginning) {
      btnScanInModal.disabled = false;
      btnScanInModal.innerHTML = `${svgCheckModal}<span>${t("chatFullyScanned")}</span>`;
      btnScanInModal.title = t("chatFullyScannedTooltip");
      btnScanInModal.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
      btnScanInModal.style.color = "rgba(255, 255, 255, 0.75)";
      btnScanInModal.style.cursor = "pointer";
      btnScanInModal.addEventListener("mouseenter", () => {
        btnScanInModal.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
      });
      btnScanInModal.addEventListener("mouseleave", () => {
        btnScanInModal.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
      });
      btnScanInModal.onclick = () => {
        document.body.removeChild(overlay);
        resolve(null);
        executeChatScan();
      };
    } else {
      btnScanInModal.disabled = false;
      btnScanInModal.innerHTML = `${svgSearchModal}<span>${t("scanChat")}</span>`;
      btnScanInModal.title = t("scanChat");
      btnScanInModal.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
      btnScanInModal.style.color = "#ffffff";
      btnScanInModal.style.cursor = "pointer";

      btnScanInModal.addEventListener("mouseenter", () => {
        btnScanInModal.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      });
      btnScanInModal.addEventListener("mouseleave", () => {
        btnScanInModal.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
      });

      btnScanInModal.onclick = () => {
        document.body.removeChild(overlay);
        resolve(null);
        executeChatScan();
      };
    }

    if (isMobile) {
      // Un solo botón de Descarga en Móvil -> Abre Bottom Sheet con opciones (ZIP o individual)
      const btnDownloadMobile = document.createElement("button");
      btnDownloadMobile.style.width = "100%";
      btnDownloadMobile.style.padding = s(12);
      btnDownloadMobile.style.borderRadius = s(10);
      btnDownloadMobile.style.setProperty('background-color', '#FE004F', 'important');
      btnDownloadMobile.style.setProperty('background', '#FE004F', 'important');
      btnDownloadMobile.style.setProperty('color', '#ffffff', 'important');
      btnDownloadMobile.style.border = "none";
      btnDownloadMobile.style.fontWeight = "bold";
      btnDownloadMobile.style.fontSize = s(15);
      btnDownloadMobile.style.cursor = "pointer";
      btnDownloadMobile.style.display = "flex";
      btnDownloadMobile.style.alignItems = "center";
      btnDownloadMobile.style.justifyContent = "center";
      btnDownloadMobile.style.gap = "8px";
      btnDownloadMobile.style.boxShadow = "0 4px 18px rgba(254, 0, 79, 0.45)";
      btnDownloadMobile.style.transition = "background-color 0.2s, transform 0.15s";

      const updateMobileDownloadBtn = () => {
        const count = selectedUrls.size;
        btnDownloadMobile.innerHTML = `${svgDownload}<span>${t("downloadSelectedBtn", { count })}</span>`;
        const isDisabled = count === 0;
        btnDownloadMobile.disabled = isDisabled;
        btnDownloadMobile.style.opacity = isDisabled ? "0.4" : "1";
        btnDownloadMobile.style.cursor = isDisabled ? "not-allowed" : "pointer";
      };

      updateMobileDownloadBtn();

      btnDownloadMobile.onclick = () => {
        if (selectedUrls.size === 0) return;
        showMobileDownloadOptionsBottomSheet(selectedUrls.size, (action) => {
          document.body.removeChild(overlay);
          resolve({ action, urls: Array.from(selectedUrls) });
        });
      };

      const origUpdateActionButtons = updateActionButtons;
      updateActionButtons = () => {
        origUpdateActionButtons();
        updateMobileDownloadBtn();
      };

      downloadBtnsRow.appendChild(btnDownloadMobile);
    } else {
      // En PC: Botón Descarga Secuencial y Botón ZIP lado a lado
      btnSeq.style.padding = "11px 18px";
      btnSeq.style.borderRadius = "8px";
      btnSeq.style.border = "1.5px solid #fe2c55";
      btnSeq.style.backgroundColor = "transparent";
      btnSeq.style.color = "#fe2c55";
      btnSeq.style.cursor = "pointer";
      btnSeq.style.fontWeight = "bold";
      btnSeq.style.fontSize = "14px";
      btnSeq.style.flex = "1";
      btnSeq.style.transition = "background-color 0.2s, transform 0.2s";
      btnSeq.title = t("downloadSeqTooltip");

      btnSeq.addEventListener("mouseenter", () => {
        if (!btnSeq.disabled) {
          btnSeq.style.backgroundColor = "rgba(254, 44, 85, 0.12)";
          btnSeq.style.transform = "scale(1.02)";
        }
      });
      btnSeq.addEventListener("mouseleave", () => {
        btnSeq.style.backgroundColor = "transparent";
        btnSeq.style.transform = "scale(1)";
      });

      btnZip.style.padding = "11px 18px";
      btnZip.style.borderRadius = "8px";
      btnZip.style.border = "1.5px solid #fe2c55";
      btnZip.style.backgroundColor = "#fe2c55";
      btnZip.style.color = "#ffffff";
      btnZip.style.cursor = "pointer";
      btnZip.style.fontWeight = "bold";
      btnZip.style.fontSize = "14px";
      btnZip.style.flex = "1";
      btnZip.style.transition = "filter 0.2s, transform 0.2s";
      btnZip.title = t("downloadZipTooltip");

      btnZip.addEventListener("mouseenter", () => {
        if (!btnZip.disabled) {
          btnZip.style.filter = "brightness(1.1)";
          btnZip.style.transform = "scale(1.02)";
        }
      });
      btnZip.addEventListener("mouseleave", () => {
        btnZip.style.filter = "none";
        btnZip.style.transform = "scale(1)";
      });

      updateActionButtons();

      btnSeq.onclick = () => {
        if (selectedUrls.size === 0) return;
        document.body.removeChild(overlay);
        resolve({ action: 'seq', urls: Array.from(selectedUrls) });
      };

      btnZip.onclick = () => {
        if (selectedUrls.size === 0) return;
        document.body.removeChild(overlay);
        resolve({ action: 'zip', urls: Array.from(selectedUrls) });
      };

      downloadBtnsRow.appendChild(btnSeq);
      downloadBtnsRow.appendChild(btnZip);
    }

    modal.appendChild(downloadBtnsRow);
    modal.appendChild(btnScanInModal);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  });
};

const getDelay = () => {
  const stored = localStorage.getItem("tiktok-stickers-exporter-delay");
  return stored ? parseFloat(stored) : 1.5;
};

const showSettingsModal = () => {
  const isMobile = isMobileDevice();
  ensureModalAnimationsStyle();
  const scaleFactor = Math.max(1, window.innerWidth / window.screen.width);
  const s = (px: number) => isMobile ? (px * scaleFactor) + "px" : px + "px";

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
  overlay.style.zIndex = "999999";
  overlay.style.display = "flex";
  overlay.style.alignItems = isMobile ? "flex-end" : "center";
  overlay.style.justifyContent = "center";
  overlay.style.padding = isMobile ? "0" : "20px";
  overlay.style.boxSizing = "border-box";

  overlay.onclick = (e) => {
    if (e.target === overlay) close();
  };

  const modal = document.createElement("div");
  modal.style.position = "relative";
  modal.style.backgroundColor = "#252525";
  modal.style.borderRadius = isMobile ? "20px 20px 0 0" : "16px";
  modal.style.padding = isMobile ? `${s(16)} ${s(20)} ${s(24)} ${s(20)}` : "24px 28px";
  modal.style.width = isMobile ? "100%" : "85%";
  modal.style.maxWidth = isMobile ? "100%" : "400px";
  modal.style.maxHeight = isMobile ? "85vh" : "80vh";
  modal.style.overflowY = "auto";
  modal.style.boxSizing = "border-box";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.boxShadow = isMobile ? "0 -4px 30px rgba(0,0,0,0.8)" : "0 10px 40px rgba(0,0,0,0.6)";
  modal.style.color = "white";
  modal.style.fontFamily = "sans-serif";
  modal.style.gap = isMobile ? s(14) : "16px";
  if (isMobile) {
    modal.style.animation = "ttSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)";
    const dragHandle = document.createElement("div");
    dragHandle.style.width = "40px";
    dragHandle.style.height = "4px";
    dragHandle.style.borderRadius = "2px";
    dragHandle.style.backgroundColor = "rgba(255, 255, 255, 0.28)";
    dragHandle.style.margin = "0 auto 10px auto";
    modal.appendChild(dragHandle);
  }

  const close = () => {
    if (overlay.parentElement) overlay.parentElement.removeChild(overlay);
  };

  const btnX = document.createElement("button");
  btnX.title = t("close");
  btnX.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>`;
  btnX.style.position = "absolute";
  btnX.style.top = s(12);
  btnX.style.right = s(12);
  btnX.style.width = s(36);
  btnX.style.height = s(36);
  btnX.style.display = "flex";
  btnX.style.alignItems = "center";
  btnX.style.justifyContent = "center";
  btnX.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
  btnX.style.borderRadius = "50%";
  btnX.style.border = "none";
  btnX.style.color = "#ffffff";
  btnX.style.cursor = "pointer";
  btnX.style.zIndex = "1000";
  btnX.style.transition = "background-color 0.2s, transform 0.2s";

  btnX.addEventListener("mouseenter", () => {
    btnX.style.backgroundColor = "rgba(254, 44, 85, 0.9)";
    btnX.style.transform = "scale(1.1)";
  });
  btnX.addEventListener("mouseleave", () => {
    btnX.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
    btnX.style.transform = "scale(1)";
  });
  btnX.onclick = close;
  modal.appendChild(btnX);

  const header = document.createElement("h3");
  header.innerText = t("settings");
  header.style.margin = "0";
  header.style.fontSize = s(18);
  header.style.fontWeight = "bold";
  header.style.textAlign = "center";
  modal.appendChild(header);

  // Selector de idioma
  const langContainer = document.createElement("div");
  langContainer.style.display = "flex";
  langContainer.style.flexDirection = "column";
  langContainer.style.gap = s(6);

  const langLabel = document.createElement("label");
  langLabel.innerText = t("languageLabel");
  langLabel.style.fontSize = s(13);
  langLabel.style.color = "#ccc";

  const langSelect = document.createElement("select");
  langSelect.style.padding = s(8);
  langSelect.style.borderRadius = s(6);
  langSelect.style.backgroundColor = "#333";
  langSelect.style.color = "white";
  langSelect.style.border = "1px solid #555";
  langSelect.style.fontSize = s(14);
  langSelect.style.cursor = "pointer";

  const optAuto = document.createElement("option");
  optAuto.value = "auto";
  optAuto.innerText = t("langAuto");
  const optEs = document.createElement("option");
  optEs.value = "es";
  optEs.innerText = t("langEs");
  const optEn = document.createElement("option");
  optEn.value = "en";
  optEn.innerText = t("langEn");

  const currentForced = localStorage.getItem("tiktok-stickers-exporter-lang");
  if (currentForced === "es") optEs.selected = true;
  else if (currentForced === "en") optEn.selected = true;
  else optAuto.selected = true;

  langSelect.appendChild(optAuto);
  langSelect.appendChild(optEs);
  langSelect.appendChild(optEn);

  langSelect.onchange = () => {
    if (langSelect.value === "auto") {
      localStorage.removeItem("tiktok-stickers-exporter-lang");
    } else {
      localStorage.setItem("tiktok-stickers-exporter-lang", langSelect.value);
    }
    close();
    addDownloadAllButton();
  };

  langContainer.appendChild(langLabel);
  langContainer.appendChild(langSelect);
  modal.appendChild(langContainer);

  // Delay setting
  const delayContainer = document.createElement("div");
  delayContainer.style.display = "flex";
  delayContainer.style.flexDirection = "column";
  delayContainer.style.gap = s(6);

  const delayLabel = document.createElement("label");
  delayLabel.innerText = t("delayLabel");
  delayLabel.style.fontSize = s(13);
  delayLabel.style.color = "#ccc";

  const delayInput = document.createElement("input");
  delayInput.type = "number";
  delayInput.min = "0.5";
  delayInput.max = "10";
  delayInput.step = "0.5";
  delayInput.value = String(getDelay());
  delayInput.style.padding = s(8);
  delayInput.style.borderRadius = s(6);
  delayInput.style.border = "1px solid #555";
  delayInput.style.backgroundColor = "#333";
  delayInput.style.color = "white";
  delayInput.style.fontSize = s(14);

  delayInput.onchange = () => {
    localStorage.setItem("tiktok-stickers-exporter-delay", delayInput.value);
  };

  delayContainer.appendChild(delayLabel);
  delayContainer.appendChild(delayInput);
  modal.appendChild(delayContainer);

  // Clear history button
  const btnClear = document.createElement("button");
  btnClear.innerText = t("clearHistory");
  btnClear.style.padding = s(12);
  btnClear.style.borderRadius = s(8);
  btnClear.style.border = "1px solid #fe2c55";
  btnClear.style.backgroundColor = "transparent";
  btnClear.style.color = "#fe2c55";
  btnClear.style.cursor = "pointer";
  btnClear.style.fontWeight = "bold";
  btnClear.style.fontSize = s(14);
  
  btnClear.onclick = () => {
    if (confirm(t("confirmClear"))) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("tiktok-sticker-downloaded-") || key.startsWith("tiktok-chat-scan-")) {
          localStorage.removeItem(key);
        }
      });
      alert(t("historyCleared"));
      addDownloadAllButton();
      addIndividualDownloadButtons();
    }
  };
  modal.appendChild(btnClear);

  const btnClose = document.createElement("button");
  btnClose.innerText = t("close");
  btnClose.style.padding = s(12);
  btnClose.style.borderRadius = s(8);
  btnClose.style.border = "none";
  btnClose.style.backgroundColor = "#444";
  btnClose.style.color = "white";
  btnClose.style.cursor = "pointer";
  btnClose.style.fontWeight = "bold";
  btnClose.style.fontSize = s(14);
  btnClose.onclick = close;
  modal.appendChild(btnClose);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
};

// Helper para obtener un identificador único de la conversación activa
function getActiveConversationId(): string {
  const headerContainer = document.querySelector('div[class*="--DivChatHeader"]') as HTMLElement;
  if (headerContainer) {
    const profileLink = headerContainer.querySelector('a[href*="/@"]') as HTMLAnchorElement;
    if (profileLink && profileLink.getAttribute('href')) {
      const match = profileLink.getAttribute('href')!.match(/@([^/?#]+)/);
      if (match && match[1]) return match[1];
    }
    const anyLink = headerContainer.querySelector('a') as HTMLAnchorElement;
    if (anyLink && anyLink.getAttribute('href')) {
      const href = anyLink.getAttribute('href')!;
      if (href.includes('@')) {
        const match = href.match(/@([^/?#]+)/);
        if (match && match[1]) return match[1];
      }
    }
    const titleEl = headerContainer.querySelector('h1, h2, h3, h4, span[class*="Title"], span[class*="Name"], p[class*="Name"]');
    if (titleEl && titleEl.textContent && titleEl.textContent.trim()) {
      return titleEl.textContent.trim().replace(/\s+/g, '_');
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const cid = urlParams.get('conversation_id') || urlParams.get('cid');
  if (cid) return cid;

  const activeItem = document.querySelector('[class*="ConversationItem"][class*="active"], [class*="ChatRoomItem"][class*="active"], [aria-selected="true"]');
  if (activeItem) {
    const link = activeItem.querySelector('a[href*="/@"]') as HTMLAnchorElement;
    if (link && link.getAttribute('href')) {
      const m = link.getAttribute('href')!.match(/@([^/?#]+)/);
      if (m && m[1]) return m[1];
    }
    if (activeItem.textContent && activeItem.textContent.trim()) {
      return activeItem.textContent.trim().slice(0, 30).replace(/\s+/g, '_');
    }
  }

  return 'current_chat';
};

interface ScannedStickerRecord {
  id: string;          // getStickerId(url)
  url: string;         // URL completa del sticker (con token firmado más reciente)
  text?: string;       // Texto o comentario que acompaña al sticker si existe
  time?: string;       // Hora o fecha del mensaje si se muestra en el DOM
  discoveredAt: number;// Timestamp de cuándo se descubrió
}

interface ConversationScanState {
  conversationId: string;
  hasReachedBeginning: boolean; // ¿Se llegó alguna vez al mensaje #1 de la historia del chat?
  lastScanTimestamp: number;
  newestKnownStickerId: string | null;
  stickers: ScannedStickerRecord[];
}

const getChatScanStorageKey = (convId: string) => `tiktok-chat-scan-${convId}`;

function loadConversationScanState(convId: string): ConversationScanState {
  try {
    const raw = localStorage.getItem(getChatScanStorageKey(convId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.stickers)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error al cargar estado del escaneo del chat:", e);
  }
  return {
    conversationId: convId,
    hasReachedBeginning: false,
    lastScanTimestamp: 0,
    newestKnownStickerId: null,
    stickers: []
  };
};

const saveConversationScanState = (state: ConversationScanState) => {
  try {
    localStorage.setItem(getChatScanStorageKey(state.conversationId), JSON.stringify(state));
  } catch (e) {
    console.error("Error al guardar estado del escaneo del chat:", e);
  }
};

const getStickerMessageContext = (img: HTMLImageElement): { text?: string; time?: string } => {
  const context: { text?: string; time?: string } = {};
  let el = img.parentElement;
  let depth = 0;
  while (el && el !== document.body && depth < 5) {
    if (!context.time) {
      const timeEl = el.querySelector('time, [class*="Time"], [class*="Date"]');
      if (timeEl && timeEl.textContent) {
        context.time = timeEl.textContent.trim();
      }
    }
    if (!context.text) {
      const textEl = el.querySelector('p, span[class*="Text"], div[class*="Text"]');
      if (textEl && textEl.textContent && textEl.textContent.trim()) {
        context.text = textEl.textContent.trim().slice(0, 100);
      }
    }
    el = el.parentElement;
    depth++;
  }
  return context;
};

// Registra todos los stickers que estén en el DOM actualmente en la base de datos de la conversación
const registerStickersFromDOM = (convId: string): ConversationScanState => {
  const state = loadConversationScanState(convId);
  const existingMap = new Map<string, ScannedStickerRecord>();
  for (const s of state.stickers) {
    existingMap.set(s.id, s);
  }

  const imgs = Array.from(document.querySelectorAll('img[alt="sticker"]')) as HTMLImageElement[];
  let changed = false;

  for (const img of imgs) {
    const id = getStickerId(img.src);
    const existing = existingMap.get(id);
    if (existing) {
      if (existing.url !== img.src) {
        existing.url = img.src;
        changed = true;
      }
    } else {
      const ctx = getStickerMessageContext(img);
      const record: ScannedStickerRecord = {
        id,
        url: img.src,
        text: ctx.text,
        time: ctx.time,
        discoveredAt: Date.now()
      };
      state.stickers.push(record);
      existingMap.set(id, record);
      changed = true;
    }
  }

  if (changed) {
    saveConversationScanState(state);
  }
  return state;
};

interface ProgressModalController {
  update: (current: number, total: number) => void;
  setStatus: (statusText: string) => void;
  complete: (message: string) => void;
  close: () => void;
}

const showProgressModal = (title: string, total: number): ProgressModalController => {
  const isMobile = isMobileDevice();
  const scaleFactor = Math.max(1, window.innerWidth / window.screen.width);
  const s = (px: number) => isMobile ? (px * scaleFactor) + "px" : px + "px";

  ensureModalAnimationsStyle();

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
  overlay.style.zIndex = "9999999";
  overlay.style.display = "flex";
  overlay.style.alignItems = isMobile ? "flex-end" : "center";
  overlay.style.justifyContent = "center";
  overlay.style.padding = isMobile ? "0" : "20px";
  overlay.style.boxSizing = "border-box";

  overlay.onclick = (e) => {
    if (e.target === overlay) close();
  };

  const modal = document.createElement("div");
  modal.style.position = "relative";
  modal.style.backgroundColor = "#252525";
  modal.style.borderRadius = isMobile ? "20px 20px 0 0" : "16px";
  modal.style.padding = isMobile ? `${s(16)} ${s(24)} ${s(28)} ${s(24)}` : "30px 26px 26px 26px";
  modal.style.width = isMobile ? "100%" : "440px";
  modal.style.maxWidth = isMobile ? "100%" : "480px";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.alignItems = "center";
  modal.style.boxShadow = isMobile ? "0 -4px 30px rgba(0,0,0,0.8)" : "0 10px 40px rgba(0,0,0,0.6)";
  modal.style.color = "white";
  modal.style.fontFamily = "sans-serif";
  modal.style.gap = isMobile ? s(14) : "16px";
  modal.style.boxSizing = "border-box";
  if (isMobile) {
    modal.style.animation = "ttSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)";
    const dragHandle = document.createElement("div");
    dragHandle.style.width = "40px";
    dragHandle.style.height = "4px";
    dragHandle.style.borderRadius = "2px";
    dragHandle.style.backgroundColor = "rgba(255, 255, 255, 0.28)";
    dragHandle.style.margin = "0 auto 12px auto";
    modal.appendChild(dragHandle);
  }

  let isClosed = false;
  let countdownTimer: any = null;

  const close = () => {
    if (isClosed) return;
    isClosed = true;
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    if (overlay.parentElement) {
      overlay.parentElement.removeChild(overlay);
    }
  };

  const btnX = document.createElement("button");
  btnX.title = t("close");
  btnX.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>`;
  btnX.style.position = "absolute";
  btnX.style.top = isMobile ? s(12) : "12px";
  btnX.style.right = isMobile ? s(12) : "12px";
  btnX.style.width = isMobile ? s(36) : "36px";
  btnX.style.height = isMobile ? s(36) : "36px";
  btnX.style.display = "flex";
  btnX.style.alignItems = "center";
  btnX.style.justifyContent = "center";
  btnX.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
  btnX.style.borderRadius = "50%";
  btnX.style.border = "none";
  btnX.style.color = "#ffffff";
  btnX.style.cursor = "pointer";
  btnX.style.zIndex = "1000";
  btnX.style.transition = "background-color 0.2s, transform 0.2s";

  btnX.addEventListener("mouseenter", () => {
    btnX.style.backgroundColor = "rgba(254, 44, 85, 0.9)";
    btnX.style.transform = "scale(1.1)";
  });
  btnX.addEventListener("mouseleave", () => {
    btnX.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
    btnX.style.transform = "scale(1)";
  });
  btnX.onclick = close;
  modal.appendChild(btnX);

  const header = document.createElement("h3");
  header.innerText = title;
  header.style.margin = "0";
  header.style.fontSize = isMobile ? s(18) : "18px";
  header.style.fontWeight = "bold";
  header.style.textAlign = "center";

  const isZipMode = title.includes("ZIP") || title.includes("omprim");
  const statusEl = document.createElement("div");
  statusEl.innerText = isZipMode
    ? t("compressingProgress", { current: 1, total })
    : t("downloadingProgress", { current: 1, total });
  statusEl.style.fontSize = isMobile ? s(14) : "14px";
  statusEl.style.color = "#ccc";
  statusEl.style.textAlign = "center";

  const barContainer = document.createElement("div");
  barContainer.style.width = "100%";
  barContainer.style.height = isMobile ? s(14) : "14px";
  barContainer.style.backgroundColor = "#444";
  barContainer.style.borderRadius = isMobile ? s(7) : "7px";
  barContainer.style.overflow = "hidden";

  const barFill = document.createElement("div");
  barFill.style.width = "0%";
  barFill.style.height = "100%";
  barFill.style.backgroundColor = "#fe2c55";
  barFill.style.borderRadius = isMobile ? s(7) : "7px";
  barFill.style.transition = "width 0.2s";
  barContainer.appendChild(barFill);

  const percentEl = document.createElement("div");
  percentEl.innerText = "0%";
  percentEl.style.fontSize = isMobile ? s(13) : "13px";
  percentEl.style.color = "#888";
  percentEl.style.fontWeight = "bold";

  const btnClose = document.createElement("button");
  btnClose.innerText = t("close");
  btnClose.style.marginTop = isMobile ? s(10) : "10px";
  btnClose.style.padding = isMobile ? `${s(10)} ${s(24)}` : "10px 24px";
  btnClose.style.borderRadius = isMobile ? s(8) : "8px";
  btnClose.style.border = "none";
  btnClose.style.backgroundColor = "#fe2c55";
  btnClose.style.color = "white";
  btnClose.style.fontWeight = "bold";
  btnClose.style.fontSize = isMobile ? s(14) : "14px";
  btnClose.style.cursor = "pointer";
  btnClose.style.display = "none";
  btnClose.style.transition = "transform 0.2s, background-color 0.2s";

  btnClose.onclick = close;

  modal.appendChild(header);
  modal.appendChild(statusEl);
  modal.appendChild(barContainer);
  modal.appendChild(percentEl);
  modal.appendChild(btnClose);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  return {
    update: (current: number, totalCount: number) => {
      if (isClosed) return;
      const pct = Math.round((current / totalCount) * 100);
      barFill.style.width = `${pct}%`;
      percentEl.innerText = `${pct}%`;
      statusEl.innerText = isZipMode
        ? t("compressingProgress", { current, total: totalCount })
        : t("downloadingProgress", { current, total: totalCount });
    },
    setStatus: (statusText: string) => {
      if (isClosed) return;
      statusEl.innerText = statusText;
    },
    complete: (message: string) => {
      if (isClosed) return;
      barFill.style.width = "100%";
      percentEl.innerText = "100%";
      header.innerText = t("completedTitle");
      statusEl.innerText = message;
      statusEl.style.color = "#2ed573";
      
      let secondsLeft = 5;
      btnClose.style.display = "block";
      btnClose.innerText = `${t("close")} (${secondsLeft}s)`;

      countdownTimer = setInterval(() => {
        secondsLeft--;
        if (secondsLeft > 0) {
          btnClose.innerText = `${t("close")} (${secondsLeft}s)`;
        } else {
          close();
        }
      }, 1000);
    },
    close
  };
};

let isProcessingBatch = false;

// Ejecuta la descarga elegida (ZIP o secuencial) para la lista de stickers seleccionados
const executeDownload = async (action: 'zip' | 'seq', selectedUrls: string[]) => {
  if (isProcessingBatch || selectedUrls.length === 0) return;
  isProcessingBatch = true;

  const isZip = action === 'zip';
  const progressModal = showProgressModal(
    isZip ? t("compressingTitle") : t("downloadingTitle"),
    selectedUrls.length
  );

  try {
    if (isZip) {
      const zip = new JSZip();
      let index = 1;
      let successCount = 0;

      for (const stickerUrl of selectedUrls) {
        try {
          progressModal.update(index, selectedUrls.length);
          const res = await fetch(stickerUrl);
          const ext = getExtension(res);
          const buffer = await res.arrayBuffer();
          const bytes = new Uint8Array(buffer);
          let binary = '';
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = window.btoa(binary);
          zip.file(`tiktok-sticker-${index}.${ext}`, base64, { base64: true });
          markAsDownloaded(stickerUrl);
          successCount++;
        } catch (err) {
          console.error(t("errorDownload"), stickerUrl);
        }
        index++;
      }

      if (successCount > 0) {
        try {
          progressModal.setStatus(t("generatingZip"));
          const content = await zip.generateAsync({ type: "arraybuffer" });
          const blob = new Blob([content], { type: "application/zip" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `tiktok-stickers-${Date.now()}.zip`;
          a.click();
          window.URL.revokeObjectURL(url);
          
          addDownloadAllButton();
          addIndividualDownloadButtons();
          progressModal.complete(t("completedZip"));
        } catch (err) {
          console.error("Error al generar el ZIP:", err);
          progressModal.close();
          alert(t("errorZip"));
        }
      } else {
        progressModal.close();
      }
    } else {
      let index = 1;
      for (const stickerUrl of selectedUrls) {
        try {
          progressModal.update(index, selectedUrls.length);
          const res = await fetch(stickerUrl);
          const ext = getExtension(res);
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `tiktok-sticker-${Date.now()}-${index}.${ext}`;
          a.click();
          window.URL.revokeObjectURL(url);
          
          markAsDownloaded(stickerUrl);
          
          const delayMs = getDelay() * 1000;
          await new Promise(r => setTimeout(r, delayMs));
        } catch (err) {
          console.error(t("errorDownload"), stickerUrl);
        }
        index++;
      }
      addDownloadAllButton();
      addIndividualDownloadButtons();
      progressModal.complete(t("completedSeq"));
    }
  } finally {
    isProcessingBatch = false;
  }
};

// Abre el modal visualizador con todos los stickers descubiertos en el chat
const openStickersModal = async () => {
  if (isProcessingBatch) return;

  const curConvId = getActiveConversationId();
  const curState = registerStickersFromDOM(curConvId);
  const currentImages = Array.from(document.querySelectorAll('img[alt="sticker"]')) as HTMLImageElement[];
  const domUrls = currentImages.map(img => img.src);
  const storedUrls = curState.stickers.map(s => s.url);
  const allUrls = deduplicateStickerUrls([...storedUrls, ...domUrls]);

  const freshNew = allUrls.filter(url => !isDownloaded(url));
  const freshOld = allUrls.filter(url => isDownloaded(url));

  if (freshNew.length === 0 && freshOld.length === 0) {
    alert(t("noStickersOnScreen"));
    return;
  }

  const result = await showCustomConfirm(freshNew, freshOld, curConvId);
  if (!result || !result.urls || result.urls.length === 0) return;

  await executeDownload(result.action, result.urls);
};

// Helper para localizar el contenedor de scroll del chat en TikTok Web
const findChatScrollable = (): HTMLElement | null => {
  const stickers = document.querySelectorAll('img[alt="sticker"]');
  for (const sticker of Array.from(stickers)) {
    let p = sticker.parentElement;
    while (p && p !== document.body) {
      const style = window.getComputedStyle(p);
      if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && p.scrollHeight > p.clientHeight) {
        return p;
      }
      p = p.parentElement;
    }
  }

  const chatElements = document.querySelectorAll('div[class*="Message"], div[class*="Chat"], div[data-e2e*="chat"]');
  for (const el of Array.from(chatElements)) {
    let p: HTMLElement | null = el as HTMLElement;
    while (p && p !== document.body) {
      const style = window.getComputedStyle(p);
      if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && p.scrollHeight > p.clientHeight) {
        return p;
      }
      p = p.parentElement;
    }
  }

  const header = document.querySelector('div[class*="--DivChatHeader"]') as HTMLElement;
  if (header && header.parentElement) {
    const scrollables = Array.from(header.parentElement.querySelectorAll('div')).filter(el => {
      const style = window.getComputedStyle(el);
      return (style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
    });
    if (scrollables.length > 0) return scrollables[0];
  }

  return null;
};

const triggerScrollToTop = (container: HTMLElement) => {
  container.scrollTop = 0;
  try {
    container.scrollBy({ top: -1000, behavior: 'instant' });
  } catch (e) {}

  let parent = container.parentElement;
  while (parent && parent !== document.body) {
    const style = window.getComputedStyle(parent);
    if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
      parent.scrollTop = 0;
    }
    parent = parent.parentElement;
  }

  const firstChild = container.firstElementChild as HTMLElement;
  if (firstChild && typeof firstChild.scrollIntoView === 'function') {
    try {
      firstChild.scrollIntoView({ block: 'start', behavior: 'instant' });
    } catch (e) {}
  }

  container.dispatchEvent(new Event('scroll', { bubbles: true, cancelable: true }));
  container.dispatchEvent(new UIEvent('scroll', { bubbles: true }));

  try {
    container.dispatchEvent(new WheelEvent('wheel', { deltaY: -600, deltaMode: 0, bubbles: true, cancelable: true }));
  } catch (e) {}
};

let isChatScanning = false;

// Función para ejecutar el escaneo automático del chat cubriendo la pantalla para máximo rendimiento
executeChatScan = async () => {
  if (isChatScanning) {
    isChatScanning = false;
    return;
  }

  const container = findChatScrollable();
  if (!container) {
    alert(t("noStickersOnScreen"));
    return;
  }

  const scanConvId = getActiveConversationId();
  let scanState = registerStickersFromDOM(scanConvId);

  const initialImgs = Array.from(document.querySelectorAll('img[alt="sticker"]')) as HTMLImageElement[];
  if (initialImgs.length > 0) {
    scanState.newestKnownStickerId = getStickerId(initialImgs[initialImgs.length - 1].src);
    saveConversationScanState(scanState);
  }

    let wasScanAbortedByUser = false;

  const handleScanIntercept = (e: MouseEvent) => {
    if (!isChatScanning) return;
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Permitir clics dentro del overlay de escaneo o dentro del propio diálogo de confirmación
    if (target.closest('#tt-stickers-scanning-overlay') || target.closest('#tt-cancel-scan-dialog')) {
      return;
    }

    // Interceptar cualquier clic fuera del área del escaneo
    e.preventDefault();
    e.stopPropagation();

    if (document.getElementById('tt-cancel-scan-dialog')) return;

    const pendingClickable = target.closest('a, button, [role="button"], [data-conversation-id]') as HTMLElement | null;

    showCancelScanConfirmationDialog(
      () => {
        // Usuario confirmó cancelar el escaneo
        wasScanAbortedByUser = true;
        isChatScanning = false;
        if (pendingClickable) {
          setTimeout(() => {
            pendingClickable.click();
          }, 100);
        }
      },
      () => {
        // Usuario decidió continuar escaneando
      }
    );
  };

  document.addEventListener('click', handleScanIntercept, true);

  const handlePopState = () => {
    if (!isChatScanning) return;
    showCancelScanConfirmationDialog(
      () => {
        wasScanAbortedByUser = true;
        isChatScanning = false;
      },
      () => {
        window.history.forward();
      }
    );
  };
  window.addEventListener('popstate', handlePopState);

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isChatScanning) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  window.addEventListener('beforeunload', handleBeforeUnload);

  isChatScanning = true;

  // Cubrir únicamente el área del chat para eliminar la carga gráfica de la GPU y bloquear scroll manual sin tapar toda la pantalla en PC
  const chatArea = (container ? (container.closest('#main-content-messages, div[class*="DivChatBox"], div[class*="DivChatRoom"], div[class*="DivMessagesContainer"], div[class*="DivChatContainer"]') as HTMLElement | null) : null) || container;

  const scanOverlay = document.createElement("div");
  scanOverlay.id = "tt-stickers-scanning-overlay";
  scanOverlay.style.backgroundColor = "#121212";
  scanOverlay.style.zIndex = "99999999";
  scanOverlay.style.display = "flex";
  scanOverlay.style.flexDirection = "column";
  scanOverlay.style.alignItems = "center";
  scanOverlay.style.justifyContent = "center";
  scanOverlay.style.padding = "24px";
  scanOverlay.style.boxSizing = "border-box";
  scanOverlay.style.touchAction = "none";
  scanOverlay.style.color = "white";
  scanOverlay.style.fontFamily = "sans-serif";

  const updateScanOverlayBounds = () => {
    if (chatArea && chatArea !== document.body) {
      const rect = chatArea.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        scanOverlay.style.position = "fixed";
        scanOverlay.style.top = `${rect.top}px`;
        scanOverlay.style.left = `${rect.left}px`;
        scanOverlay.style.width = `${rect.width}px`;
        scanOverlay.style.height = `${rect.height}px`;
        scanOverlay.style.borderLeft = isMobileDevice() ? "none" : "1px solid rgba(255, 255, 255, 0.08)";
        return;
      }
    }
    scanOverlay.style.position = "fixed";
    scanOverlay.style.top = "0";
    scanOverlay.style.left = "0";
    scanOverlay.style.width = "100vw";
    scanOverlay.style.height = "100vh";
  };

  updateScanOverlayBounds();
  window.addEventListener("resize", updateScanOverlayBounds);

  if (!document.getElementById("tt-scanner-spin-style")) {
    const spinStyle = document.createElement("style");
    spinStyle.id = "tt-scanner-spin-style";
    spinStyle.textContent = `@keyframes ttSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
    document.head.appendChild(spinStyle);
  }

  const spinner = document.createElement("div");
  spinner.innerHTML = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" style="animation: ttSpin 0.75s linear infinite;"><circle cx="24" cy="24" r="20" stroke="rgba(255, 255, 255, 0.12)" stroke-width="4"></circle><path d="M 24 4 A 20 20 0 0 1 44 24" stroke="#FE004F" stroke-width="4" stroke-linecap="round"></path></svg>`;
  scanOverlay.appendChild(spinner);

  const scanTitle = document.createElement("h3");
  scanTitle.innerText = t("scanningTitle");
  scanTitle.style.margin = "18px 0 8px 0";
  scanTitle.style.fontSize = "19px";
  scanTitle.style.fontWeight = "bold";
  scanOverlay.appendChild(scanTitle);

  const counterEl = document.createElement("div");
  counterEl.innerText = t("stickersFound", { count: scanState.stickers.length });
  counterEl.style.fontSize = "15px";
  counterEl.style.color = "#FE004F";
  counterEl.style.fontWeight = "600";
  counterEl.style.marginBottom = "14px";
  scanOverlay.appendChild(counterEl);

  const scanDesc = document.createElement("p");
  scanDesc.innerText = t("scanningSubtitle");
  scanDesc.style.color = "rgba(255, 255, 255, 0.6)";
  scanDesc.style.fontSize = "13px";
  scanDesc.style.margin = "0 0 28px 0";
  scanDesc.style.textAlign = "center";
  scanOverlay.appendChild(scanDesc);

  const btnStop = document.createElement("button");
  btnStop.innerText = t("stopScan");
  btnStop.style.padding = "10px 24px";
  btnStop.style.borderRadius = "20px";
  btnStop.style.border = "1px solid rgba(255, 255, 255, 0.25)";
  btnStop.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
  btnStop.style.color = "#ffffff";
  btnStop.style.fontSize = "14px";
  btnStop.style.fontWeight = "600";
  btnStop.style.cursor = "pointer";
  btnStop.onclick = () => {
    isChatScanning = false;
  };
  scanOverlay.appendChild(btnStop);

  document.body.appendChild(scanOverlay);

  let lastScrollHeight = container.scrollHeight;
  let lastChildCount = container.childElementCount;
  let lastFirstChildText = container.firstElementChild?.textContent || "";
  let unchangedTries = 0;
  const maxUnchanged = 16;

  try {
    while (isChatScanning) {
      if (getActiveConversationId() !== scanConvId) {
        break;
      }

      scanState = registerStickersFromDOM(scanConvId);
      const totalDiscovered = scanState.stickers.length;
      counterEl.innerText = t("stickersFound", { count: totalDiscovered });

      triggerScrollToTop(container);

      const currentScrollHeight = container.scrollHeight;
      const currentChildCount = container.childElementCount;
      const currentFirstChildText = container.firstElementChild?.textContent || "";
      const isAtTop = container.scrollTop <= 5;

      const hasChanged = 
        currentScrollHeight !== lastScrollHeight || 
        currentChildCount !== lastChildCount ||
        currentFirstChildText !== lastFirstChildText;

      if (isAtTop && !hasChanged) {
        unchangedTries++;
        if (unchangedTries >= maxUnchanged) {
          scanState.hasReachedBeginning = true;
          scanState.lastScanTimestamp = Date.now();
          saveConversationScanState(scanState);
          console.log("[TiktokStickersExporter] Se alcanzó el inicio real de la conversación.");
          break;
        }
      } else {
        unchangedTries = 0;
        lastScrollHeight = currentScrollHeight;
        lastChildCount = currentChildCount;
        lastFirstChildText = currentFirstChildText;
      }

      await new Promise(r => setTimeout(r, 350));
    }
  } finally {
    document.removeEventListener('click', handleScanIntercept, true);
    window.removeEventListener('popstate', handlePopState);
    window.removeEventListener('beforeunload', handleBeforeUnload);

    const existingConfirm = document.getElementById('tt-cancel-scan-dialog');
    if (existingConfirm) existingConfirm.remove();

    isChatScanning = false;
    window.removeEventListener("resize", updateScanOverlayBounds);
    scanOverlay.remove();

    scanState = registerStickersFromDOM(scanConvId);
    scanState.lastScanTimestamp = Date.now();
    saveConversationScanState(scanState);

    addDownloadAllButton();
    addIndividualDownloadButtons();

    if (!wasScanAbortedByUser) {
      if (scanState.stickers.length > 0) {
        openStickersModal();
      } else {
        alert(t("noStickersOnScreen"));
      }
    }
  }
};

// Función para inyectar ÚNICAMENTE el botón "Ver Stickers" en el Header del chat
const addDownloadAllButton = () => {
  const headerContainer = document.querySelector('div[class*="--DivChatHeader"], div[class*="ChatHeader"], [data-e2e="chat-header"]') as HTMLElement;
  if (!headerContainer) return;

  const convId = getActiveConversationId();
  const state = registerStickersFromDOM(convId);

  const stickerImages = Array.from(document.querySelectorAll('img[alt="sticker"]')) as HTMLImageElement[];
  const domUrls = stickerImages.map(img => img.src);
  const storedUrls = state.stickers.map(s => s.url);
  const allStickers = deduplicateStickerUrls([...storedUrls, ...domUrls]);

  const newStickers = allStickers.filter(url => !isDownloaded(url));
  const newStickerCount = newStickers.length;

  let btnContainer = document.getElementById("tiktok-stickers-exporter-header-btns") as HTMLElement | null;
  if (btnContainer && (btnContainer.dataset.convId !== convId || !btnContainer.querySelector(".btn-view"))) {
    btnContainer.remove();
    btnContainer = null;
  }
  
  if (!btnContainer) {
    btnContainer = document.createElement("div");
    btnContainer.id = "tiktok-stickers-exporter-header-btns";
    btnContainer.dataset.convId = convId;
    btnContainer.style.display = "flex";
    btnContainer.style.marginLeft = "auto";
    btnContainer.style.marginRight = "10px";
    btnContainer.style.alignItems = "center";

    const createTextBtn = (text: string, isPrimary: boolean) => {
      const btn = document.createElement("button");
      btn.innerText = text;
      btn.style.cursor = "pointer";
      btn.style.padding = "6px 14px";
      btn.style.borderRadius = "8px";
      btn.style.backgroundColor = isPrimary ? "#fe2c55" : "transparent";
      btn.style.border = "1px solid #fe2c55";
      btn.style.color = isPrimary ? "white" : "#fe2c55";
      btn.style.fontWeight = "bold";
      btn.style.fontSize = "13px";
      btn.style.whiteSpace = "nowrap";
      btn.style.transition = "transform 0.2s, background-color 0.2s";
      
      btn.addEventListener("mouseenter", () => {
        btn.style.transform = "scale(1.05)";
        if(!isPrimary) btn.style.backgroundColor = "rgba(254, 44, 85, 0.1)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "scale(1)";
        if(!isPrimary) btn.style.backgroundColor = "transparent";
      });
      return btn;
    };

    // Botón único "Ver stickers"
    const viewText = newStickerCount > 0 
      ? t("viewStickers", { count: newStickerCount }) 
      : t("viewStickersNoCount");
    const btnView = createTextBtn(viewText, true);
    btnView.className = "btn-view";
    btnView.title = t("viewStickersTitle");
    btnView.addEventListener("click", openStickersModal);

    btnContainer.appendChild(btnView);
    
    if (window.getComputedStyle(headerContainer).display !== "flex") {
      headerContainer.style.display = "flex";
      headerContainer.style.alignItems = "center";
    }
    headerContainer.appendChild(btnContainer);
  } else {
    // Si ya existe el contenedor en pantalla, actualizar únicamente el botón "Ver stickers"
    const btnView = btnContainer.querySelector(".btn-view") as HTMLButtonElement;
    if (btnView && !isChatScanning) {
      const viewText = newStickerCount > 0 
        ? t("viewStickers", { count: newStickerCount }) 
        : t("viewStickersNoCount");
      btnView.innerText = viewText;
    }
  }
};

// Función para inyectar un botón de descarga individual SOBRE cada sticker
const updateIndivButtonVisual = (btn: HTMLElement, isDone: boolean) => {
  const isMobile = isMobileDevice();
  const iconSize = isMobile ? 18 : 14;
  const strokeWidth = isMobile ? 2.8 : 2.5;

  btn.style.backgroundColor = isDone ? "rgba(18, 18, 18, 0.78)" : "rgba(18, 18, 18, 0.72)";
  btn.style.border = isDone ? "1.5px solid #2ed573" : "1.5px solid rgba(255, 255, 255, 0.35)";
  btn.title = isDone ? t("alreadyDownloadedTooltip") : t("downloadThis");
  
  if (isDone) {
    btn.innerHTML = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="#2ed573" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`;
  } else {
    btn.innerHTML = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>`;
  }
};

const addIndividualDownloadButtons = () => {
  const stickerImages = document.querySelectorAll('img[alt="sticker"]');
  
  stickerImages.forEach((img) => {
    const htmlImg = img as HTMLImageElement;
    const parent = htmlImg.parentElement;
    if (!parent) return;
    
    if (htmlImg.dataset.exporterAdded === "true") {
      const existingBtn = parent.querySelector('.tiktok-sticker-indiv-btn') as HTMLElement;
      if (existingBtn) {
        updateIndivButtonVisual(existingBtn, isDownloaded(htmlImg.src));
        const isMob = isMobileDevice();
        const curSize = `${isMob ? 38 : 28}px`;
        if (existingBtn.style.width !== curSize) {
          existingBtn.style.width = curSize;
          existingBtn.style.height = curSize;
          existingBtn.style.bottom = isMob ? "8px" : "6px";
          existingBtn.style.right = isMob ? "8px" : "6px";
        }
      }
      return;
    }
    htmlImg.dataset.exporterAdded = "true";
    
    const parentStyle = window.getComputedStyle(parent);
    if (parentStyle.position === "static") {
      parent.style.position = "relative";
    }
    
    const isMobile = isMobileDevice();
    const btnSize = isMobile ? 38 : 28;
    const iconSize = isMobile ? 18 : 14;
    const strokeWidth = isMobile ? 2.8 : 2.5;

    const btn = document.createElement("div");
    btn.role = "button";
    btn.className = "tiktok-sticker-indiv-btn";
    btn.style.position = "absolute";
    btn.style.bottom = isMobile ? "8px" : "6px";
    btn.style.right = isMobile ? "8px" : "6px";
    btn.style.cursor = "pointer";
    btn.style.width = `${btnSize}px`;
    btn.style.height = `${btnSize}px`;
    btn.style.borderRadius = "50%";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.backdropFilter = "blur(4px)";
    btn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.5)";
    btn.style.zIndex = "25";
    btn.style.transition = "transform 0.2s, background-color 0.2s, border-color 0.2s";
    btn.style.touchAction = "manipulation";
    (btn.style as any).webkitTapHighlightColor = "transparent";
    
    const alreadyDownloaded = isDownloaded(htmlImg.src);
    updateIndivButtonVisual(btn, alreadyDownloaded);
    
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.15)";
      btn.style.backgroundColor = "#fe2c55";
      btn.style.borderColor = "#fe2c55";
      btn.innerHTML = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
      updateIndivButtonVisual(btn, isDownloaded(htmlImg.src));
    });

    btn.addEventListener("touchstart", () => {
      btn.style.transform = "scale(0.92)";
    }, { passive: true });
    btn.addEventListener("touchend", () => {
      btn.style.transform = "scale(1)";
    }, { passive: true });
    
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      const stickerUrl = htmlImg.src;
      try {
        const res = await fetch(stickerUrl);
        const ext = getExtension(res);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tiktok-sticker-${Date.now()}.${ext}`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        markAsDownloaded(stickerUrl);
        updateIndivButtonVisual(btn, true);
        
        addDownloadAllButton();
      } catch (err) {
        console.error("Error al descargar el sticker:", stickerUrl);
      }
    });
    
    parent.appendChild(btn);
  });
};

// Inyecta estilos globales permanentes para unificar el fondo del header (#121212) y expandir tarjetas de conversación al 100% de la columna (en PC y móvil)
const ensureGlobalMessagesLayoutStyles = () => {
  if (typeof document === 'undefined') return;
  if (!document.getElementById("tt-messages-layout-styles")) {
    const style = document.createElement("style");
    style.id = "tt-messages-layout-styles";
    style.textContent = `
      /* ========================================================================== */
      /* 1. UNIFICACIÓN DE COLOR DE FONDO ENTRE HEADER Y LISTA (#121212)             */
      /* ========================================================================== */
      div[class*="DivSideNavContainer"],
      div[class*="DivDrawerContainer"],
      div[class*="DivMessageDrawerContainer"],
      div[class*="DivConversationListContainer"],
      div[data-e2e="dm-new-conversation-list"],
      div[class*="DivV3AnimRoot"],
      div[class*="DivV3AnimLeftColumn"],
      div[class*="DivV3AnimLeftContentArea"],
      div[class*="BaseBodyContainer"],
      div[class*="DivHeaderContainer"],
      div[class*="DivNavigationContainer"],
      div[class*="DivTitleContainer"],
      div[class*="DivDrawerHeader"],
      div[class*="DivConversationListHeader"],
      div[class*="DivChatRoomListHeader"],
      header[class*="Drawer"],
      header[class*="Header"],
      header {
        background-color: #121212 !important;
        background: #121212 !important;
        border-color: transparent !important;
        border-bottom: none !important;
        box-shadow: none !important;
      }

      /* Eliminar pseudo-elementos de sombra o gradiente bajo el header */
      div[class*="DivHeaderContainer"]::after,
      div[class*="DivHeaderContainer"]::before,
      div[class*="DivTitleContainer"]::after,
      div[class*="DivTitleContainer"]::before,
      div[class*="DivDrawerHeader"]::after,
      div[class*="DivDrawerHeader"]::before,
      header::after,
      header::before {
        display: none !important;
        box-shadow: none !important;
        background: none !important;
      }

      /* ========================================================================== */
      /* 2. EXPANSIÓN DE TARJETAS DE CONVERSACIÓN AL 100% DEL ANCHO DE LA COLUMNA   */
      /* ========================================================================== */
      div[data-e2e="dm-new-conversation-list"],
      div[data-e2e="dm-new-conversation-list"] [class*="DivListContent"],
      div[data-conversation-id] {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }

      /* La tarjeta de conversación dentro de cada fila */
      div[data-conversation-id] > * {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        display: flex !important;
        align-items: center !important;
      }

      /* Avatares: tamaño fijo estrictamente circular (nunca deformar ni estirar) */
      div[data-conversation-id] [class*="Avatar"],
      div[data-conversation-id] [class*="avatar"],
      div[data-conversation-id] [role="img"] {
        width: 48px !important;
        height: 48px !important;
        min-width: 48px !important;
        min-height: 48px !important;
        max-width: 48px !important;
        max-height: 48px !important;
        border-radius: 50% !important;
        flex: 0 0 48px !important;
        flex-shrink: 0 !important;
        flex-grow: 0 !important;
      }

      div[data-conversation-id] img {
        width: 48px !important;
        height: 48px !important;
        min-width: 48px !important;
        min-height: 48px !important;
        max-width: 48px !important;
        max-height: 48px !important;
        border-radius: 50% !important;
        object-fit: cover !important;
        flex-shrink: 0 !important;
      }

      div[data-conversation-id] svg {
        flex-shrink: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }
};

// Sincroniza dinámicamente el fondo del header y expande las tarjetas de conversación en el DOM
const syncHeaderAndConversationCards = () => {
  ensureGlobalMessagesLayoutStyles();

  // 1. Unificar fondo del header de mensajes a #121212 (recorrer hacia arriba todos los niveles contenedores)
  const h2s = Array.from(document.querySelectorAll('h2'));
  const messagesH2 = h2s.find(h2 => h2.innerText.includes("Messages") || h2.innerText.includes("Mensajes") || (h2.className && h2.className.includes("H2Semibold")));
  if (messagesH2 && messagesH2.parentElement) {
    let curr: HTMLElement | null = messagesH2.parentElement;
    for (let i = 0; i < 6 && curr; i++) {
      if (curr === document.body || curr.id === 'main-content-messages') break;
      curr.style.setProperty("background-color", "#121212", "important");
      curr.style.setProperty("background", "#121212", "important");
      curr.style.setProperty("box-shadow", "none", "important");
      curr.style.setProperty("border", "none", "important");
      curr.style.setProperty("border-bottom", "none", "important");
      curr = curr.parentElement;
    }
  }

  // 2. Expandir el contenedor de la lista y asegurar fondo uniforme #121212
  const convList = document.querySelector('[data-e2e="dm-new-conversation-list"], div[class*="DivConversationList"], div[class*="DivMessageDrawerContainer"]') as HTMLElement | null;
  if (convList) {
    convList.style.setProperty("background-color", "#121212", "important");
    convList.style.setProperty("background", "#121212", "important");
    convList.style.setProperty("width", "100%", "important");
    convList.style.setProperty("box-sizing", "border-box", "important");
  }

  // 3. Expandir las tarjetas de conversación usando data-conversation-id
  const rows = document.querySelectorAll('div[data-conversation-id]');
  rows.forEach((row) => {
    const rowEl = row as HTMLElement;
    rowEl.style.setProperty("width", "100%", "important");
    rowEl.style.setProperty("max-width", "100%", "important");
    rowEl.style.setProperty("box-sizing", "border-box", "important");

    // Tarjeta directa dentro de la fila virtual
    const card = rowEl.firstElementChild as HTMLElement | null;
    if (card) {
      card.style.setProperty("width", "100%", "important");
      card.style.setProperty("max-width", "100%", "important");
      card.style.setProperty("box-sizing", "border-box", "important");
      card.style.setProperty("display", "flex", "important");
      card.style.setProperty("align-items", "center", "important");

      // Restaurar y proteger el avatar (tamaño fijo 48px, estrictamente circular)
      const avatarEl = card.querySelector('img, [class*="Avatar"], [class*="avatar"]') as HTMLElement | null;
      if (avatarEl) {
        avatarEl.style.setProperty("width", "48px", "important");
        avatarEl.style.setProperty("height", "48px", "important");
        avatarEl.style.setProperty("min-width", "48px", "important");
        avatarEl.style.setProperty("min-height", "48px", "important");
        avatarEl.style.setProperty("max-width", "48px", "important");
        avatarEl.style.setProperty("max-height", "48px", "important");
        avatarEl.style.setProperty("border-radius", "50%", "important");
        avatarEl.style.setProperty("flex", "0 0 48px", "important");
        avatarEl.style.setProperty("flex-shrink", "0", "important");
      }
    }
  });
};

const addSettingsButton = () => {
  const h2s = Array.from(document.querySelectorAll('h2'));
  const messagesH2 = h2s.find(h2 => h2.innerText.includes("Messages") || h2.innerText.includes("Mensajes") || (h2.className && h2.className.includes("H2Semibold")));
  
  if (!messagesH2) return;
  const targetContainer = messagesH2.parentElement;
  if (!targetContainer) return;

  // Botón chevron left al lado de "Mensajes" para volver a tiktok.com (solo en móvil)
  if (isMobileDevice()) {
    if (!document.getElementById('tiktok-stickers-back-home-btn')) {
      const btnHome = document.createElement("button");
      btnHome.id = "tiktok-stickers-back-home-btn";
      btnHome.setAttribute("aria-label", "Volver a TikTok");
      btnHome.title = "Volver a TikTok";
      btnHome.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
      btnHome.style.background = "none";
      btnHome.style.border = "none";
      btnHome.style.color = "#ffffff";
      btnHome.style.cursor = "pointer";
      btnHome.style.padding = "6px";
      btnHome.style.marginRight = "6px";
      btnHome.style.display = "inline-flex";
      btnHome.style.alignItems = "center";
      btnHome.style.justifyContent = "center";
      btnHome.style.borderRadius = "50%";
      btnHome.onclick = (e) => {
        e.stopPropagation();
        window.location.href = 'https://www.tiktok.com/';
      };
      targetContainer.insertBefore(btnHome, messagesH2);
    }
  } else {
    const existingHome = document.getElementById('tiktok-stickers-back-home-btn');
    if (existingHome) existingHome.remove();
  }

  if (document.getElementById('tiktok-stickers-exporter-settings-btn')) return;

  const btn = document.createElement("button");
  btn.id = "tiktok-stickers-exporter-settings-btn";
  btn.innerText = t("settings");
  btn.style.cursor = "pointer";
  btn.style.marginLeft = "12px";
  btn.style.display = "inline-flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.backgroundColor = "#fe2c55";
  btn.style.border = "1px solid #fe2c55";
  btn.style.color = "white";
  btn.style.padding = "6px 12px";
  btn.style.borderRadius = "8px";
  btn.style.fontWeight = "bold";
  btn.style.fontSize = "13px";
  btn.style.transition = "transform 0.2s, background-color 0.2s";
  btn.style.zIndex = "50";

  btn.addEventListener("mouseenter", () => {
    btn.style.transform = "scale(1.05)";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "scale(1)";
  });
  btn.onclick = () => showSettingsModal();
  
  // Unificar color de fondo del header al mismo #121212 que la lista (en PC y móvil)
  let headerParent: HTMLElement | null = targetContainer;
  for (let i = 0; i < 6 && headerParent; i++) {
    if (headerParent === document.body || headerParent.id === 'main-content-messages') break;
    headerParent.style.setProperty("background-color", "#121212", "important");
    headerParent.style.setProperty("background", "#121212", "important");
    headerParent.style.setProperty("box-shadow", "none", "important");
    headerParent.style.setProperty("border", "none", "important");
    headerParent.style.setProperty("border-bottom", "none", "important");
    headerParent = headerParent.parentElement;
  }

  btn.style.setProperty("background-color", "#FE004F", "important");
  btn.style.setProperty("border", "1px solid #FE004F", "important");

  targetContainer.style.display = "flex";
  targetContainer.style.alignItems = "center";
  targetContainer.style.justifyContent = "space-between";
  targetContainer.appendChild(btn);

  syncHeaderAndConversationCards();
};


// En dispositivos móviles (p.ej. Firefox Android o Chrome con emulación móvil), desactiva completamente el zoom sin distorsionar la resolución
const enforceDesktopViewport = () => {
  if (!isMobileDevice()) return;
  try {
    let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    meta.setAttribute('data-forced-desktop', 'true');
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  } catch (e) {
    console.error("Error ajustando viewport:", e);
  }
};

// Configura mejoras de interfaz móvil, desactiva gestos de zoom y adapta TikTok Messages al ancho del móvil
const setupMobileEnhancements = () => {
  if (!isMobileDevice()) return;

  // 1. Bloquear zoom táctil (pinch-to-zoom y doble tap)
  document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
  });

  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  // 2. Estilos para que en /messages la UI se adapte como una app móvil nativa
  if (!document.getElementById('tt-mobile-enhancement-styles')) {
    const style = document.createElement('style');
    style.id = 'tt-mobile-enhancement-styles';
    style.textContent = `
      html, body {
        touch-action: pan-x pan-y !important;
      }
      /* Ocultar barra superior de escritorio para ganar espacio vertical */
      #app-header {
        display: none !important;
      }
      /* Quitar la barra lateral izquierda por completo y alinear al borde izquierdo (0px) */
      div[class*="DivAnimationCover"],
      div[class*="DivFixedContentContainer"],
      div[class*="DivScrollingContentContainer"] {
        display: none !important;
        width: 0 !important;
        min-width: 0 !important;
        max-width: 0 !important;
      }
      div[class*="BaseBodyContainer"] {
        padding: 0 !important;
        margin: 0 !important;
      }
      div[class*="DivSideNavPlaceholderContainer"],
      div[class*="DivSideNavContainer"] {
        width: 100vw !important;
        max-width: 100vw !important;
        min-width: 100vw !important;
        left: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      div[class*="DivDrawerContainer"],
      div[class*="DivMessageDrawerContainer"] {
        left: 0 !important;
        margin-left: 0 !important;
        transform: none !important;
      }

      /* VISTA 1: Lista de conversaciones (cuando NO hay chat individual abierto) */
      body:not(.tt-chat-active) div[class*="DivSideNavPlaceholderContainer"],
      body:not(.tt-chat-active) div[class*="DivSideNavContainer"],
      body:not(.tt-chat-active) div[class*="DivDrawerContainer"],
      body:not(.tt-chat-active) div[class*="DivMessageDrawerContainer"],
      body:not(.tt-chat-active) div[class*="DivConversationListContainer"],
      body:not(.tt-chat-active) div[data-e2e="dm-new-conversation-list"],
      body:not(.tt-chat-active) div[class*="DivV3AnimRoot"],
      body:not(.tt-chat-active) div[class*="DivV3AnimLeftColumn"],
      body:not(.tt-chat-active) div[class*="DivV3AnimLeftContentArea"] {
        width: 100vw !important;
        max-width: 100vw !important;
        min-width: 100vw !important;
        box-sizing: border-box !important;
      }
      body:not(.tt-chat-active) div[data-e2e="dm-new-conversation-list"] > div {
        width: 100% !important;
        box-sizing: border-box !important;
      }
      body:not(.tt-chat-active) #main-content-messages {
        display: none !important;
      }

      /* VISTA 2: Chat activo (al abrir una conversación) */
      body.tt-chat-active div[class*="DivSideNavPlaceholderContainer"],
      body.tt-chat-active div[class*="DivSideNavContainer"],
      body.tt-chat-active div[class*="DivDrawerContainer"],
      body.tt-chat-active div[class*="DivMessageDrawerContainer"],
      body.tt-chat-active div[class*="DivConversationListContainer"],
      body.tt-chat-active div[data-e2e="dm-new-conversation-list"],
      body.tt-chat-active div[class*="DivV3AnimRoot"],
      body.tt-chat-active div[class*="DivV3AnimLeftColumn"],
      body.tt-chat-active div[class*="DivV3AnimLeftContentArea"] {
        display: none !important;
      }
      body.tt-chat-active #main-content-messages,
      body.tt-chat-active div[class*="DivFullSideNavLayout"],
      body.tt-chat-active div[class*="DivChatBox"],
      body.tt-chat-active div[class*="DivMessagesContainer"],
      body.tt-chat-active div[class*="DivChatRoom"],
      body.tt-chat-active div[class*="DivChatContainer"] {
        display: flex !important;
        width: 100vw !important;
        max-width: 100vw !important;
        min-width: 100vw !important;
        margin: 0 !important;
        padding: 0 !important;
        flex: 1 1 auto !important;
        box-sizing: border-box !important;
      }

      /* UNIFICACIÓN DE COLOR DE FONDO ENTRE HEADER Y LISTA (#121212) */
      body:not(.tt-chat-active) div[class*="DivSideNavContainer"],
      body:not(.tt-chat-active) div[class*="DivDrawerContainer"],
      body:not(.tt-chat-active) div[class*="DivMessageDrawerContainer"],
      body:not(.tt-chat-active) div[class*="DivConversationListContainer"],
      body:not(.tt-chat-active) div[data-e2e="dm-new-conversation-list"],
      body:not(.tt-chat-active) div[class*="DivV3AnimRoot"],
      body:not(.tt-chat-active) div[class*="DivV3AnimLeftColumn"],
      body:not(.tt-chat-active) div[class*="DivV3AnimLeftContentArea"],
      body:not(.tt-chat-active) div[class*="BaseBodyContainer"],
      body:not(.tt-chat-active) div[class*="DivHeaderContainer"],
      body:not(.tt-chat-active) div[class*="DivNavigationContainer"],
      body:not(.tt-chat-active) div[class*="DivTitleContainer"],
      body:not(.tt-chat-active) header {
        background-color: #121212 !important;
      }

      /* ESTILOS PERSONALIZADOS DE LA LISTA DE CHATS EN MÓVIL */
      body:not(.tt-chat-active) div[data-e2e="dm-new-conversation-list"] {
        padding: 8px 12px !important;
        background-color: #121212 !important;
        box-sizing: border-box !important;
        width: 100vw !important;
        max-width: 100vw !important;
      }
      /* Items de conversación: EXPANDIR AL 100% DEL ANCHO */
      body:not(.tt-chat-active) div[class*="DivConversationWrap"],
      body:not(.tt-chat-active) div[class*="DivConversationList"],
      body:not(.tt-chat-active) div[class*="DivItemContainer"],
      body:not(.tt-chat-active) div[data-e2e="dm-new-conversation-list"] > div,
      body:not(.tt-chat-active) div[data-e2e="dm-new-conversation-list"] a,
      body:not(.tt-chat-active) div[data-e2e="dm-new-conversation-list"] [role="listitem"],
      body:not(.tt-chat-active) [class*="ConversationItem"],
      body:not(.tt-chat-active) [data-e2e="conversation-item"] {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
      }
      body:not(.tt-chat-active) div[data-e2e="dm-new-conversation-list"] a,
      body:not(.tt-chat-active) div[data-e2e="dm-new-conversation-list"] [role="listitem"],
      body:not(.tt-chat-active) [class*="ConversationItem"] {
        padding: 12px 14px !important;
        margin-bottom: 8px !important;
        border-radius: 14px !important;
        background-color: rgba(255, 255, 255, 0.04) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        transition: background-color 0.15s, transform 0.1s !important;
        display: flex !important;
        align-items: center !important;
        cursor: pointer !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
      }
      /* Contenido textual interno de la tarjeta expandido */
      body:not(.tt-chat-active) [class*="ConversationItem"] > div,
      body:not(.tt-chat-active) div[data-e2e="dm-new-conversation-list"] a > div,
      body:not(.tt-chat-active) div[data-e2e="dm-new-conversation-list"] [role="listitem"] > div {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        width: auto !important;
      }
      body:not(.tt-chat-active) div[data-e2e="dm-new-conversation-list"] a:active,
      body:not(.tt-chat-active) [class*="ConversationItem"]:active {
        background-color: rgba(254, 44, 85, 0.15) !important;
        border-color: rgba(254, 44, 85, 0.4) !important;
        transform: scale(0.985) !important;
      }
      /* Avatares grandes y nítidos */
      body:not(.tt-chat-active) div[data-e2e="dm-new-conversation-list"] img,
      body:not(.tt-chat-active) [class*="ConversationItem"] img {
        width: 46px !important;
        height: 46px !important;
        border-radius: 50% !important;
        margin-right: 12px !important;
        border: 1.5px solid rgba(255, 255, 255, 0.15) !important;
      }

      /* Botón de acción del header (View stickers) */
      #tiktok-stickers-exporter-header-btns {
        display: flex !important;
        align-items: center !important;
        margin-left: auto !important;
      }
      #tiktok-stickers-exporter-header-btns button {
        padding: 7px 14px !important;
        font-size: 13px !important;
        border-radius: 10px !important;
        white-space: nowrap !important;
        box-shadow: 0 2px 8px rgba(254, 44, 85, 0.4) !important;
      }
      #tiktok-stickers-exporter-settings-btn {
        background-color: #fe2c55 !important;
        color: white !important;
        border: none !important;
        padding: 6px 14px !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        border-radius: 16px !important;
        box-shadow: 0 2px 8px rgba(254, 44, 85, 0.35) !important;
      }
    `;
    document.head.appendChild(style);
  }
};

let lastActiveHeader: Element | null = null;
let userClosedChatMobile = false;
let userIntentionallyFocusedInput = false;
let suppressAutofocusUntil = 0;

if (typeof document !== 'undefined') {
  // Al hacer clic en un chat de la lista de conversaciones en móvil, reactivar la vista de chat y suprimir autofocus
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.closest('[data-e2e="dm-new-conversation-list"]') || target.closest('[class*="ConversationItem"]'))) {
      userClosedChatMobile = false;
      userIntentionallyFocusedInput = false;
      suppressAutofocusUntil = Date.now() + 2500; // Suprime autofocus durante la carga del chat
      document.body.classList.add('tt-chat-active');
    }
  }, true);

  // Permitir foco SOLO cuando el usuario toca intencionalmente el input de mensaje
  document.addEventListener('pointerdown', (e) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.getAttribute('contenteditable') === 'true' || target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) {
      userIntentionallyFocusedInput = true;
      suppressAutofocusUntil = 0;
      setTimeout(() => { userIntentionallyFocusedInput = false; }, 1500);
    }
  }, true);

  // Evitar autofocus automático de TikTok para que NO se levante el teclado móvil
  document.addEventListener('focusin', (e) => {
    if (!isMobileDevice()) return;
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const isEditor = target.getAttribute('contenteditable') === 'true' || target.tagName === 'TEXTAREA' || target.tagName === 'INPUT';
    if (isEditor) {
      const now = Date.now();
      if (now < suppressAutofocusUntil || !userIntentionallyFocusedInput) {
        e.preventDefault();
        e.stopPropagation();
        target.blur();
        if (document.activeElement === target) {
          (document.activeElement as HTMLElement).blur();
        }
      }
    }
  }, true);
}

const updateMobileLayout = () => {
  if (!isMobileDevice()) return;
  const isMessages = window.location.pathname.startsWith('/messages');
  if (!isMessages) {
    document.body.classList.remove('tt-chat-active');
    userClosedChatMobile = false;
    return;
  }

  const header = document.querySelector('div[class*="--DivChatHeader"], div[class*="ChatHeader"], [data-e2e="chat-header"]') as HTMLElement | null;
  if (header) {
    if (header !== lastActiveHeader) {
      lastActiveHeader = header;
      userClosedChatMobile = false;
    }

    if (!userClosedChatMobile) {
      document.body.classList.add('tt-chat-active');
    }

    // Agregar botón ← para volver a la lista de chats si no existe
    if (!header.querySelector('.btn-mobile-back-to-list')) {
      const btnBack = document.createElement('button');
      btnBack.className = 'btn-mobile-back-to-list';
      btnBack.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`;
      btnBack.style.background = 'none';
      btnBack.style.border = 'none';
      btnBack.style.color = '#ffffff';
      btnBack.style.cursor = 'pointer';
      btnBack.style.padding = '8px';
      btnBack.style.marginRight = '8px';
      btnBack.style.display = 'inline-flex';
      btnBack.style.alignItems = 'center';
      btnBack.style.justifyContent = 'center';
      btnBack.title = 'Volver a chats';
      btnBack.onclick = (e) => {
        e.stopPropagation();
        userClosedChatMobile = true;
        document.body.classList.remove('tt-chat-active');
      };
      header.prepend(btnBack);
    }
  } else {
    document.body.classList.remove('tt-chat-active');
    userClosedChatMobile = false;
  }
};

// Muestra un diálogo flotante al entrar a TikTok si no estamos en /messages
let userDismissedRedirectDialog = false;

const checkAndShowMessagesRedirectDialog = () => {
  if (userDismissedRedirectDialog) return;
  if (!isMobileDevice()) return;
  if (window.location.pathname.startsWith('/messages')) return;

  if (document.getElementById('tt-stickers-redirect-dialog')) return;
  if (!document.body) return;

  const isMobile = isMobileDevice();
  ensureModalAnimationsStyle();

  const overlay = document.createElement('div');
  overlay.id = 'tt-stickers-redirect-dialog';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  overlay.style.zIndex = '9999999';
  overlay.style.display = 'flex';
  overlay.style.alignItems = isMobile ? 'flex-end' : 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.padding = isMobile ? '0' : '20px';
  overlay.style.boxSizing = 'border-box';
  overlay.style.fontFamily = 'sans-serif';

  overlay.onclick = (e) => {
    if (e.target === overlay) {
      userDismissedRedirectDialog = true;
      overlay.remove();
    }
  };

  const card = document.createElement('div');
  card.style.position = 'relative';
  card.style.backgroundColor = '#252525';
  card.style.borderRadius = isMobile ? '20px 20px 0 0' : '16px';
  card.style.padding = isMobile ? '16px 20px 28px 20px' : '30px 24px 22px 24px';
  card.style.maxWidth = isMobile ? '100%' : '380px';
  card.style.width = isMobile ? '100%' : '90%';
  card.style.textAlign = 'center';
  card.style.boxShadow = isMobile ? '0 -4px 30px rgba(0, 0, 0, 0.8)' : '0 10px 40px rgba(0, 0, 0, 0.6)';
  card.style.boxSizing = 'border-box';
  card.style.display = 'flex';
  card.style.flexDirection = 'column';
  card.style.alignItems = 'center';
  card.style.color = 'white';
  if (isMobile) {
    card.style.animation = 'ttSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
    const dragHandle = document.createElement('div');
    dragHandle.style.width = "40px";
    dragHandle.style.height = "4px";
    dragHandle.style.borderRadius = "2px";
    dragHandle.style.backgroundColor = "rgba(255, 255, 255, 0.28)";
    dragHandle.style.margin = "0 auto 12px auto";
    card.appendChild(dragHandle);
  }

  // Botón circular de cerrar (X) en esquina superior derecha
  const btnClose = document.createElement('button');
  btnClose.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>`;
  btnClose.style.position = 'absolute';
  btnClose.style.top = '12px';
  btnClose.style.right = '12px';
  btnClose.style.width = '36px';
  btnClose.style.height = '36px';
  btnClose.style.display = 'flex';
  btnClose.style.alignItems = 'center';
  btnClose.style.justifyContent = 'center';
  btnClose.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
  btnClose.style.borderRadius = '50%';
  btnClose.style.border = 'none';
  btnClose.style.color = '#ffffff';
  btnClose.style.cursor = 'pointer';
  btnClose.style.zIndex = '10';
  btnClose.style.transition = 'background-color 0.2s, transform 0.2s';
  btnClose.addEventListener('mouseenter', () => {
    btnClose.style.backgroundColor = 'rgba(254, 44, 85, 0.9)';
    btnClose.style.transform = 'scale(1.1)';
  });
  btnClose.addEventListener('mouseleave', () => {
    btnClose.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
    btnClose.style.transform = 'scale(1)';
  });
  btnClose.onclick = () => {
    userDismissedRedirectDialog = true;
    overlay.remove();
  };
  card.appendChild(btnClose);

  const iconImg = document.createElement('img');
  iconImg.src = browser.runtime.getURL('icons/icon-128.png');
  iconImg.style.width = '64px';
  iconImg.style.height = '64px';
  iconImg.style.borderRadius = '16px';
  iconImg.style.marginBottom = '16px';
  iconImg.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
  iconImg.style.objectFit = 'contain';
  card.appendChild(iconImg);

  const title = document.createElement('h3');
  title.innerText = t("redirectQuestion");
  title.style.color = '#ffffff';
  title.style.fontSize = '19px';
  title.style.fontWeight = '700';
  title.style.margin = '0 0 8px 0';
  card.appendChild(title);

  const desc = document.createElement('p');
  desc.innerText = t("redirectSubtitle");
  desc.style.color = 'rgba(255, 255, 255, 0.7)';
  desc.style.fontSize = '14px';
  desc.style.lineHeight = '1.45';
  desc.style.margin = '0 0 20px 0';
  card.appendChild(desc);

  const btnGo = document.createElement('button');
  btnGo.style.width = '100%';
  btnGo.style.setProperty('background-color', '#FE004F', 'important');
  btnGo.style.setProperty('background', '#FE004F', 'important');
  btnGo.style.setProperty('color', '#ffffff', 'important');
  btnGo.style.border = 'none';
  btnGo.style.borderRadius = '10px';
  btnGo.style.padding = '12px 20px';
  btnGo.style.fontSize = '15px';
  btnGo.style.fontWeight = 'bold';
  btnGo.style.cursor = 'pointer';
  btnGo.style.display = 'flex';
  btnGo.style.alignItems = 'center';
  btnGo.style.justifyContent = 'center';
  btnGo.style.gap = '8px';
  btnGo.style.boxShadow = '0 4px 18px rgba(254, 0, 79, 0.45)';
  btnGo.style.transition = 'transform 0.15s, background-color 0.15s';
  btnGo.addEventListener('mouseenter', () => {
    btnGo.style.setProperty('background-color', '#ff1a63', 'important');
    btnGo.style.setProperty('background', '#ff1a63', 'important');
    btnGo.style.transform = 'scale(1.02)';
  });
  btnGo.addEventListener('mouseleave', () => {
    btnGo.style.setProperty('background-color', '#FE004F', 'important');
    btnGo.style.setProperty('background', '#FE004F', 'important');
    btnGo.style.transform = 'scale(1)';
  });
  btnGo.innerHTML = `<span>${t("goToMessages")}</span>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>`;
  btnGo.onclick = () => {
    window.location.href = 'https://www.tiktok.com/messages';
  };
  card.appendChild(btnGo);

  const btnDismiss = document.createElement('button');
  btnDismiss.innerText = t("notNow");
  btnDismiss.style.width = '100%';
  btnDismiss.style.backgroundColor = 'transparent';
  btnDismiss.style.color = 'rgba(255, 255, 255, 0.55)';
  btnDismiss.style.border = 'none';
  btnDismiss.style.borderRadius = '8px';
  btnDismiss.style.padding = '10px 14px';
  btnDismiss.style.fontSize = '13px';
  btnDismiss.style.fontWeight = '500';
  btnDismiss.style.cursor = 'pointer';
  btnDismiss.style.marginTop = '6px';
  btnDismiss.onclick = () => {
    userDismissedRedirectDialog = true;
    overlay.remove();
  };
  card.appendChild(btnDismiss);

  overlay.appendChild(card);
  document.body.appendChild(overlay);
};

// Limpieza completa del modo móvil al volver al tamaño de PC
const cleanupMobileEnhancements = () => {
  const styleEl = document.getElementById('tt-mobile-enhancement-styles');
  if (styleEl) {
    styleEl.remove();
  }

  document.body.classList.remove('tt-chat-active');
  userClosedChatMobile = false;

  const btnBackChat = document.querySelector('.btn-mobile-back-to-list');
  if (btnBackChat) {
    btnBackChat.remove();
  }

  const btnHome = document.getElementById('tiktok-stickers-back-home-btn');
  if (btnHome) {
    btnHome.remove();
  }

  const meta = document.querySelector('meta[data-forced-desktop="true"]');
  if (meta) {
    meta.remove();
  }
};

// Sincronización dinámica según tamaño de pantalla / dispositivo
const syncResponsiveMode = () => {
  ensureGlobalMessagesLayoutStyles();
  syncHeaderAndConversationCards();
  if (isMobileDevice()) {
    enforceDesktopViewport();
    setupMobileEnhancements();
    checkAndShowMessagesRedirectDialog();
    updateMobileLayout();
  } else {
    cleanupMobileEnhancements();
  }
};

ensureGlobalMessagesLayoutStyles();
syncHeaderAndConversationCards();
syncResponsiveMode();
setTimeout(syncResponsiveMode, 300);
setTimeout(syncResponsiveMode, 800);
setTimeout(syncResponsiveMode, 1800);

if (typeof window !== 'undefined') {
  window.addEventListener('resize', syncResponsiveMode);
}

let isProcessing = false;
const observer = new MutationObserver(() => {
  ensureGlobalMessagesLayoutStyles();
  syncHeaderAndConversationCards();
  if (isMobileDevice()) {
    enforceDesktopViewport();
    setupMobileEnhancements();
    checkAndShowMessagesRedirectDialog();
    updateMobileLayout();
  } else {
    if (document.getElementById('tt-mobile-enhancement-styles') || document.body.classList.contains('tt-chat-active')) {
      cleanupMobileEnhancements();
    }
  }

  if (isProcessing) return;
  isProcessing = true;
  
  setTimeout(() => {
    ensureGlobalMessagesLayoutStyles();
    syncHeaderAndConversationCards();
    addDownloadAllButton();
    addIndividualDownloadButtons();
    addSettingsButton();
    isProcessing = false;
  }, 500);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
