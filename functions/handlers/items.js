const { db, admin } = require("../util/admin");
// const config  = require ('../util/config');
exports.addItem = (req, res) => {
  console.log('add item to users inventory');

}
exports.getAllItems = (req, res) => {
  admin
    .firestore()
    .collection("items")
    .get()
    .then(data => {
      let items = [];
      data.forEach(doc => {
        items.push({
          itemId: doc.id,
          title: doc.data().title,
          isActive: doc.data().isActive,
          createdAt: doc.data().createdAt,
          userId: req.user.userHandle
        });
      });
      return res.json(items);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err });
    });
};

exports.createItem = (req, res) => {
  const newItem = {
    title: req.body.title,
    isActive: true,
    createdAt: new Date().toISOString(),
    userHandle: req.user.handle
  };

  db.collection("items")
    .add(newItem)
    .then(doc => {
      const resItem = newItem;
      resItem.itemId = doc.id;
      res.status(200).json({ newItem });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err });
    });
};

exports.activateItem = (req, res) => {
  const itemDoc = db.doc(`/items/${req.params.itemId}`);
  let itemData;

  itemDoc
    .get()
    .then((doc) => {
      itemData = doc.data();
      itemData.itemId = doc.id;
      
      itemData.isActive = true;
      itemDoc.update({ isActive: true })
        .then(() => {
          return res.status(200).json(itemData);
        })
        .catch(err => {
          console.error(err);
          return res.status(500).json({ error: err });
        });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: 'tokonan' });
    });
}
exports.deactivateItem = (req, res) => {
  const itemDoc = db.doc(`/items/${req.params.itemId}`);
  let itemData;

  itemDoc
    .get()
    .then((doc) => {
      itemData = doc.data();
      itemData.isActive = false;
      itemDoc.update({ isActive: false })
        .then(() => {
          return res.status(200).json(itemData);
        })
        .catch(err => {
          console.error(err);
          return res.status(500).json({ error: err });
        })
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err });
    });
}
