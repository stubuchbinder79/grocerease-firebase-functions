const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbAuth");
const { getAllItems, createItem, activateItem, deactivateItem } = require("./handlers/items");
const { signup, login, getAuthenticatedUser } = require("./handlers/users");
const { db } = require('./util/admin');

app.get("/items", FBAuth, getAllItems);
app.post("/item", FBAuth, createItem);
app.get("/item/:itemId/activate", activateItem);
app.get("/item/:itemId/deactivate", deactivateItem);
app.post("/signup", signup);
app.post("/login", login);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnDeactivate = functions
    .region('us-central1')
    .firestore.document(`items/{id}`).onCreate((snapshot) => {
        db.doc(`/items/${snapshot.data().itemId}`)
            .get()
            .then(doc => {
                if (doc.exists) {
                    console.log('doc exists!!!');
                    return db.doc(`/notifications/${snapshot.id}`)
                        .set({
                            title: doc.data().title,
                            itemId: doc.data().itemId,
                            isActive: doc.data().isActive,
                            userHandle: doc.data().userHandle,
                            createdAt: doc.data().createdAt
                        });
                }
            })
            .then(() => {
                return
            })
            .catch(err => {
                console.error(err);
                return;
            })
    });