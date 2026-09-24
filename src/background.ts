import browser from 'webextension-polyfill';

// Listen for installation
browser.runtime.onInstalled.addListener(() => {
  console.log("TikTok Stickers Exporter installed.");
});

browser.runtime.onMessage.addListener((message: any) => {
  if (message.action === "download") {
    browser.downloads.download({
      url: message.url,
      filename: message.filename,
      saveAs: false
    }).catch(err => console.error("Error downloading:", err));
  }
});
