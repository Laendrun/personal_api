const express = require('express');
const monk = require('monk');

const url = process.env.DB_URL;
const db = monk(url);
const users = db.get('users');

const { isAdmin } = require('../../middlewares');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({
    username: req.user.username,
    role: req.user.role,
  });
});

router.get('/all/', isAdmin, (req, res, next) => {
  users.find({}, { fields: { password: 0 } })
    .then((users) => {
      res.json({
        users
      });
    });
});

router.delete('/:id', isAdmin, (req, res, next) => {
  users.remove({_id: req.params.id})
    .then((result) => {
      res.json({
        result
      });
    });
});

router.put('/:id/:role', isAdmin, (req, res, next) => {
  users.update({_id: req.params.id}, {
    $set:
      {
        role: req.params.role,
      }
  })
    .then((result) => {
      res.json({
        result: result
      });
    });
});

module.exports = router;