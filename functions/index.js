const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbAuth");
const { getAllItems, createItem } = require("./handlers/items");
const { signup, login } = require("./handlers/users");

app.get("/items", getAllItems);
app.post("/item", FBAuth, createItem);
app.post("/signup", signup);
app.post("/login", login);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// https://baseurl.com/api/{something}
exports.api = functions.https.onRequest(app);
