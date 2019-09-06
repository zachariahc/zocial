const { db } = require("../util/admin");

// Get all shouts
exports.getAllShouts = (req, res) => {
  db.collection("shouts")
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
};
// Post one shout
exports.postOneShout = (req, res) => {
  const newShout = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  db.collection("shouts")
    .add(newShout)
    .then(doc => {
      const resShout = newShout
      resShout.shoutId = doc.id;
      res.json(resShout);
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

// I don't know yet
exports.getShout = (req, res) => {
  let shoutData = {};

  db.doc(`/shouts/${req.params.shoutId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Shout not found" });
      }
      shoutData = doc.data();
      shoutData.shoutId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", 'desc')
        .where("shoutId", "==", req.params.shoutId)
        .get();
    })
    .then(data => {
      shoutData.comments = [];
      data.forEach(doc => {
        shoutData.comments.push(doc.data());
      });
      return res.json(shoutData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
// Comment on a comment
exports.commentOnShout = (req, res) => {
  if (req.body.body.trim() === '') return res.status(400).json({ error: 'Must not be empty' })

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    shoutId: req.params.shoutId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };

  db.doc(`/shouts/${req.params.shoutId}`)
  .get()
  .then(doc => {
    if(!doc.exists){
      return res.status(404).json({ error: 'Shout not found'});
    }
    return db.collection('comments').add(newComment);
  })
  .then(() => {
    res.json(newComment)
  })
  .catch(err => {
    console.error(err)
    return res.satus(500).json({ error: 'Something went wrong' })
  })

}
// Like a shout
exports.likeShout = (req, res) => {
  
}
// Unlike a shout
exports.unlikeShout = () => {

}