
const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth');

const { getAllShouts, postOneShout } = require('./handlers/shouts')
const { signup, login, uploadImage } = require('./handlers/users')

// Get all shouts and post a shout
app.get("/shouts", getAllShouts);
app.post("/shout", FBAuth, postOneShout);

// Sign up and login routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", uploadImage)
exports.api = functions.https.onRequest(app);
