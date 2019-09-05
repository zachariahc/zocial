require('dotenv').config()


const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();
admin.initializeApp();
// Bringing in environment variables

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID
};

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

// Get all shouts
app.get("/shouts", (req, res) => {
  db.firestore()
    .collection("shouts")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let shouts = [];

      data.forEach(doc => {
        shouts.push({
          shoutId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(shouts);
    })
    .catch(err => console.error(err));
});

// Post single shout
app.post("/shout",  (req, res) => {
  const newShout = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  db.firestore()
    .collection("shouts")
    .add(newShout)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});
const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if(email.match(regEx)) return true
  else return false
}

const isEmpty = (string) => {
  if(string.trim() == '' ) return true; 
  else return false
}

// Signup route
app.post("/signup", (req, res) => {

  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  // Begin login validation
  let errors = {};

  if(isEmpty(newUser.email)) {
    errors.email = 'Must not be empty'
  } else if (!isEmail(newUser.email)){
    errors.email = 'Must be a valid email address'
  }

  if(isEmpty(newUser.password)) errors.password = 'Must not be empty'
  if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match';
  if(isEmpty(newUser.handle)) errors.handle = 'Must not be empty'

  if(Object.keys(errors).length > 0) return res.status(400).json(errors);
  

let token, userId;

  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: "this handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId: userId
      }
      return db.doc(`/users/${newUser.handle}`).set(userCredentials)
    })
    .then(() => {
      return res.status(201).json({ token })
    })
    .catch(err => {
        console.error(err);
        if(err.code === "auth/email-already-in-use"){
            return res.status(400).json({ email: 'Email is already in use' })
        } else {
            return res.status(500).json({ error: err.code })
        }
    })
});

app.post('/login', (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  }

  let errors = {}

  if(isEmpty(user.email)) errors.email = 'Must not be empty';
  if(isEmpty(user.password)) errors.password = 'Must not be empty';

  if(Object.keys(errors).length  > 0) return res.status(400).json({ errors })

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(data => {
    return data.user.getIdToken()
  })
  .then(token => {
    return res.json({ token })
  })
  .catch(err => {
    console.error(err)
    if(err.code === "auth/user-not-found" || "auth/wrong-password"){
      return res.status(403).json({ general: 'Wrong credentials, please try again '})
    } else return res.status(500).json({ error: err.code })
  })
})

exports.api = functions.https.onRequest(app);
