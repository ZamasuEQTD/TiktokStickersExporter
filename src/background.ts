import browser from 'webextension-polyfill';

// Listen for installation
browser.runtime.onInstalled.addListener(() => {
  console.log("TikTok Stickers Exporter installed.");
});

// User-Agent de escritorio para simular Modo PC exclusivamente en /messages
const DESKTOP_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0';

const shouldApplyDesktopUA = (details: any): boolean => {
  const url = details.url || '';
  if (url.includes('/messages')) {
    return true;
  }
  const headers = details.requestHeaders || [];
  for (const h of headers) {
    if (h.name.toLowerCase() === 'referer' && (h.value || '').includes('/messages')) {
      return true;
    }
  }
  return false;
};

try {
  const anyBrowser = browser as any;
  if (anyBrowser.webRequest && anyBrowser.webRequest.onBeforeSendHeaders) {
    anyBrowser.webRequest.onBeforeSendHeaders.addListener(
      (details: any) => {
        if (!shouldApplyDesktopUA(details)) {
          return {};
        }

        const headers = details.requestHeaders || [];
        let uaFound = false;
        for (const h of headers) {
          if (h.name.toLowerCase() === 'user-agent') {
            h.value = DESKTOP_UA;
            uaFound = true;
          }
        }
        if (!uaFound) {
          headers.push({ name: 'User-Agent', value: DESKTOP_UA });
        }
        return { requestHeaders: headers };
      },
      { urls: ['*://*.tiktok.com/*'] },
      ['blocking', 'requestHeaders']
    );
  }
} catch (e) {
  console.error("Error al configurar simulación de User-Agent de escritorio:", e);
}

browser.runtime.onMessage.addListener((message: any) => {
  if (message.action === "openMessagesTab") {
    try {
      browser.tabs.create({ url: "https://www.tiktok.com/messages", active: true });
    } catch (e) {
      console.error("Error creating tab:", e);
    }
    return;
  }

  if (message.action === "download") {
    browser.downloads.download({
      url: message.url,
      filename: message.filename,
      saveAs: false
    }).catch(err => console.error("Error downloading:", err));
  }
});
