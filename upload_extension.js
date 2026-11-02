const fs = require('fs');
const path = require('path');
const https = require('https');

async function main() {
  const configPath = path.join(__dirname, 'chrome-auth.json');
  if (!fs.existsSync(configPath)) {
    console.error('Error: chrome-auth.json no encontrado.');
    process.exit(1);
  }

  const pkgPath = path.join(__dirname, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const version = pkg.version;

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // Buscar zip con versión actual o el especificado
  let zipPath = path.resolve(`C:/Users/Administrador/Desktop/sticky_tiktok_stickers_exporter-chrome-${version}.zip`);
  if (!fs.existsSync(zipPath)) {
    zipPath = path.resolve('C:/Users/Administrador/Desktop/sticky_tiktok_stickers_exporter-chrome-1.8.23.zip');
  }

  if (!fs.existsSync(zipPath)) {
    console.error(`Error: No se encontró el ZIP en: ${zipPath}`);
    process.exit(1);
  }

  const zipBuffer = fs.readFileSync(zipPath);
  console.log(`[1/3] Archivo ZIP cargado: ${zipPath} (${zipBuffer.length} bytes)`);

  // Paso 1: Obtener access_token
  console.log('[2/3] Solicitando access_token a Google OAuth2...');
  const accessToken = await getAccessToken(config.client_id, config.client_secret, config.refresh_token);
  console.log('✔ Access token obtenido correctamente.');

  // Paso 2: Subir el archivo ZIP a Chrome Web Store
  console.log(`[3/3] Subiendo paquete a Chrome Web Store (Item: ${config.extension_id})...`);
  const uploadResult = await uploadZip(config.extension_id, accessToken, zipBuffer);
  console.log('Resultado de la subida:', JSON.stringify(uploadResult, null, 2));

  if (uploadResult.uploadState === 'SUCCESS') {
    console.log(`✔ ¡El paquete v${version} fue subido con éxito!`);
    console.log('[4/4] Enviando a revisión (Publish)...');
    try {
      const publishResult = await publishItem(config.extension_id, accessToken);
      console.log('✔ ¡Enviado a revisión exitosamente!', JSON.stringify(publishResult, null, 2));
    } catch (err) {
      console.warn('Nota al publicar:', err.message);
    }
  } else {
    console.error('Error al subir el paquete:', uploadResult.itemError || uploadResult);
  }
}

function getAccessToken(clientId, clientSecret, refreshToken) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    }).toString();

    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.access_token) {
            resolve(json.access_token);
          } else {
            reject(new Error(json.error_description || json.error || data));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function uploadZip(itemId, accessToken, zipBuffer) {
  return new Promise((resolve, reject) => {
    const req = https.request(`https://www.googleapis.com/upload/chromewebstore/v1.1/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-goog-api-version': '2',
        'Content-Length': zipBuffer.length
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', reject);
    req.write(zipBuffer);
    req.end();
  });
}

function publishItem(itemId, accessToken) {
  return new Promise((resolve, reject) => {
    const req = https.request(`https://www.googleapis.com/chromewebstore/v1.1/items/${itemId}/publish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-goog-api-version': '2',
        'Content-Length': 0
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
