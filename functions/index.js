const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbAuth");
const { getAllItems, createItem } = require("./handlers/items");
const { signup, login, getAuthenticatedUser } = require("./handlers/users");

app.get("/items", FBAuth, getAllItems);
app.post("/item", FBAuth, createItem);
app.post("/signup", signup);
app.post("/login", login);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);