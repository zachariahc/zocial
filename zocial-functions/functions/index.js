
const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth');

const { 
  getAllShouts, 
  postOneShout, 
  getShout, 
  commentOnShout,
  likeShout,
  unlikeShout
} = require('./handlers/shouts')
const { 
  signup, 
  login, 
  uploadImage, 
  addUserDetails, 
  getAuthenticatedUser 
} = require('./handlers/users')

// Get all shouts and post a shout
app.get("/shouts", getAllShouts);
app.post("/shout", FBAuth, postOneShout);
app.get("/shout/:shoutId", getShout);
app.get("/shout'/:shoutId/like", FBAuth, likeShout)
app.get("/shout'/:shoutId/unlike", FBAuth, unlikeShout)
app.post("/shout/:shoutId/comment", FBAuth, commentOnShout)
// TODO: delete shout
// TODO: unlike a shout


// Sign up and login routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage)
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser)

exports.api = functions.https.onRequest(app);
