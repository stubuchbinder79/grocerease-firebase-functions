const { db, admin } = require("../util/admin");
const config = require("../util/config");
const firebase = require("firebase");
const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails
} = require("../util/validators");

firebase.initializeApp(config);

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  const { valid, errors } = validateSignupData(newUser);
  if (!valid) return res.status(400).json(errors);

  const noImg = "noImg.png";
  let token, userId;

  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: "this handle is taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      console.log("got token");
      token = idToken;

      const newUserCredentials = {
        userId,
        userId,
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        items: []
      };

      return db.doc(`/users/${newUser.handle}`).set(newUserCredentials);
    })
    .then(() => {
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
    });
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const {valid, errors} = validateLoginData(user);

  if(Object.keys(errors).length > 0) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      console.info("fetching id token");
      return data.user.getIdToken();
    })
    .then(token => {
      console.info("got token");
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ message: "wrong credentials, please try again" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};

exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then(doc => {
      if(doc.exists) {
        userData.credentials = doc.data();
        return db.collection('items')
          .where('userHandle', '==', req.user.handle)
          .get();
      }
    })
    .then(data => {
      userData.items = [];
      data.forEach(doc => {
        userData.items.push(doc.data());
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({error: err.code});
    });
};
