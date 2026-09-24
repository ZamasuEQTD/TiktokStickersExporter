# TikTok Stickers Exporter - Source Code

## Build Environment Requirements
- **Operating System:** Linux, macOS, or Windows
- **Node.js:** v18.0.0 or higher
- **npm:** v8.0.0 or higher

## Build Instructions
1. Extract the source code ZIP archive.
2. Open a terminal and navigate to the extracted directory.
3. Install all required dependencies:
   ```bash
   npm install
   ```
## Build Instructions
1. Install all required dependencies:
   ```bash
   npm install
   ```

2. Build options:
   - **Build for both browsers (Chrome & Firefox):**
     ```bash
     npm run build
     # or: npm run build:all
     ```
   - **Build specifically for Google Chrome:**
     ```bash
     npm run build:chrome
     ```
     Output directory: `dist/chrome/`
   - **Build specifically for Firefox / Firefox Android:**
     ```bash
     npm run build:firefox
     ```
     Output directory: `dist/firefox/`

3. Development & Testing:
   - **Launch with Chrome:**
     ```bash
     npm run start:chrome
     ```
   - **Launch with Firefox:**
     ```bash
     npm run start:firefox
     ```

## Output Directories
- `dist/chrome/`: Fully compatible Manifest V3 extension ready for Chrome Web Store / `chrome://extensions`.
- `dist/firefox/`: Fully compatible Manifest V3 extension ready for Firefox Desktop & Android / Mozilla Add-ons (AMO).

