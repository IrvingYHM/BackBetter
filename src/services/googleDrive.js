// services/googleDrive.js
const { google } = require("googleapis");
const fs = require("fs");
const mime = require("mime-types");

// Leer y preparar la clave desde variable de entorno
const parsedKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
parsedKey.private_key = parsedKey.private_key.replace(/\\n/g, "\n");

// Crear autenticador de Google
const auth = new google.auth.GoogleAuth({
  credentials: parsedKey,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

// Obtener el cliente autenticado
let driveServicePromise = auth
  .getClient()
  .then((authClient) => google.drive({ version: "v3", auth: authClient }));

// Subir PDF a Google Drive
async function uploadPDFToDrive(filePath, fileName, folderId) {
  const drive = await driveServicePromise;

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType: mime.lookup(filePath) || "application/pdf",
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: "id, webViewLink",
  });

  return {
    fileId: response.data.id,
    webViewLink: response.data.webViewLink,
  };
}

// Eliminar archivo de Google Drive
async function deleteFile(fileId) {
  const drive = await driveServicePromise;
  await drive.files.delete({ fileId });
}

module.exports = {
  uploadPDFToDrive,
  deleteFile,
};
