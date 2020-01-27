const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://grocerease-1aacd.firebaseio.com",
  });
const db = admin.firestore();

module.exports = {admin, db};

