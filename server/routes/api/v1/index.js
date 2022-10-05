const express = require('express');
const { isLoggedIn, notAnApp } = require('../middlewares');

const token = require('./token/');
const hello = require('./hello/');
const auth = require('./auth/');
const eightBall = require('./8ball/');
const telegram = require('./telegram/');
const text = require('./text/');
const users = require('./users/');
const articles = require('./articles/');

const router = express.Router();

router.use('/hello/', hello);
router.use('/auth/', auth);
router.use('/8boules/', eightBall);
router.use('/telegram/', telegram);
router.use('/token/', isLoggedIn, notAnApp, token);
router.use('/users/', isLoggedIn, users);
router.use('/text/', text);
router.use('/articles/', articles);

module.exports = router;