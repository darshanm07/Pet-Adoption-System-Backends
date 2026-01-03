// firebase.js
const admin = require("firebase-admin");

const serviceAccount = require("../config/firebase-admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

admin
  .auth()
  .listUsers(1)
  .then(() => console.log("Firebase Admin Auth SUCCESS"))
  .catch(console.error);

const messaging = admin.messaging();

module.exports = messaging;
