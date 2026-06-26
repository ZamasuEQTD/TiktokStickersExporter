console.log("TikTok Stickers Exporter content script loaded!");

// Función para inyectar el botón "Descargar Todos" junto a los botones de chat
const addDownloadAllButton = () => {
  // Ubicamos el contenedor flex donde están el input de texto y los botones
  const inputAreaContainer = document.querySelector('div[data-e2e="message-input-area"]')?.parentElement;
  
  if (!inputAreaContainer) return;
  
  // Evitar agregarlo múltiples veces
  if (inputAreaContainer.dataset.exporterAllAdded === "true") return;
  inputAreaContainer.dataset.exporterAllAdded = "true";

  // Creamos el contenedor
  const btnContainer = document.createElement("div");
  btnContainer.className = "TUXTooltip-reference";
  btnContainer.style.marginLeft = "5px"; 
  btnContainer.style.marginRight = "10px";
  btnContainer.style.display = "flex";
  // Forzar alineación central para que coincida con la caja de input
  btnContainer.style.alignSelf = "center";
  
  const btn = document.createElement("div");
  btn.role = "button";
  btn.title = "Descargar todos los stickers";
  btn.style.cursor = "pointer";
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.width = "32px";
  btn.style.height = "32px";
  btn.style.borderRadius = "50%";
  
  // Estilo Outlined color rojo TikTok
  btn.style.backgroundColor = "transparent";
  btn.style.border = "1px solid #fe2c55";
  btn.style.color = "#fe2c55";
  
  btn.style.transition = "transform 0.2s, background-color 0.2s, border-color 0.2s";
  
  // Icono de flecha de descarga (SVG)
  btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>`;

  btn.addEventListener("mouseenter", () => {
    btn.style.transform = "scale(1.1)";
    btn.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; // Hover sutil
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "scale(1)";
    btn.style.backgroundColor = "transparent";
  });
  
  btn.addEventListener("click", async () => {
    const stickerImages = document.querySelectorAll('img[alt="sticker"]');
    if (stickerImages.length === 0) {
      alert("No hay stickers cargados en la pantalla actual. Haz scroll para cargarlos.");
      return;
    }
    
    if(!confirm(`¿Descargar los ${stickerImages.length} stickers de este chat de forma secuencial?`)) return;

    let index = 1;
    for (const img of stickerImages) {
      const stickerUrl = (img as HTMLImageElement).src;
      try {
        const res = await fetch(stickerUrl);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tiktok-sticker-${Date.now()}-${index}.webp`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        await new Promise(r => setTimeout(r, 200)); 
        index++;
      } catch (err) {
        console.error("Error al descargar:", stickerUrl);
      }
    }
  });

  btnContainer.appendChild(btn);
  inputAreaContainer.appendChild(btnContainer);
};

// Set up MutationObserver con "debounce" para no saturar la página
let isProcessing = false;
const observer = new MutationObserver(() => {
  if (isProcessing) return;
  isProcessing = true;
  
  setTimeout(() => {
    addDownloadAllButton();
    isProcessing = false;
  }, 500);
});

// Empezamos a observar cambios en todo el body
observer.observe(document.body, {
  childList: true,
  subtree: true
});
