const { db, admin } = require('../util/admin');
// const config  = require ('../util/config');

exports.getAllItems = (req, res) => {
    admin.firestore()
        .collection('items')
        .get()
        .then(data => {
            let items = [];
            data.forEach(doc => {
                items.push({
                    itemId: doc.id,
                    title: doc.data().title,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(items);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err });
        });
};