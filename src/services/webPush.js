// server/webPush.js
const webpush = require('web-push');

// Configura las claves de VAPID
const publicVapidKey = 'BPHOXfset_t5aRNQy7WAhteVfdNhvahptMcNQh2i5WpQ-bsziDYAOEalOZLMfBqV5URaAxbl2GcxjbfApjJ2oMI';
const privateVapidKey = 'HaNR2Wqs1Vwg0-TNtsSNzXLEBUj17rDKxQe_nafjntc';

webpush.setVapidDetails(
  'mailto:20210709@uthh.edu.mx',  // Tu correo electrónico en formato mailto
  publicVapidKey,
  privateVapidKey
);




module.exports = webpush;
