const jwt = require('jsonwebtoken');
const monk = require('monk');

const url = process.env.DB_URL;
const db = monk(url);
const tokens = db.get('tokens');

function checkTokenSetUser(req, res, next) {
// this middleware checks if the Authorization header is set
// if the Authorization exists and contains a token
// sets req.user as the payload from the decoded token
// add the app token validation and set req.appT (req.app has a default value as its an express app) instead of req.user

  const authHeader = req.get('Authorization');

  // check for authorization header
  if (authHeader) {
    // get the second element of the authorization header (JWT)
    // the 1st element being 'Bearer'
    const token = authHeader.split(' ')[1];
    if (token) {
      // if token exists, verify it
      jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
        if (error) {
          console.log(error);
          // error verifying the token
          unauthorized(res, next);
        }
        if (payload.role == 'app') {
          // If payload.role = 'app this means it's an app token so
          // Check if token in db
          tokens.findOne({ appName: payload.appName }).then((doc) => {
            if (doc) {
              // yes -> next()
              req.appT = payload;
              next();
            } else {
              // no -> unauthorized
              unauthorized(res, next);
            }
          });
        } else {
          // if payload.role is something else than 'app'
          req.user = payload;
          next();
        }
      });
    } else {
      next();
    }
  } else {
    next();
  }
}

function isLoggedIn(req, res, next) {
  if (req.user || req.appT) {
    // is the user making the request loggedIn, as an app or a user
    next();
  } else {
    // the user making the request is neither an app or a user
    unauthorized(res, next);
  }
}

function notAnApp(req, res, next) {
  if (req.appT) {
    // check if there are app infos saved to the req
    // if there is, this means it's an app --> unauthorized
    unauthorized(res, next);
  } else {
    // no app infos --> not an app, authorized
    next();
  }
}

function isAdmin(req, res, next) {
  if (req.user.role == 'admin') {
    // role == admin -> authorized
    next();
  } else {
    // role <> admin -> unauthorized
    unauthorized(res, next);
  }
}

module.exports = {
  checkTokenSetUser,
  isLoggedIn,
  isAdmin,
  notAnApp,
};

function unauthorized(res, next) {
  res.status(401);
  res.json({
    message: '🚫 Unauthorized 🚫',
    status: 401
  });
  //const error = new Error('🚫 Unauthorized 🚫');
  //next(error);
}