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
4. Build the extension (compiles TypeScript and bundles files via Webpack):
   ```bash
   npm run build
   ```
5. Package the extension (optional, generates the final .zip):
   ```bash
   npx web-ext build --source-dir dist
   ```

The compiled and minified extension ready for Firefox is located in the `dist/` directory. The packaged zip file is generated in the `web-ext-artifacts/` directory.
