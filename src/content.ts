console.log("TikTok Stickers Exporter content script loaded!");

const floatingBanner = document.createElement("div");
floatingBanner.innerText = "Sticker Exporter Ready 🚀";
floatingBanner.style.position = "fixed";
floatingBanner.style.bottom = "20px";
floatingBanner.style.right = "20px";
floatingBanner.style.backgroundColor = "#fe2c55";
floatingBanner.style.color = "white";
floatingBanner.style.padding = "10px 15px";
floatingBanner.style.borderRadius = "8px";
floatingBanner.style.zIndex = "999999";
floatingBanner.style.fontWeight = "bold";
floatingBanner.style.fontFamily = "sans-serif";
floatingBanner.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";

document.body.appendChild(floatingBanner);

// Remover el cartel después de 5 segundos
setTimeout(() => {
    floatingBanner.remove();
}, 5000);
