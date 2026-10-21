<div align="center">
  <img src="src/icons/icon-128.png" alt="Sticky: TikTok Stickers Exporter Logo" width="120" height="120" />
  <h1>Sticky: TikTok Stickers Exporter</h1>
  <p><strong>Effortlessly save, manage, and bulk-export stickers from TikTok directly in your browser.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/version-1.8.20-blue.svg" alt="Version 1.8.20" />
    <img src="https://img.shields.io/badge/Manifest-V3-success.svg" alt="Manifest V3" />
    <img src="https://img.shields.io/badge/Chrome-Supported-4285F4?logo=googlechrome&logoColor=white" alt="Chrome" />
    <img src="https://img.shields.io/badge/Firefox-Desktop_%26_Android-FF7139?logo=firefoxbrowser&logoColor=white" alt="Firefox" />
    <img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  </p>
</div>

---

## Overview

**TikTok Stickers Exporter** is a lightweight, privacy-focused browser extension for **Google Chrome** and **Mozilla Firefox** (including Firefox for Android) that lets you download individual stickers or entire sticker sets from TikTok chats and sticker panels with a single click.

Whether you want to grab a single animated sticker or archive your entire favorite collection into a `.zip` file, TikTok Stickers Exporter handles everything locally inside your browser—with zero external servers and zero tracking.

---

## Key Features

- **One-Click Individual Downloads:** Hover over any sticker on TikTok to reveal a quick-download button right on the sticker overlay.
- **Bulk ZIP Export:** Select multiple stickers from the on-screen panel and package them into a clean, single `.zip` archive instantly.
- **Sequential Bulk Download:** Prefer individual files over a ZIP? Download multiple stickers sequentially with a customizable delay between downloads to prevent browser or network throttling.
- **Smart Download History & Duplicate Prevention:**
  - Automatically remembers which stickers you have already saved.
  - Organizes stickers into **"New"** and **"On device"** tabs inside the selection modal so you never download duplicates by mistake.
  - Visual badges indicate already-downloaded stickers (with the option to re-download anytime).
- **High-Performance Multimedia Engine:** Supports static and animated WebP stickers, with built-in WebWorker conversion utilities (PNG, JPEG, GIF, WebM) optimized for low memory usage.
- **Responsive Desktop & Mobile UI:** Automatically scales and adapts to both desktop screens and mobile viewports (fully compatible with Firefox for Android).
- **Multi-Language Support (i18n):** Built-in support for **English** and **Spanish (Español)** with automatic browser language detection and manual override in Settings.
- **100% Privacy-First:** Runs entirely on your device. No analytics, no telemetry, and no external servers.

---

## How to Use (Recommended Workflow)

Because TikTok's web version only renders stickers inside active chat histories, follow these steps to export your favorite stickers from your phone to your PC or mobile browser:

1. **Send the Stickers from Your Phone First:**
   - Open the **TikTok mobile app** on your phone.
   - Open any Direct Message chat (for example, a chat with a friend, a secondary account, or yourself) and send all the stickers you want to export.
2. **Open TikTok Messages on the Web (`tiktok.com/messages`):**
   - In your browser with the extension installed, go directly to **[https://www.tiktok.com/messages](https://www.tiktok.com/messages)** and log in.
   - *(Tip for Firefox on Android users: Enable **"Desktop site"** in your browser menu so TikTok loads the full `/messages` chat view).*
3. **Open the Conversation & Scroll:**
   - Click on the chat where you sent the stickers. Scroll through the conversation so the stickers are visible on screen.
4. **Download Individually or in Bulk:**
   - **Single Sticker:** Click the **Download button** that appears in the bottom-right corner of any sticker in the chat.
   - **Bulk Export (Chat Header):** Look at the **top header of the chat conversation**, where you will see two buttons injected by the extension:
     - **`Download (N)`**: Downloads selected stickers one by one.
     - **`Download ZIP`**: Packages all selected stickers into a single `.zip` file.
   - Clicking either button opens the **Sticker Selection Modal**, where you can switch between the **New** and **On device** tabs, select/deselect stickers, and start the export.
5. **Configure Settings:**
   - Click the **`Settings`** button located next to the **"Messages"** title on the left panel to customize the delay between downloads, change the language (`Auto`, `English`, `Español`), or clear your download history.

---

## Installation

### From Official Stores
- **Chrome Web Store:** *(Link coming soon)*
- **Firefox Add-ons (AMO):** *(Link coming soon)*

### Manual Installation (Developer Mode)

#### Google Chrome / Edge / Brave
1. Download or build the project (see [Build Instructions](#build-instructions) below).
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the `dist/chrome` directory.

#### Mozilla Firefox
1. Download or build the project.
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on...**.
4. Select the `manifest.json` file inside the `dist/firefox` directory.

---

## Build Instructions (For Developers & Store Reviewers)

### Environment Requirements
- **Operating System:** Windows, macOS, or Linux
- **Node.js:** `v18.0.0` or higher
- **npm:** `v8.0.0` or higher

### Steps to Build from Source

1. **Clone or extract the repository:**
   ```bash
   git clone https://github.com/ZamasuEQTD/TiktokStickersExporter.git
   cd TiktokStickersExporter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Compile the extension:**
   - **Build both Chrome and Firefox targets:**
     ```bash
     npm run build
     # or: npm run build:all
     ```
   - **Build only for Google Chrome:**
     ```bash
     npm run build:chrome
     ```
     *Output directory:* `dist/chrome/`
   - **Build only for Mozilla Firefox (Desktop & Android):**
     ```bash
     npm run build:firefox
     ```
     *Output directory:* `dist/firefox/`

4. **Run in live development mode:**
   ```bash
   # Launch Chromium with the extension pre-loaded
   npm run start:chrome

   # Launch Firefox with the extension pre-loaded
   npm run start:firefox
   ```

---

## Permissions Explained

To function properly while respecting your privacy, the extension requests only the minimum required permissions:
- `activeTab` & `scripting` / `host_permissions (*://*.tiktok.com/*)`: Required to detect sticker elements on TikTok pages and render the download button overlays and selection modal.
- `downloads`: Required to save individual sticker files and generated `.zip` archives to your device.
- `storage`: Used locally to store user preferences (such as download delay and language settings).

---

## Privacy Policy

**TikTok Stickers Exporter** does not collect, store, transmit, or share any personal data, browsing history, or user credentials. All sticker detection, ZIP compression, and download history tracking happen 100% locally within your browser (`localStorage`).

---

## License

This project is provided for personal and educational use. TikTok is a trademark of ByteDance Ltd. This extension is an independent tool and is not affiliated with, endorsed, or sponsored by TikTok or ByteDance.
