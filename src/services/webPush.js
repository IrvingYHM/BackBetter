// server/webPush.js
const webpush = require('web-push');

// Configura las claves de VAPID
const publicVapidKey = 'BC4f-0PRuNleWrklg3SiTjzII61-P8Barj53yC2i3Zk0Fz4M5-f2wXKRlULw75l1lPzVd0Zr-x0_HA86Y9ZZa_U';
const privateVapidKey = 'NPYifL60KbsNgECcc0VD7eAv_byPuNlsEoD0ayZm9og';

webpush.setVapidDetails(
  'https://opticenter-hu.vercel.app/',
  publicVapidKey,
  privateVapidKey
);

module.exports = webpush;
