const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const monk = require('monk');
const { isAdmin, isLoggedIn, notAnApp} = require('../../middlewares');

const url = process.env.DB_URL;
const db = monk(url);
const tokens = db.get('tokens');

function validationError(res, next, error) {
  res.status(400);
  const err = new Error(error);
  next(err);
}

const appNameSchema = Joi.object({
  appName: Joi.string().alphanum().min(1).max(30).required(),
});

const idSchema = Joi.object({
  id: Joi.string()
    .alphanum()
    .min(24)
    .max(24)
    .required()
});


const router = express.Router();

router.post('/create/', (req, res, next) => {

  // validate the appName from req.body
  const { error } = appNameSchema.validate(req.body);

  if (error === undefined) {
    // check if app name is unique
    tokens.findOne({ appName: req.body.appName }).then((doc) => {
      if (doc) {
        res.status(400);
        const error = new Error('AppName already exists');
        next(error);
      }
    });

    // generate a new token
    const payload = {
      userId: req.user._id,
      username: req.user.username,
      appName: req.body.appName,
      role: 'app',
    };
    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) {
        res.status(500);
        const error = new Error(err);
        next(error);
      } else {
        const newToken = {
          userId: req.user._id,
          username: req.user.username,
          appName: req.body.appName,
          role: 'app',
          token: token,
        };

        // insert newToken in the db
        tokens.insert(newToken).then((insertedToken) => {
          res.json({
            appName: insertedToken.appName,
            token: insertedToken.token,
            _id: insertedToken._id,
          });
        }).then(() => db.close());

      }
    });
  } else {
    validationError(res, next, error);
  }
});

router.get('/get/all', isAdmin, (req, res) => {
  tokens.find({}, { fields : { _id : 1, username : 1, appName : 1}}).then((docs) => {
    res.json({
      tokens: docs
    }).then(() => db.close());
  }); 
});

router.get('/get/', isLoggedIn, notAnApp, (req, res) => {
  tokens.find({ username : req.user.username}).then((docs) => {
    res.json({
      tokens: docs
    }).then(() => {db.close();});
  });
});

router.delete('/:id', isLoggedIn, (req, res, next) => {
  const id = req.params.id;
  const { error } = idSchema.validate({id : id});

  const userId = req.user._id;
  const userRole = req.user.role;

  if (error === undefined) {
  // if role == admin -> can delete any token
    if (userRole == 'admin') {
      tokens.remove({ _id: id }).then(() => {
        res.json({
          message: 'Record successfully deleted'
        });
      });
    }
    // if role == peasant -> can only delete its token
    if (userRole == 'peasant') {
      tokens.findOne({ _id: id, userId: userId}).then((doc) => {
        if (doc === null) {
          res.json({
            message: 'no token with this id related to the connected user'
          });
        } else {
          tokens.remove({ _id: doc._id }).then(() => {
            res.json({
              message: 'Record successfully deleted'
            });
          });
        }
      });
    }
  } else {
    validationError(res, next, error);
  }
});

module.exports = router;