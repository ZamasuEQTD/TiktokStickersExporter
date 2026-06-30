import JSZip from 'jszip';
import browser from 'webextension-polyfill';

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
    
    const header = document.createElement("h2");
    header.innerText = title;
    header.style.marginTop = "0";
    header.style.textAlign = "center";
    header.style.fontSize = s(18);
    header.style.marginBottom = s(15);
    modal.appendChild(header);

    const scrollContainer = document.createElement("div");
    scrollContainer.style.overflowY = "auto";
    scrollContainer.style.flexGrow = "1";
    scrollContainer.style.marginBottom = s(15);
    scrollContainer.style.scrollbarWidth = "thin";
    scrollContainer.style.scrollbarColor = "#fe2c55 #252525";
    scrollContainer.style.display = "flex";
    scrollContainer.style.flexDirection = "column";
    scrollContainer.style.gap = s(10);
    
    const selectedUrls = new Set<string>([...newStickers]);
    const imageElements = new Map<string, HTMLImageElement>();
    
    const btnConfirm = document.createElement("button");
    const updateConfirmButton = () => {
      btnConfirm.innerText = `Descargar (${selectedUrls.size})`;
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

    if (newStickers.length > 0) {
      const newTitle = document.createElement("div");
      newTitle.innerText = `Nuevos (${newStickers.length})`;
      newTitle.style.fontWeight = "bold";
      newTitle.style.fontSize = s(14);
      newTitle.style.color = "#ccc";
      scrollContainer.appendChild(newTitle);
      scrollContainer.appendChild(createGrid(newStickers, true));
    } else {
      const noNew = document.createElement("div");
      noNew.innerText = "No hay stickers nuevos en la pantalla.";
      noNew.style.textAlign = "center";
      noNew.style.color = "#888";
      noNew.style.fontSize = s(14);
      scrollContainer.appendChild(noNew);
    }
    
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

    if (oldStickers.length > 0) {
      const oldHeader = document.createElement("div");
      oldHeader.style.display = "flex";
      oldHeader.style.justifyContent = "space-between";
      oldHeader.style.alignItems = "center";
      oldHeader.style.marginTop = s(15);
      oldHeader.style.paddingTop = s(15);
      oldHeader.style.borderTop = "1px solid #444";
      oldHeader.style.marginBottom = s(10);
      
      const oldTitle = document.createElement("div");
      oldTitle.innerText = `En el dispositivo (${oldStickers.length})`;
      oldTitle.style.fontWeight = "bold";
      oldTitle.style.fontSize = s(14);
      oldTitle.style.color = "#ccc";
      
      const btnToggleOld = document.createElement("button");
      btnToggleOld.innerText = "Seleccionar todos";
      btnToggleOld.style.padding = `${s(4)} ${s(8)}`;
      btnToggleOld.style.borderRadius = s(6);
      btnToggleOld.style.border = "1px solid #888";
      btnToggleOld.style.backgroundColor = "transparent";
      btnToggleOld.style.color = "#888";
      btnToggleOld.style.cursor = "pointer";
      btnToggleOld.style.fontSize = s(12);
      
      oldHeader.appendChild(oldTitle);
      oldHeader.appendChild(btnToggleOld);
      scrollContainer.appendChild(oldHeader);

      // Los dibujamos siempre visibles pero como no seleccionados por defecto
      const oldGrid = createGrid(oldStickers, false);
      scrollContainer.appendChild(oldGrid);

      let allSelected = false;
      btnToggleOld.onclick = () => {
        allSelected = !allSelected;
        if (allSelected) {
          btnToggleOld.innerText = "Cancelar selección";
          btnToggleOld.style.border = "1px solid #fe2c55";
          btnToggleOld.style.color = "#fe2c55";
          
          // Agregar automáticamente a la selección
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
          btnToggleOld.innerText = "Seleccionar todos";
          btnToggleOld.style.border = "1px solid #888";
          btnToggleOld.style.color = "#888";
          
          // Quitar de la selección
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
    }
    
    modal.appendChild(scrollContainer);

    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = s(12);

    const btnCancel = document.createElement("button");
    btnCancel.innerText = "Cancelar";
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
  header.innerText = "Configuración";
  header.style.marginTop = "0";
  header.style.textAlign = "center";
  header.style.fontSize = s(18);
  header.style.marginBottom = "0";
  modal.appendChild(header);

  // Delay setting
  const delayContainer = document.createElement("div");
  delayContainer.style.display = "flex";
  delayContainer.style.flexDirection = "column";
  delayContainer.style.gap = s(5);
  
  const delayLabel = document.createElement("label");
  delayLabel.innerText = "Retraso entre descargas (segundos):";
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
  btnClear.innerText = "Limpiar Historial de Descargas";
  btnClear.style.padding = s(12);
  btnClear.style.borderRadius = s(8);
  btnClear.style.border = "1px solid #fe2c55";
  btnClear.style.backgroundColor = "transparent";
  btnClear.style.color = "#fe2c55";
  btnClear.style.cursor = "pointer";
  btnClear.style.fontWeight = "bold";
  btnClear.style.fontSize = s(14);
  
  btnClear.onclick = () => {
    if (confirm("¿Estás seguro de borrar el historial? Todos los stickers volverán a aparecer como 'Nuevos'.")) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("tiktok-sticker-downloaded-")) {
          localStorage.removeItem(key);
        }
      });
      alert("Historial borrado. Recarga la página para ver los cambios.");
    }
  };
  modal.appendChild(btnClear);

  const btnClose = document.createElement("button");
  btnClose.innerText = "Cerrar";
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

    const btnSeq = createTextBtn(`Descargar (${newStickerCount})`, true);
    btnSeq.className = "btn-seq";
    btnSeq.title = "Descargar los stickers de la pantalla";
    
    const btnZip = createTextBtn("Descargar ZIP", false);
    btnZip.className = "btn-zip";
    
    const downloadLogic = async (isZip: boolean) => {
      // Volvemos a calcular al momento del clic
      const currentImages = Array.from(document.querySelectorAll('img[alt="sticker"]')) as HTMLImageElement[];
      const freshNew = currentImages.filter(img => !isDownloaded(img.src)).map(img => img.src);
      const freshOld = currentImages.filter(img => isDownloaded(img.src)).map(img => img.src);

      if (freshNew.length === 0 && freshOld.length === 0) {
        alert("¡No hay stickers en pantalla!");
        return;
      }
      
      const actionText = isZip ? "Comprimir" : "Descargar";
      const formatText = isZip ? "en un ZIP" : "secuencialmente";
      
      // Mostrar el modal y obtener las URLs seleccionadas
      const selectedUrls = await showCustomConfirm(`¿${actionText} stickers ${formatText}?`, freshNew, freshOld);
      if (!selectedUrls || selectedUrls.length === 0) return;

      if (isZip) {
        const zip = new JSZip();
        let index = 1;
        let successCount = 0;

        for (const stickerUrl of selectedUrls) {
          try {
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
            index++;
          } catch (err) {
            console.error("Error al descargar:", stickerUrl);
          }
        }

        if (successCount > 0) {
          try {
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
          } catch (err) {
            console.error("Error al generar el ZIP:", err);
            alert("Ocurrió un error al crear el archivo ZIP.");
          }
        }
      } else {
        let index = 1;
        for (const stickerUrl of selectedUrls) {
          try {
            const res = await fetch(stickerUrl, { method: 'HEAD' }).catch(() => fetch(stickerUrl));
            const ext = getExtension(res);
            const blobRes = await fetch(stickerUrl);
            const blob = await blobRes.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `tiktok-sticker-${Date.now()}-${index}.${ext}`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            markAsDownloaded(stickerUrl);
            
            const delayMs = getDelay() * 1000;
            await new Promise(r => setTimeout(r, delayMs));
            index++;
          } catch (err) {
            console.error("Error al descargar:", stickerUrl);
          }
        }
        addDownloadAllButton();
        addIndividualDownloadButtons();
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
      btnSeq.innerText = `Descargar (${newStickerCount})`;
    }
  }
};

// Función para inyectar un botón de descarga individual en cada sticker
const addIndividualDownloadButtons = () => {
  const stickerImages = document.querySelectorAll('img[alt="sticker"]');
  
  stickerImages.forEach((img) => {
    const htmlImg = img as HTMLImageElement;
    const parent = htmlImg.parentElement;
    if (!parent) return;
    
    // Evitar procesar el mismo sticker múltiples veces
    if (htmlImg.dataset.exporterAdded === "true") {
      // Si ya está añadido el botón, actualizamos su color si fue descargado recientemente
      const existingBtn = parent.querySelector('.tiktok-sticker-indiv-btn') as HTMLElement;
      if (existingBtn && isDownloaded(htmlImg.src)) {
        existingBtn.style.backgroundColor = "rgba(40, 167, 69, 0.9)"; // Verde éxito
      }
      return;
    }
    htmlImg.dataset.exporterAdded = "true";
    
    // Asegurar que el padre tenga position para poder anclar el botón de forma absoluta
    const parentStyle = window.getComputedStyle(parent);
    if (parentStyle.position === "static") {
      parent.style.position = "relative";
    }
    // Forzar que no se recorte el contenido que sobresale
    parent.style.overflow = "visible";
    if (parent.parentElement) {
      parent.parentElement.style.overflow = "visible";
    }
    
    const btn = document.createElement("div");
    btn.role = "button";
    btn.className = "tiktok-sticker-indiv-btn";
    btn.title = "Descargar este sticker";
    btn.style.position = "absolute";
    // Centrar verticalmente y poner afuera a la izquierda con más espacio
    btn.style.top = "calc(50% - 18px)";
    btn.style.left = "-48px";
    btn.style.cursor = "pointer";
    
    // Color verde si ya se descargó, rojo si es nuevo
    const alreadyDownloaded = isDownloaded(htmlImg.src);
    const baseColor = alreadyDownloaded ? "rgba(40, 167, 69, 0.9)" : "rgba(254, 44, 85, 0.8)";
    const hoverColor = alreadyDownloaded ? "rgba(40, 167, 69, 1)" : "rgba(254, 44, 85, 1)";
    
    btn.style.backgroundColor = baseColor;
    btn.style.color = "white";
    btn.style.borderRadius = "50%";
    btn.style.width = "36px";
    btn.style.height = "36px";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.zIndex = "10"; // Asegurar que esté por encima del sticker
    btn.style.transition = "transform 0.2s, background-color 0.2s";
    
    // Icono de descarga más grande
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>`;
    
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.15)";
      btn.style.backgroundColor = hoverColor;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
      btn.style.backgroundColor = btn.style.backgroundColor === hoverColor ? hoverColor : baseColor;
    });
    
    btn.addEventListener("click", async (e) => {
      e.stopPropagation(); // Evitar que el clic se propague y abra algo en Tiktok
      e.preventDefault();
      
      const stickerUrl = htmlImg.src;
      try {
        const res = await fetch(stickerUrl, { method: 'HEAD' }).catch(() => fetch(stickerUrl));
        const ext = getExtension(res);
        const blobRes = await fetch(stickerUrl);
        const blob = await blobRes.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tiktok-sticker-${Date.now()}.${ext}`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        markAsDownloaded(stickerUrl);
        btn.style.backgroundColor = "rgba(40, 167, 69, 0.9)"; // Cambiar a verde
        
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
  btn.innerText = "Configuración";
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
