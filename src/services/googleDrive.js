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

const driveService = google.drive({ version: "v3", auth });

// Función para subir PDF
async function uploadPDFToDrive(filePath, fileName, folderId) {
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType: mime.lookup(filePath),
    body: fs.createReadStream(filePath),
  };

  const response = await driveService.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id, webViewLink",
  });

  return {
    fileId: response.data.id,
    webViewLink: response.data.webViewLink,
  };
}

// Función para eliminar archivo
async function deleteFile(fileId) {
  await driveService.files.delete({ fileId });
}

module.exports = {
  uploadPDFToDrive,
  deleteFile,
};
