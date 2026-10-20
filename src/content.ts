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
    chatFullyScanned: "Up to date",
    chatFullyScannedTooltip: "Chat history is fully scanned. Click to check for newer stickers.",
    viewStickers: "View stickers ({count})",
    viewStickersNoCount: "View stickers",
    viewStickersTitle: "TikTok Stickers",
    groupByDate: "Group by date",
    flatView: "Grid view",
    today: "Today",
    yesterday: "Yesterday",
    earlierHistory: "Earlier history",
    downloadSeqBtn: "Download ({count})",
    downloadZipBtn: "Download ZIP ({count})",
    downloadSeqTooltip: "Download selected stickers one by one",
    downloadZipTooltip: "Compress and download all selected stickers in a single ZIP",
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
    scanChat: "Analizar chat",
    scanningProgress: "Analizando ({count})...",
    scanFinished: "¡Análisis terminado! Se encontraron {count} stickers.",
    stopScan: "Detener",
    chatFullyScanned: "Al día",
    chatFullyScannedTooltip: "Historial completamente analizado. Clic para buscar nuevos stickers.",
    viewStickers: "Ver stickers ({count})",
    viewStickersNoCount: "Ver stickers",
    viewStickersTitle: "Stickers de TikTok",
    groupByDate: "Separar por fecha",
    flatView: "Vista cuadrícula",
    today: "Hoy",
    yesterday: "Ayer",
    earlierHistory: "Historial anterior",
    downloadSeqBtn: "Descargar ({count})",
    downloadZipBtn: "Descargar ZIP ({count})",
    downloadSeqTooltip: "Descargar los stickers seleccionados uno por uno",
    downloadZipTooltip: "Comprimir y descargar todos los stickers seleccionados en un archivo ZIP",
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

// Helper para detectar si estamos en un dispositivo móvil (Firefox Android, Chrome Android/iOS o pantalla táctil)
const isMobileDevice = (): boolean => {
  const ua = navigator.userAgent || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  const hasCoarsePointer = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false;
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 768;
  return isMobileUA || (hasCoarsePointer && isSmallScreen);
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

interface CustomConfirmResult {
  action: 'zip' | 'seq';
  urls: string[];
}

// Iconos vectoriales SVG limpios y nítidos
const svgDownload = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:8px;flex-shrink:0;">
  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
  <polyline points="7 10 12 15 17 10"></polyline>
  <line x1="12" y1="15" x2="12" y2="3"></line>
</svg>`;

const svgArchive = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:8px;flex-shrink:0;">
  <polyline points="21 8 21 21 3 21 3 8"></polyline>
  <rect x="1" y="3" width="22" height="5" rx="1"></rect>
  <line x1="10" y1="12" x2="14" y2="12"></line>
</svg>`;

const svgCalendar = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:6px;flex-shrink:0;">
  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
  <line x1="16" y1="2" x2="16" y2="6"></line>
  <line x1="8" y1="2" x2="8" y2="6"></line>
  <line x1="3" y1="10" x2="21" y2="10"></line>
</svg>`;

const svgGrid = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:6px;flex-shrink:0;">
  <rect x="3" y="3" width="7" height="7"></rect>
  <rect x="14" y="3" width="7" height="7"></rect>
  <rect x="14" y="14" width="7" height="7"></rect>
  <rect x="3" y="14" width="7" height="7"></rect>
</svg>`;

// Helper para dar formato legible a la fecha de un sticker
const formatStickerDate = (timeStr?: string, timestamp?: number): string => {
  const lang = getLang();
  if (timeStr && timeStr.trim()) {
    const cleaned = timeStr.trim();
    if (/^(today|hoy)/i.test(cleaned)) return t("today");
    if (/^(yesterday|ayer)/i.test(cleaned)) return t("yesterday");
    return cleaned;
  }
  if (timestamp && timestamp > 0) {
    const d = new Date(timestamp);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return t("today");
    const yest = new Date();
    yest.setDate(now.getDate() - 1);
    if (d.toDateString() === yest.toDateString()) return t("yesterday");

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return d.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', options);
  }
  return t("earlierHistory");
};

// Función para mostrar el diálogo modal con vista amplia en PC, selector de fechas y botones limpios
const showCustomConfirm = async (
  rawNewStickers: string[], 
  rawOldStickers: string[], 
  convId: string
): Promise<CustomConfirmResult | null> => {
  const newStickers = deduplicateStickerUrls(rawNewStickers);
  const oldStickers = deduplicateStickerUrls(rawOldStickers);

  // Cargamos el estado para consultar la fecha de cada sticker
  const scanState = loadConversationScanState(convId);
  const urlToDateMap = new Map<string, string>();
  for (const s of scanState.stickers) {
    const dateLabel = formatStickerDate(s.time, s.discoveredAt);
    urlToDateMap.set(s.url, dateLabel);
    urlToDateMap.set(s.id, dateLabel);
  }

  return new Promise((resolve) => {
    const isMobile = isMobileDevice();
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

    // Botón X para cerrar
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
    
    const btnSeq = document.createElement("button");
    const btnZip = document.createElement("button");

    const updateActionButtons = () => {
      const count = selectedUrls.size;
      btnSeq.innerHTML = `${svgDownload}<span>${t("downloadSeqBtn", { count })}</span>`;
      btnZip.innerHTML = `${svgArchive}<span>${t("downloadZipBtn", { count })}</span>`;
      const isDisabled = count === 0;
      btnSeq.disabled = isDisabled;
      btnZip.disabled = isDisabled;
      btnSeq.style.opacity = isDisabled ? "0.4" : "1";
      btnZip.style.opacity = isDisabled ? "0.4" : "1";
      btnSeq.style.cursor = isDisabled ? "not-allowed" : "pointer";
      btnZip.style.cursor = isDisabled ? "not-allowed" : "pointer";
    };

    // Estado global de la vista: cuadrícula normal o separada por fecha
    let isDateGrouped = false;
    let refreshCurrentTab: () => void = () => {};

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
        return { section, refresh: () => {} };
      }

      // Barra de controles superiores: Seleccionar todos (izq) y Separar por fecha (der)
      const sectionHeader = document.createElement("div");
      sectionHeader.style.display = "flex";
      sectionHeader.style.justifyContent = "space-between";
      sectionHeader.style.alignItems = "center";
      sectionHeader.style.marginBottom = isMobile ? s(10) : "14px";
      sectionHeader.style.flexWrap = "wrap";
      sectionHeader.style.gap = "8px";

      const btnToggle = document.createElement("button");
      btnToggle.style.padding = isMobile ? `${s(6)} ${s(12)}` : "6px 14px";
      btnToggle.style.borderRadius = isMobile ? s(6) : "6px";
      btnToggle.style.cursor = "pointer";
      btnToggle.style.fontSize = isMobile ? s(12) : "13px";
      btnToggle.style.fontWeight = "bold";
      btnToggle.style.transition = "all 0.2s";

      const isAllSelected = () => urls.every(u => selectedUrls.has(u));

      const updateToggleBtn = () => {
        const allSel = isAllSelected();
        btnToggle.innerText = allSel ? t("cancelSelection") : t("selectAll");
        btnToggle.style.border = allSel ? "1px solid #fe2c55" : "1px solid #666";
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

      // Botón para alternar entre vista cuadrícula y vista agrupada por fecha
      const btnDateToggle = document.createElement("button");
      btnDateToggle.style.padding = isMobile ? `${s(6)} ${s(12)}` : "6px 14px";
      btnDateToggle.style.borderRadius = isMobile ? s(6) : "6px";
      btnDateToggle.style.cursor = "pointer";
      btnDateToggle.style.fontSize = isMobile ? s(12) : "13px";
      btnDateToggle.style.fontWeight = "bold";
      btnDateToggle.style.transition = "all 0.2s";
      btnDateToggle.style.display = "inline-flex";
      btnDateToggle.style.alignItems = "center";
      btnDateToggle.style.justifyContent = "center";

      const updateDateToggleVisual = () => {
        if (isDateGrouped) {
          btnDateToggle.innerHTML = `${svgGrid}<span>${t("flatView")}</span>`;
          btnDateToggle.style.border = "1px solid #fe2c55";
          btnDateToggle.style.color = "#fe2c55";
          btnDateToggle.style.backgroundColor = "rgba(254, 44, 85, 0.15)";
        } else {
          btnDateToggle.innerHTML = `${svgCalendar}<span>${t("groupByDate")}</span>`;
          btnDateToggle.style.border = "1px solid #666";
          btnDateToggle.style.color = "#ccc";
          btnDateToggle.style.backgroundColor = "transparent";
        }
      };

      updateDateToggleVisual();

      btnDateToggle.onclick = () => {
        isDateGrouped = !isDateGrouped;
        refreshCurrentTab();
      };

      sectionHeader.appendChild(btnToggle);
      sectionHeader.appendChild(btnDateToggle);
      section.appendChild(sectionHeader);

      const gridContainer = document.createElement("div");
      section.appendChild(gridContainer);

      const renderStickerItem = (url: string, parentGrid: HTMLElement) => {
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

        const isCurrentlySelected = selectedUrls.has(url);
        if (!isCurrentlySelected) {
          img.style.opacity = "0.3";
          img.style.transform = "scale(0.9)";
          img.style.filter = "grayscale(100%)";
        }

        container.appendChild(img);
        parentGrid.appendChild(container);
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
      };

      const renderGridContent = () => {
        gridContainer.innerHTML = "";
        updateDateToggleVisual();

        if (!isDateGrouped) {
          // Vista continua en cuadrícula espaciosa
          const grid = document.createElement("div");
          grid.style.display = "grid";
          grid.style.gridTemplateColumns = isMobile 
            ? `repeat(auto-fill, minmax(${s(70)}, 1fr))` 
            : "repeat(auto-fill, minmax(88px, 1fr))";
          grid.style.gap = isMobile ? s(8) : "12px";

          urls.forEach(url => renderStickerItem(url, grid));
          gridContainer.appendChild(grid);
        } else {
          // Vista agrupada por fecha
          const groups = new Map<string, string[]>();
          urls.forEach(url => {
            const dateLabel = urlToDateMap.get(url) || urlToDateMap.get(getStickerId(url)) || t("earlierHistory");
            if (!groups.has(dateLabel)) {
              groups.set(dateLabel, []);
            }
            groups.get(dateLabel)!.push(url);
          });

          groups.forEach((groupUrls, dateLabel) => {
            const groupWrapper = document.createElement("div");
            groupWrapper.style.marginBottom = "20px";

            // Encabezado de fecha estilizado con cápsula elegante
            const dateHeader = document.createElement("div");
            dateHeader.style.display = "flex";
            dateHeader.style.alignItems = "center";
            dateHeader.style.gap = "10px";
            dateHeader.style.margin = "14px 0 10px 0";

            const lineLeft = document.createElement("div");
            lineLeft.style.height = "1px";
            lineLeft.style.flex = "1";
            lineLeft.style.backgroundColor = "rgba(255, 255, 255, 0.12)";

            const badge = document.createElement("div");
            badge.style.display = "inline-flex";
            badge.style.alignItems = "center";
            badge.style.backgroundColor = "#1f1f1f";
            badge.style.border = "1px solid rgba(254, 44, 85, 0.35)";
            badge.style.color = "#fe2c55";
            badge.style.padding = "4px 12px";
            badge.style.borderRadius = "14px";
            badge.style.fontSize = "12px";
            badge.style.fontWeight = "bold";
            badge.innerHTML = `${svgCalendar} <span>${dateLabel} (${groupUrls.length})</span>`;

            const lineRight = document.createElement("div");
            lineRight.style.height = "1px";
            lineRight.style.flex = "1";
            lineRight.style.backgroundColor = "rgba(255, 255, 255, 0.12)";

            dateHeader.appendChild(lineLeft);
            dateHeader.appendChild(badge);
            dateHeader.appendChild(lineRight);
            groupWrapper.appendChild(dateHeader);

            const grid = document.createElement("div");
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = isMobile 
              ? `repeat(auto-fill, minmax(${s(70)}, 1fr))` 
              : "repeat(auto-fill, minmax(88px, 1fr))";
            grid.style.gap = isMobile ? s(8) : "12px";

            groupUrls.forEach(url => renderStickerItem(url, grid));
            groupWrapper.appendChild(grid);
            gridContainer.appendChild(groupWrapper);
          });
        }
      };

      renderGridContent();

      return { section, refresh: renderGridContent };
    };

    const compNew = createSectionWithGrid(newStickers, true, t("noNewStickers"));
    const compOld = createSectionWithGrid(oldStickers, false, t("noOldStickers"));
    compOld.section.style.display = "none";

    let currentTabIsNew = true;
    refreshCurrentTab = () => {
      if (currentTabIsNew) {
        compNew.refresh();
      } else {
        compOld.refresh();
      }
    };
    
    const setActiveTab = (isNew: boolean) => {
      currentTabIsNew = isNew;
      tabNew.style.color = isNew ? "#fe2c55" : "#888";
      tabNew.style.borderBottom = isNew ? `2px solid #fe2c55` : `2px solid transparent`;
      
      tabOld.style.color = !isNew ? "#fe2c55" : "#888";
      tabOld.style.borderBottom = !isNew ? `2px solid #fe2c55` : `2px solid transparent`;
      
      compNew.section.style.display = isNew ? "flex" : "none";
      compOld.section.style.display = !isNew ? "flex" : "none";
      refreshCurrentTab();
    };
    
    tabNew.onclick = () => setActiveTab(true);
    tabOld.onclick = () => setActiveTab(false);
    
    setActiveTab(true);

    scrollContainer.appendChild(compNew.section);
    scrollContainer.appendChild(compOld.section);
    modal.appendChild(scrollContainer);

    // Fila superior con los 2 botones de descarga lado a lado (50% y 50%)
    const downloadBtnsRow = document.createElement("div");
    downloadBtnsRow.style.display = "flex";
    downloadBtnsRow.style.flexDirection = "row";
    downloadBtnsRow.style.alignItems = "center";
    downloadBtnsRow.style.gap = isMobile ? s(10) : "12px";
    downloadBtnsRow.style.marginTop = isMobile ? s(12) : "14px";
    downloadBtnsRow.style.width = "100%";

    // 1. Botón Descarga Secuencial (uno por uno) con SVG
    btnSeq.style.padding = isMobile ? s(12) : "12px 18px";
    btnSeq.style.borderRadius = isMobile ? s(8) : "8px";
    btnSeq.style.border = "1.5px solid #fe2c55";
    btnSeq.style.backgroundColor = "transparent";
    btnSeq.style.color = "#fe2c55";
    btnSeq.style.cursor = "pointer";
    btnSeq.style.fontWeight = "bold";
    btnSeq.style.fontSize = isMobile ? s(14) : "14px";
    btnSeq.style.flex = "1";
    btnSeq.style.display = "inline-flex";
    btnSeq.style.alignItems = "center";
    btnSeq.style.justifyContent = "center";
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

    // 2. Botón Descarga ZIP con SVG
    btnZip.style.padding = isMobile ? s(12) : "12px 18px";
    btnZip.style.borderRadius = isMobile ? s(8) : "8px";
    btnZip.style.border = "1.5px solid #fe2c55";
    btnZip.style.backgroundColor = "#fe2c55";
    btnZip.style.color = "#ffffff";
    btnZip.style.cursor = "pointer";
    btnZip.style.fontWeight = "bold";
    btnZip.style.fontSize = isMobile ? s(14) : "14px";
    btnZip.style.flex = "1";
    btnZip.style.display = "inline-flex";
    btnZip.style.alignItems = "center";
    btnZip.style.justifyContent = "center";
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

    downloadBtnsRow.appendChild(btnSeq);
    downloadBtnsRow.appendChild(btnZip);
    modal.appendChild(downloadBtnsRow);

    // 3. Botón Cancelar abajo, en su propia fila
    const btnCancel = document.createElement("button");
    btnCancel.innerText = t("cancel");
    btnCancel.style.width = "100%";
    btnCancel.style.marginTop = isMobile ? s(8) : "10px";
    btnCancel.style.padding = isMobile ? s(10) : "10px 18px";
    btnCancel.style.borderRadius = isMobile ? s(8) : "8px";
    btnCancel.style.border = "1px solid rgba(255, 255, 255, 0.12)";
    btnCancel.style.backgroundColor = "#333";
    btnCancel.style.color = "#bbb";
    btnCancel.style.cursor = "pointer";
    btnCancel.style.fontWeight = "bold";
    btnCancel.style.fontSize = isMobile ? s(13) : "14px";
    btnCancel.style.textAlign = "center";
    btnCancel.style.transition = "background-color 0.2s, color 0.2s, transform 0.2s";

    btnCancel.addEventListener("mouseenter", () => {
      btnCancel.style.backgroundColor = "#444";
      btnCancel.style.color = "#ffffff";
      btnCancel.style.transform = "scale(1.01)";
    });
    btnCancel.addEventListener("mouseleave", () => {
      btnCancel.style.backgroundColor = "#333";
      btnCancel.style.color = "#bbb";
      btnCancel.style.transform = "scale(1)";
    });

    updateActionButtons();

    btnCancel.onclick = () => {
      document.body.removeChild(overlay);
      resolve(null);
    };

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

    modal.appendChild(btnCancel);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  });
};

const getDelay = () => {
  const stored = localStorage.getItem("tiktok-stickers-exporter-delay");
  return stored ? parseFloat(stored) : 1.5;
};

const showSettingsModal = () => {
  const scaleFactor = Math.max(1, window.innerWidth / window.screen.width);
  const s = (px: number) => (px * scaleFactor) + "px";

  const overlay = document.createElement("div");
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
  modal.style.borderRadius = s(16);
  modal.style.padding = s(24);
  modal.style.width = "85%";
  modal.style.maxWidth = s(380);
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.boxShadow = `0 ${s(10)} ${s(40)} rgba(0,0,0,0.6)`;
  modal.style.color = "white";
  modal.style.fontFamily = "sans-serif";
  modal.style.gap = s(16);

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
const getActiveConversationId = (): string => {
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

const loadConversationScanState = (convId: string): ConversationScanState => {
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
  let el: HTMLElement | null = img.parentElement;
  let depth = 0;
  while (el && el !== document.body && depth < 6) {
    if (!context.time) {
      const timeEl = el.querySelector('time, [class*="Time"], [class*="Date"], [data-e2e*="time"]');
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

  // Si no se encontró fecha dentro del bubble, buscar hacia atrás divisores de fecha en el chat
  if (!context.time) {
    let msgItem = img.closest('div[class*="Message"], div[class*="Chat"], div[data-e2e*="chat"]') as HTMLElement | null;
    if (!msgItem) msgItem = img.parentElement;
    let prev = msgItem ? msgItem.previousElementSibling as HTMLElement | null : null;
    let steps = 0;
    while (prev && steps < 15) {
      const txt = prev.textContent ? prev.textContent.trim() : "";
      if (txt.length > 0 && txt.length < 35) {
        const isDivider = prev.matches('[class*="Divider"], [class*="Time"], [class*="Date"]') ||
          /^(today|yesterday|hoy|ayer|ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic|jan|aug)/i.test(txt) ||
          /\d{1,2}:\d{2}/.test(txt);
        if (isDivider) {
          context.time = txt;
          break;
        }
      }
      prev = prev.previousElementSibling as HTMLElement | null;
      steps++;
    }
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

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
  overlay.style.zIndex = "9999999";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";

  const modal = document.createElement("div");
  modal.style.position = "relative";
  modal.style.backgroundColor = "#252525";
  modal.style.borderRadius = isMobile ? s(16) : "16px";
  modal.style.padding = isMobile ? `${s(30)} ${s(26)} ${s(26)} ${s(26)}` : "30px 26px 26px 26px";
  modal.style.width = isMobile ? "85%" : "440px";
  modal.style.maxWidth = isMobile ? s(460) : "480px";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.alignItems = "center";
  modal.style.boxShadow = `0 ${s(10)} ${s(40)} rgba(0,0,0,0.6)`;
  modal.style.color = "white";
  modal.style.fontFamily = "sans-serif";
  modal.style.gap = isMobile ? s(16) : "16px";

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

let isChatScanning = false;

// Función para inyectar los botones de escaneo y "Ver Stickers" en el Header del chat
const addDownloadAllButton = () => {
  const headerContainer = document.querySelector('div[class*="--DivChatHeader"]') as HTMLElement;
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
    btnContainer.style.gap = "8px";
    btnContainer.style.marginLeft = "auto";
    btnContainer.style.marginRight = "15px";
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

    // Botón único "Ver stickers" sin emoji
    const viewText = newStickerCount > 0 
      ? t("viewStickers", { count: newStickerCount }) 
      : t("viewStickersNoCount");
    const btnView = createTextBtn(viewText, true);
    btnView.className = "btn-view";
    btnView.title = t("viewStickersTitle");

    // Botón de escaneo automático de chat
    const isFullyExplored = state.hasReachedBeginning;
    const btnScan = createTextBtn(isFullyExplored ? "✓ " + t("chatFullyScanned") : "🔍 " + t("scanChat"), false);
    btnScan.className = "btn-scan";
    btnScan.style.borderColor = isFullyExplored ? "#2ed573" : "#20d5ec";
    btnScan.style.color = isFullyExplored ? "#2ed573" : "#20d5ec";
    btnScan.title = isFullyExplored ? t("chatFullyScannedTooltip") : t("scanChat");

    btnScan.addEventListener("mouseenter", () => {
      btnScan.style.transform = "scale(1.05)";
      if (!isChatScanning) {
        btnScan.style.backgroundColor = isFullyExplored ? "rgba(46, 213, 115, 0.12)" : "rgba(32, 213, 236, 0.12)";
      }
    });
    btnScan.addEventListener("mouseleave", () => {
      btnScan.style.transform = "scale(1)";
      if (!isChatScanning) btnScan.style.backgroundColor = "transparent";
    });

    const scanChatLogic = async () => {
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

      const knownIdsBeforeScan = new Set(scanState.stickers.map(s => s.id));
      const wasFullyScanned = scanState.hasReachedBeginning;

      const initialImgs = Array.from(document.querySelectorAll('img[alt="sticker"]')) as HTMLImageElement[];
      if (initialImgs.length > 0) {
        scanState.newestKnownStickerId = getStickerId(initialImgs[initialImgs.length - 1].src);
        saveConversationScanState(scanState);
      }

      isChatScanning = true;
      btnScan.style.backgroundColor = "rgba(32, 213, 236, 0.25)";
      btnScan.style.borderColor = "#20d5ec";
      btnScan.style.color = "#20d5ec";
      btnScan.innerText = "⏹ " + t("stopScan");

      let lastCount = 0;
      let unchangedTries = 0;
      const maxUnchanged = 6;
      let lastScrollHeight = container.scrollHeight;

      try {
        while (isChatScanning) {
          if (getActiveConversationId() !== scanConvId) {
            break;
          }

          scanState = registerStickersFromDOM(scanConvId);
          const totalDiscovered = scanState.stickers.length;
          btnScan.innerText = `⏹ ${t("stopScan")} (${totalDiscovered})`;

          const freshNewCount = scanState.stickers.filter(s => !isDownloaded(s.url)).length;
          const freshViewText = freshNewCount > 0 
            ? t("viewStickers", { count: freshNewCount }) 
            : t("viewStickersNoCount");
          btnView.innerText = freshViewText;

          // Checkpoint inteligente: si ya estaba completado, detener al tocar el historial conocido
          if (wasFullyScanned && knownIdsBeforeScan.size > 0) {
            const currentImgs = Array.from(document.querySelectorAll('img[alt="sticker"]')) as HTMLImageElement[];
            const hitCheckpoint = currentImgs.some(img => knownIdsBeforeScan.has(getStickerId(img.src)));
            if (hitCheckpoint) {
              console.log("[TiktokStickersExporter] Checkpoint histórico alcanzado. Deteniendo escaneo anticipadamente.");
              break;
            }
          }

          container.scrollTop = 0;
          container.dispatchEvent(new Event('scroll', { bubbles: true }));

          if (container.scrollTop === 0 && (container.scrollHeight === lastScrollHeight || totalDiscovered === lastCount)) {
            unchangedTries++;
            if (unchangedTries >= maxUnchanged) {
              scanState.hasReachedBeginning = true;
              scanState.lastScanTimestamp = Date.now();
              saveConversationScanState(scanState);
              console.log("[TiktokStickersExporter] Se alcanzó el inicio de la historia del chat.");
              break;
            }
          } else {
            unchangedTries = 0;
            lastScrollHeight = container.scrollHeight;
            lastCount = totalDiscovered;
          }

          await new Promise(r => setTimeout(r, 250));
        }
      } finally {
        isChatScanning = false;
        btnScan.style.backgroundColor = "transparent";

        scanState = registerStickersFromDOM(scanConvId);
        scanState.lastScanTimestamp = Date.now();
        saveConversationScanState(scanState);

        addDownloadAllButton();
        addIndividualDownloadButtons();

        if (scanState.stickers.length > 0) {
          openStickersModal();
        } else {
          alert(t("noStickersOnScreen"));
        }
      }
    };

    btnScan.addEventListener("click", scanChatLogic);
    btnView.addEventListener("click", openStickersModal);

    btnContainer.appendChild(btnScan);
    btnContainer.appendChild(btnView);
    
    if (window.getComputedStyle(headerContainer).display !== "flex") {
      headerContainer.style.display = "flex";
      headerContainer.style.alignItems = "center";
    }
    headerContainer.appendChild(btnContainer);
  } else {
    // Si ya existe el contenedor en pantalla, actualizar el botón "Ver stickers" y el botón de escaneo
    const btnView = btnContainer.querySelector(".btn-view") as HTMLButtonElement;
    if (btnView) {
      const viewText = newStickerCount > 0 
        ? t("viewStickers", { count: newStickerCount }) 
        : t("viewStickersNoCount");
      btnView.innerText = viewText;
    }
    const btnScan = btnContainer.querySelector(".btn-scan") as HTMLButtonElement;
    if (btnScan && !isChatScanning) {
      const isUpToDate = state.hasReachedBeginning;
      btnScan.innerText = isUpToDate ? "✓ " + t("chatFullyScanned") : "🔍 " + t("scanChat");
      btnScan.title = isUpToDate ? t("chatFullyScannedTooltip") : t("scanChat");
      btnScan.style.borderColor = isUpToDate ? "#2ed573" : "#20d5ec";
      btnScan.style.color = isUpToDate ? "#2ed573" : "#20d5ec";
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

const addSettingsButton = () => {
  if (document.getElementById('tiktok-stickers-exporter-settings-btn')) return;

  const h2s = Array.from(document.querySelectorAll('h2'));
  const messagesH2 = h2s.find(h2 => h2.innerText.includes("Messages") || h2.innerText.includes("Mensajes") || (h2.className && h2.className.includes("H2Semibold")));
  
  if (!messagesH2) return;
  const targetContainer = messagesH2.parentElement;
  if (!targetContainer) return;

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
  
  targetContainer.style.display = "flex";
  targetContainer.style.alignItems = "center";
  targetContainer.style.justifyContent = "space-between";
  targetContainer.appendChild(btn);
};

let isProcessing = false;
const observer = new MutationObserver(() => {
  if (isProcessing) return;
  isProcessing = true;
  
  setTimeout(() => {
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
