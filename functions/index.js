const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbAuth");
const { getAllItems, createItem, activateItem, deactivateItem } = require("./handlers/items");
const { signup, login, getAuthenticatedUser } = require("./handlers/users");
const { db } = require('./util/admin');

app.get("/items", getAllItems);
app.post("/item", createItem);
app.get("/item/:itemId/activate", activateItem);
app.get("/item/:itemId/deactivate", deactivateItem);
app.post("/signup", signup);
app.post("/login", login);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnCreateNewItem = functions
    .region('us-central1')
    .firestore.document('/items/{id}')
    .onCreate((snapshot) => {
        db.doc(`/items/${snapshot.data().itemId}`)
            .get()
            .then(doc => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.itemId}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            title: doc.data().title,
                            isActive: doc.data.isActive
                        })
                }
            })
            .catch((err) => {
                console.error(err);
                return;
            })

    });