# Privacy Policy for Sticky: TikTok Stickers Exporter

*Last updated: October 24, 2026*

**Sticky: TikTok Stickers Exporter** ("we", "our", or "the extension") is committed to protecting your privacy. This Privacy Policy explains our practices regarding user data.

---

### 1. Data Collection and Usage
**Sticky: TikTok Stickers Exporter does not collect, transmit, store, or sell any personal data.**

- **No Personal Information:** We do not collect names, email addresses, phone numbers, IP addresses, or account credentials.
- **No Browsing History:** We do not monitor, track, or record your web browsing activity.
- **No Telemetry or Analytics:** The extension does not contain third-party tracking tools, analytics SDKs, or advertising networks.

---

### 2. Local Storage
All data processed by the extension remains strictly on your local device:
- **User Preferences:** Preferred interface language (English or Spanish) and sequential download delay intervals are stored locally via `chrome.storage.local` / `localStorage`.
- **Download History:** A local list of sticker identifiers is saved in your browser's local storage solely to identify previously downloaded stickers and prevent duplicate downloads.
- This data is never transmitted to external servers and can be cleared at any time via the extension's Settings menu.

---

### 3. Permissions Justification
The extension requests only the minimum necessary permissions required for its functionality:
- `tabs` & `activeTab`: Required to open TikTok messages in a dedicated desktop view and interact with the active TikTok page.
- `scripting`: Required to inject the local content script that detects stickers and renders the user interface.
- `downloads`: Required to save individual sticker files and user-requested ZIP archives directly to your computer.
- `storage`: Required to save your local configuration settings.
- `host_permissions (*://*.tiktok.com/*)`: Required solely to detect sticker elements on TikTok chat pages and fetch image data directly from TikTok's CDN for local packaging.

---

### 4. Third-Party Services
The extension does not share any data with third parties. All processing (ZIP creation, image format handling) occurs entirely client-side within your browser.

---

### 5. Contact
If you have any questions about this Privacy Policy, you can open an issue on GitHub:
https://github.com/ZamasuEQTD/TiktokStickersExporter/issues
