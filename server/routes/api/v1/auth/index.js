const express = require('express');
const monk = require('monk');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isLoggedIn, isAdmin } = require('../../middlewares');

const url = process.env.DB_URL;
const db = monk(url);
const users = db.get('users');

// Validation schemas
const userSchema = Joi.object({
  username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(4).max(30).required(),
  password: Joi.string().min(10).required()
});

// Functions

function loginError(res){
  res.status(422);
  //const err = new Error('Unable to login.');
  res.json({
    error: 'Unable to login.'
  });
}

// Routes
const router = express.Router();

router.post('/signup', (req, res, next) => {

  const { error } = userSchema.validate(req.body);

  if (error === undefined){
    users.findOne({ username: req.body.username})
      .then((user) => {
        if (user) {
          // there's already a user with that username in the db
          const err = new Error('Username already registered');
          res.status(409);
          next(err);
        } else {
          // user does not exist in db
          // hash the password and insert username + hashed password in db
          bcrypt.hash(req.body.password, 10).then((hashedPassword) => {

            const newUser = {
              username: req.body.username,
              password: hashedPassword,
              role: 'peasant',
            };
            users.insert(newUser).then((insertedUser) => {
              res.json({
                username: insertedUser.username,
                password: insertedUser.password,
                _id: insertedUser._id,
              });
            });
          });
        }
      }).then(() => db.close());
  } else {
    res.status(400);
    const err = new Error(error);
    next(err);
  }

});

router.post('/signin', (req, res, next) => {

  const { error } = userSchema.validate(req.body);

  if (error === undefined) {
    users.findOne({ username: req.body.username})
      .then((user) => {
        if (user) {
        // user found in the db
        // verify password then respond with a jwt
          bcrypt.compare(req.body.password, user.password, (error, result) => {
            if (!result) {
              loginError(res, next);
            } else {
              // successfully signed in
              const payload = {
                _id: user._id,
                username: user.username,
                role: user.role,
              };
              jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1d',
              }, (err, token) => {
                if (err) {
                  loginError(res, next);
                } else {
                  res.json({
                    token: token
                  });
                }
              });
            }
          });
        } else {
        // user not found in db
          loginError(res, next);
        }
      });
  } else {
    // validation error on the username or password
    // throw a login error
    loginError(res, next);
  }
});

module.exports = router;