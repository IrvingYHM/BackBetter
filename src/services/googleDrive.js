// services/googleDrive.js
const { google } = require("googleapis");
const fs = require("fs");
const mime = require("mime-types");

// Leer credenciales desde variable de entorno
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const driveService = google.drive({ version: "v3", auth });

// Sube un archivo PDF a Google Drive y devuelve el ID del archivo y su URL
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

async function deleteFile(fileId) {
  await driveService.files.delete({
    fileId: fileId,
  });
}

module.exports = {
  uploadPDFToDrive,
  deleteFile,
};
