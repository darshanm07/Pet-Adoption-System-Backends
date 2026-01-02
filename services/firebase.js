// firebase.js
const admin = require("firebase-admin");

const serviceAccount = require("../firebase-service-account-key.json");
console.log("serviceAccount: ", serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

module.exports = messaging;
