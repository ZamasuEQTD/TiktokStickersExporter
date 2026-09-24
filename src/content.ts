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
    noStickersOnScreen: "No stickers on screen!",
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
    completedSeq: "Stickers downloaded successfully."
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
    noStickersOnScreen: "¡No hay stickers en pantalla!",
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
    completedSeq: "Stickers descargados con éxito."
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

// Función para mostrar un diálogo modal personalizado con vista previa
const showCustomConfirm = async (title: string, newStickers: string[], oldStickers: string[]): Promise<string[] | null> => {

  return new Promise((resolve) => {
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
    modal.style.padding = s(20);
    modal.style.width = "85%";
    modal.style.maxWidth = s(450);
    modal.style.maxHeight = "85vh";
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
    btnX.onclick = () => {
      document.body.removeChild(overlay);
      resolve(null);
    };
    modal.appendChild(btnX);
    
    const header = document.createElement("h2");
    header.innerText = title;
    header.style.marginTop = "0";
    header.style.textAlign = "center";
    header.style.fontSize = s(18);
    header.style.marginBottom = s(15);
    modal.appendChild(header);

    const tabsContainer = document.createElement("div");
    tabsContainer.style.display = "flex";
    tabsContainer.style.borderBottom = "1px solid #444";
    tabsContainer.style.marginBottom = s(15);

    const tabNew = document.createElement("div");
    tabNew.innerText = t("newStickers", { count: newStickers.length });
    tabNew.style.flex = "1";
    tabNew.style.textAlign = "center";
    tabNew.style.padding = s(10);
    tabNew.style.cursor = "pointer";
    tabNew.style.fontWeight = "bold";
    tabNew.style.fontSize = s(14);
    tabNew.style.transition = "color 0.2s, border-bottom 0.2s";

    const tabOld = document.createElement("div");
    tabOld.innerText = t("oldStickers", { count: oldStickers.length });
    tabOld.style.flex = "1";
    tabOld.style.textAlign = "center";
    tabOld.style.padding = s(10);
    tabOld.style.cursor = "pointer";
    tabOld.style.fontWeight = "bold";
    tabOld.style.fontSize = s(14);
    tabOld.style.transition = "color 0.2s, border-bottom 0.2s";

    tabsContainer.appendChild(tabNew);
    tabsContainer.appendChild(tabOld);
    modal.appendChild(tabsContainer);

    const scrollContainer = document.createElement("div");
    scrollContainer.style.overflowY = "auto";
    scrollContainer.style.flexGrow = "1";
    scrollContainer.style.marginBottom = s(15);
    scrollContainer.style.scrollbarWidth = "thin";
    scrollContainer.style.scrollbarColor = "#fe2c55 #252525";
    scrollContainer.style.display = "flex";
    scrollContainer.style.flexDirection = "column";
    
    const selectedUrls = new Set<string>([...newStickers]);
    const imageElements = new Map<string, HTMLImageElement>();
    
    const btnConfirm = document.createElement("button");
    const updateConfirmButton = () => {
      btnConfirm.innerText = t("downloadCount", { count: selectedUrls.size });
      btnConfirm.disabled = selectedUrls.size === 0;
      btnConfirm.style.opacity = btnConfirm.disabled ? "0.5" : "1";
    };
    
    const createGrid = (urls: string[], initiallySelected: boolean) => {
      const grid = document.createElement("div");
      grid.style.display = "grid";
      grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${s(70)}, 1fr))`;
      grid.style.gap = s(8);
      
      urls.forEach(url => {
        const container = document.createElement("div");
        container.style.position = "relative";
        container.style.cursor = "pointer";
        
        const img = document.createElement("img");
        img.src = url;
        img.style.width = "100%";
        img.style.aspectRatio = "1/1";
        img.style.objectFit = "cover";
        img.style.borderRadius = s(8);
        img.style.backgroundColor = "#111";
        img.style.transition = "all 0.2s";
        
        if (!initiallySelected) {
          img.style.opacity = "0.3";
          img.style.transform = "scale(0.9)";
          img.style.filter = "grayscale(100%)";
        }
        
        container.appendChild(img);
        grid.appendChild(container);
        imageElements.set(url, img);
        
        container.onclick = () => {
          if (selectedUrls.has(url)) {
            selectedUrls.delete(url);
            img.style.opacity = "0.3";
            img.style.transform = "scale(0.9)";
            img.style.filter = "grayscale(100%)";
          } else {
            selectedUrls.add(url);
            img.style.opacity = "1";
            img.style.transform = "scale(1)";
            img.style.filter = "none";
          }
          updateConfirmButton();
        };
      });
      return grid;
    };

    const contentNew = document.createElement("div");
    contentNew.style.display = "flex";
    contentNew.style.flexDirection = "column";
    
    if (newStickers.length > 0) {
      contentNew.appendChild(createGrid(newStickers, true));
    } else {
      const noNew = document.createElement("div");
      noNew.innerText = t("noNewStickers");
      noNew.style.textAlign = "center";
      noNew.style.color = "#888";
      noNew.style.fontSize = s(14);
      noNew.style.marginTop = s(20);
      contentNew.appendChild(noNew);
    }
    
    const contentOld = document.createElement("div");
    contentOld.style.display = "none";
    contentOld.style.flexDirection = "column";

    if (oldStickers.length > 0) {
      const oldHeader = document.createElement("div");
      oldHeader.style.display = "flex";
      oldHeader.style.justifyContent = "space-between";
      oldHeader.style.alignItems = "center";
      oldHeader.style.marginBottom = s(10);
      
      const btnToggleOld = document.createElement("button");
      btnToggleOld.innerText = t("selectAll");
      btnToggleOld.style.padding = `${s(4)} ${s(8)}`;
      btnToggleOld.style.borderRadius = s(6);
      btnToggleOld.style.border = "1px solid #888";
      btnToggleOld.style.backgroundColor = "transparent";
      btnToggleOld.style.color = "#888";
      btnToggleOld.style.cursor = "pointer";
      btnToggleOld.style.fontSize = s(12);
      
      oldHeader.appendChild(btnToggleOld);
      contentOld.appendChild(oldHeader);

      const oldGrid = createGrid(oldStickers, false);
      contentOld.appendChild(oldGrid);

      let allSelected = false;
      btnToggleOld.onclick = () => {
        allSelected = !allSelected;
        if (allSelected) {
          btnToggleOld.innerText = t("cancelSelection");
          btnToggleOld.style.border = "1px solid #fe2c55";
          btnToggleOld.style.color = "#fe2c55";
          
          oldStickers.forEach(url => {
            selectedUrls.add(url);
            const img = imageElements.get(url);
            if (img) {
              img.style.opacity = "1";
              img.style.transform = "scale(1)";
              img.style.filter = "none";
            }
          });
        } else {
          btnToggleOld.innerText = t("selectAll");
          btnToggleOld.style.border = "1px solid #888";
          btnToggleOld.style.color = "#888";
          
          oldStickers.forEach(url => {
            selectedUrls.delete(url);
            const img = imageElements.get(url);
            if (img) {
              img.style.opacity = "0.3";
              img.style.transform = "scale(0.9)";
              img.style.filter = "grayscale(100%)";
            }
          });
        }
        updateConfirmButton();
      };
    } else {
      const noOld = document.createElement("div");
      noOld.innerText = t("noOldStickers");
      noOld.style.textAlign = "center";
      noOld.style.color = "#888";
      noOld.style.fontSize = s(14);
      noOld.style.marginTop = s(20);
      contentOld.appendChild(noOld);
    }
    
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

    btnConfirm.style.flex = "1";
    btnConfirm.style.padding = s(12);
    btnConfirm.style.borderRadius = s(8);
    btnConfirm.style.border = "none";
    btnConfirm.style.backgroundColor = "#fe2c55";
    btnConfirm.style.color = "white";
    btnConfirm.style.cursor = "pointer";
    btnConfirm.style.fontWeight = "bold";
    btnConfirm.style.fontSize = s(15);
    updateConfirmButton();

    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = s(12);

    const btnCancel = document.createElement("button");
    btnCancel.innerText = t("cancel");
    btnCancel.style.flex = "1";
    btnCancel.style.padding = s(12);
    btnCancel.style.borderRadius = s(8);
    btnCancel.style.border = "none";
    btnCancel.style.backgroundColor = "#444";
    btnCancel.style.color = "white";
    btnCancel.style.cursor = "pointer";
    btnCancel.style.fontWeight = "bold";
    btnCancel.style.fontSize = s(15);

    btnCancel.onclick = () => { document.body.removeChild(overlay); resolve(null); };
    btnConfirm.onclick = () => { document.body.removeChild(overlay); resolve(Array.from(selectedUrls)); };

    btnContainer.appendChild(btnCancel);
    btnContainer.appendChild(btnConfirm);
    modal.appendChild(btnContainer);

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
  modal.style.backgroundColor = "#252525";
  modal.style.borderRadius = s(16);
  modal.style.padding = s(20);
  modal.style.width = "85%";
  modal.style.maxWidth = s(400);
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.boxShadow = `0 ${s(10)} ${s(40)} rgba(0,0,0,0.6)`;
  modal.style.color = "white";
  modal.style.fontFamily = "sans-serif";
  modal.style.gap = s(15);
  modal.style.maxHeight = "85vh";
  modal.style.overflowY = "auto";
  
  const header = document.createElement("h2");
  header.innerText = t("settings");
  header.style.marginTop = "0";
  header.style.textAlign = "center";
  header.style.fontSize = s(18);
  header.style.marginBottom = "0";
  modal.appendChild(header);

  // Language setting
  const langContainer = document.createElement("div");
  langContainer.style.display = "flex";
  langContainer.style.flexDirection = "column";
  langContainer.style.gap = s(5);
  
  const langLabel = document.createElement("label");
  langLabel.innerText = t("languageLabel");
  langLabel.style.fontSize = s(14);
  langLabel.style.color = "#ccc";
  
  const langInput = document.createElement("div");
  langInput.style.display = "flex";
  langInput.style.flexWrap = "wrap";
  langInput.style.gap = s(8);
  
  const langOptions = [
    { id: "auto", text: t("langAuto") },
    { id: "en", text: t("langEn") },
    { id: "es", text: t("langEs") }
  ];
  let storedLang = localStorage.getItem("tiktok-stickers-exporter-lang") || "auto";
  const langBtns: HTMLButtonElement[] = [];
  
  langOptions.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt.text;
    btn.style.padding = `${s(6)} ${s(12)}`;
    btn.style.borderRadius = s(8);
    btn.style.fontWeight = "bold";
    btn.style.fontSize = s(13);
    btn.style.cursor = "pointer";
    btn.style.transition = "all 0.2s";
    
    const isSelected = opt.id === storedLang;
    
    if (isSelected) {
      btn.style.backgroundColor = "#fe2c55";
      btn.style.border = "1px solid #fe2c55";
      btn.style.color = "white";
    } else {
      btn.style.backgroundColor = "transparent";
      btn.style.border = "1px solid #fe2c55";
      btn.style.color = "#fe2c55";
    }
    
    btn.onclick = () => {
      if (opt.id === "auto") {
        localStorage.removeItem("tiktok-stickers-exporter-lang");
      } else {
        localStorage.setItem("tiktok-stickers-exporter-lang", opt.id);
      }
      location.reload(); // Recargar para aplicar el nuevo idioma instantáneamente
    };
    
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.05)";
      if (opt.id !== storedLang) {
        btn.style.backgroundColor = "rgba(254, 44, 85, 0.1)";
      }
    });
    
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
      if (opt.id !== storedLang) {
        btn.style.backgroundColor = "transparent";
      }
    });
    
    langBtns.push(btn);
    langInput.appendChild(btn);
  });
  
  langContainer.appendChild(langLabel);
  langContainer.appendChild(langInput);
  modal.appendChild(langContainer);

  // Delay setting
  const delayContainer = document.createElement("div");
  delayContainer.style.display = "flex";
  delayContainer.style.flexDirection = "column";
  delayContainer.style.gap = s(5);
  
  const delayLabel = document.createElement("label");
  delayLabel.innerText = t("delayLabel");
  delayLabel.style.fontSize = s(14);
  delayLabel.style.color = "#ccc";
  
  const delayInput = document.createElement("div");
  delayInput.style.display = "flex";
  delayInput.style.flexWrap = "wrap";
  delayInput.style.gap = s(8);
  
  const options = ["0.5", "1.0", "1.5", "2.0", "3.0", "5.0"];
  let storedDelay = localStorage.getItem("tiktok-stickers-exporter-delay") || "1.5";
  const optionBtns: HTMLButtonElement[] = [];
  
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = `${opt}s`;
    btn.style.padding = `${s(6)} ${s(12)}`;
    btn.style.borderRadius = s(8);
    btn.style.fontWeight = "bold";
    btn.style.fontSize = s(13);
    btn.style.cursor = "pointer";
    btn.style.transition = "all 0.2s";
    
    const isSelected = parseFloat(opt) === parseFloat(storedDelay);
    
    if (isSelected) {
      btn.style.backgroundColor = "#fe2c55";
      btn.style.border = "1px solid #fe2c55";
      btn.style.color = "white";
    } else {
      btn.style.backgroundColor = "transparent";
      btn.style.border = "1px solid #fe2c55";
      btn.style.color = "#fe2c55";
    }
    
    btn.onclick = () => {
      localStorage.setItem("tiktok-stickers-exporter-delay", opt);
      storedDelay = opt;
      optionBtns.forEach(b => {
        if (b === btn) {
          b.style.backgroundColor = "#fe2c55";
          b.style.color = "white";
        } else {
          b.style.backgroundColor = "transparent";
          b.style.color = "#fe2c55";
        }
      });
    };
    
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.05)";
      if (parseFloat(opt) !== parseFloat(storedDelay)) {
        btn.style.backgroundColor = "rgba(254, 44, 85, 0.1)";
      }
    });
    
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
      if (parseFloat(opt) !== parseFloat(storedDelay)) {
        btn.style.backgroundColor = "transparent";
      }
    });
    
    optionBtns.push(btn);
    delayInput.appendChild(btn);
  });
  
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
        if (key.startsWith("tiktok-sticker-downloaded-")) {
          localStorage.removeItem(key);
        }
      });
      alert(t("historyCleared"));
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
  btnClose.style.fontSize = s(15);
  btnClose.style.marginTop = s(5);
  
  btnClose.onclick = () => { document.body.removeChild(overlay); };
  
  modal.appendChild(btnClose);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
};

// Función para inyectar los botones "Descargar Todos" en el Header del chat
const addDownloadAllButton = () => {
  // Ubicamos el contenedor del Header del Chat
  const headerContainer = document.querySelector('div[class*="--DivChatHeader"]') as HTMLElement;
  if (!headerContainer) return;

  const stickerImages = Array.from(document.querySelectorAll('img[alt="sticker"]')) as HTMLImageElement[];
  const newStickers = stickerImages.filter(img => !isDownloaded(img.src)).map(img => img.src);
  const oldStickers = stickerImages.filter(img => isDownloaded(img.src)).map(img => img.src);
  const newStickerCount = newStickers.length;

  let btnContainer = document.getElementById("tiktok-stickers-exporter-header-btns");
  
  if (!btnContainer) {
    btnContainer = document.createElement("div");
    btnContainer.id = "tiktok-stickers-exporter-header-btns";
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "8px";
    btnContainer.style.marginLeft = "auto"; // Empujar a la derecha
    btnContainer.style.marginRight = "15px";
    btnContainer.style.alignItems = "center";

    const createTextBtn = (text: string, isPrimary: boolean) => {
      const btn = document.createElement("button");
      btn.innerText = text;
      btn.style.cursor = "pointer";
      btn.style.padding = "6px 12px";
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

    const btnSeq = createTextBtn(t("downloadCount", { count: newStickerCount }), true);
    btnSeq.className = "btn-seq";
    btnSeq.title = t("download");
    
    const btnZip = createTextBtn(t("downloadZip"), false);
    btnZip.className = "btn-zip";
    
    interface ProgressModalController {
      update: (current: number, total: number) => void;
      setStatus: (statusText: string) => void;
      complete: (message: string) => void;
      close: () => void;
    }

    const showProgressModal = (title: string, total: number): ProgressModalController => {
      const scaleFactor = Math.max(1, window.innerWidth / window.screen.width);
      const s = (px: number) => (px * scaleFactor) + "px";

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
      modal.style.borderRadius = s(16);
      modal.style.padding = `${s(30)} ${s(26)} ${s(26)} ${s(26)}`;
      modal.style.width = "85%";
      modal.style.maxWidth = s(460);
      modal.style.display = "flex";
      modal.style.flexDirection = "column";
      modal.style.alignItems = "center";
      modal.style.boxShadow = `0 ${s(10)} ${s(40)} rgba(0,0,0,0.6)`;
      modal.style.color = "white";
      modal.style.fontFamily = "sans-serif";
      modal.style.gap = s(16);

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

      // Botón "X" grande y cómodo en la esquina superior derecha
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
      header.innerText = title;
      header.style.margin = "0";
      header.style.fontSize = s(18);
      header.style.fontWeight = "bold";
      header.style.textAlign = "center";

      const isZipMode = title.includes("ZIP") || title.includes("omprim");
      const statusEl = document.createElement("div");
      statusEl.innerText = isZipMode
        ? t("compressingProgress", { current: 1, total })
        : t("downloadingProgress", { current: 1, total });
      statusEl.style.fontSize = s(14);
      statusEl.style.color = "#ccc";
      statusEl.style.textAlign = "center";

      const barContainer = document.createElement("div");
      barContainer.style.width = "100%";
      barContainer.style.height = s(10);
      barContainer.style.backgroundColor = "#444";
      barContainer.style.borderRadius = s(5);
      barContainer.style.overflow = "hidden";

      const barFill = document.createElement("div");
      barFill.style.width = "0%";
      barFill.style.height = "100%";
      barFill.style.backgroundColor = "#fe2c55";
      barFill.style.borderRadius = s(5);
      barFill.style.transition = "width 0.2s ease";
      barContainer.appendChild(barFill);

      const percentEl = document.createElement("div");
      percentEl.innerText = "0%";
      percentEl.style.fontSize = s(13);
      percentEl.style.fontWeight = "bold";
      percentEl.style.color = "#fe2c55";

      const btnClose = document.createElement("button");
      btnClose.innerText = t("close");
      btnClose.style.marginTop = s(6);
      btnClose.style.padding = `${s(8)} ${s(24)}`;
      btnClose.style.borderRadius = s(8);
      btnClose.style.border = "none";
      btnClose.style.backgroundColor = "#fe2c55";
      btnClose.style.color = "white";
      btnClose.style.fontWeight = "bold";
      btnClose.style.fontSize = s(14);
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
          statusEl.style.color = "#ffffff"; // Blanco limpio y estético

          let secondsLeft = 3;
          btnClose.innerText = `${t("close")} (${secondsLeft}s)`;
          btnClose.style.display = "block";

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

    const downloadLogic = async (isZip: boolean) => {
      if (isProcessingBatch) return;

      // Volvemos a calcular al momento del clic
      const currentImages = Array.from(document.querySelectorAll('img[alt="sticker"]')) as HTMLImageElement[];
      const freshNew = currentImages.filter(img => !isDownloaded(img.src)).map(img => img.src);
      const freshOld = currentImages.filter(img => isDownloaded(img.src)).map(img => img.src);

      if (freshNew.length === 0 && freshOld.length === 0) {
        alert(t("noStickersOnScreen"));
        return;
      }
      
      const title = isZip ? t("confirmZipTitle") : t("confirmSeqTitle");
      
      // Mostrar el modal y obtener las URLs seleccionadas
      const selectedUrls = await showCustomConfirm(title, freshNew, freshOld);
      if (!selectedUrls || selectedUrls.length === 0) return;

      isProcessingBatch = true;
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

    btnSeq.addEventListener("click", () => downloadLogic(false));
    btnZip.addEventListener("click", () => downloadLogic(true));

    btnContainer.appendChild(btnSeq);
    btnContainer.appendChild(btnZip);
    
    // Insertamos el contenedor de botones en el header
    if (window.getComputedStyle(headerContainer).display !== "flex") {
      headerContainer.style.display = "flex";
      headerContainer.style.alignItems = "center";
    }
    headerContainer.appendChild(btnContainer);
  } else {
    // Si los botones ya existen, simplemente actualizamos el contador de stickers
    const btnSeq = btnContainer.querySelector(".btn-seq") as HTMLButtonElement;
    if (btnSeq) {
      btnSeq.innerText = t("downloadCount", { count: newStickerCount });
    }
  }
};

// Helper para detectar si estamos en un dispositivo móvil (Firefox Android, Chrome Android/iOS o pantalla táctil)
const isMobileDevice = (): boolean => {
  const ua = navigator.userAgent || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  const hasCoarsePointer = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false;
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 768;
  return isMobileUA || (hasCoarsePointer && isSmallScreen);
};

// Función para inyectar un botón de descarga individual en cada sticker
// Helper para actualizar el aspecto visual del botón individual sobre el sticker
const updateIndivButtonVisual = (btn: HTMLElement, isDone: boolean) => {
  const isMobile = isMobileDevice();
  const iconSize = isMobile ? 18 : 14;
  const strokeWidth = isMobile ? 2.8 : 2.5;

  btn.style.backgroundColor = isDone ? "rgba(18, 18, 18, 0.78)" : "rgba(18, 18, 18, 0.72)";
  btn.style.border = isDone ? "1.5px solid #2ed573" : "1.5px solid rgba(255, 255, 255, 0.35)";
  btn.title = isDone ? t("alreadyDownloadedTooltip") : t("downloadThis");
  
  if (isDone) {
    // Checkmark sutil y nítido
    btn.innerHTML = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="#2ed573" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`;
  } else {
    // Flecha de descarga blanca
    btn.innerHTML = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>`;
  }
};

// Función para inyectar un botón de descarga individual SOBRE cada sticker
const addIndividualDownloadButtons = () => {
  const stickerImages = document.querySelectorAll('img[alt="sticker"]');
  
  stickerImages.forEach((img) => {
    const htmlImg = img as HTMLImageElement;
    const parent = htmlImg.parentElement;
    if (!parent) return;
    
    // Evitar procesar el mismo sticker múltiples veces
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
    
    // Asegurar que el padre tenga position relative para anclar el botón encima del sticker
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
    // Posicionar en la esquina inferior derecha del sticker (más amplio en móvil)
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
    btn.style.zIndex = "25"; // Por encima del sticker
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

    // Feedback táctil suave para móvil
    btn.addEventListener("touchstart", () => {
      btn.style.transform = "scale(0.92)";
    }, { passive: true });
    btn.addEventListener("touchend", () => {
      btn.style.transform = "scale(1)";
    }, { passive: true });
    
    btn.addEventListener("click", async (e) => {
      e.stopPropagation(); // Evitar que el clic se propague
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
        
        // Actualizar los botones globales
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

// Set up MutationObserver con "debounce" para no saturar la página
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

// Empezamos a observar cambios en todo el body
observer.observe(document.body, {
  childList: true,
  subtree: true
});
