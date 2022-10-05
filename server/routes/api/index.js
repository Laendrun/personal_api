const express = require('express');

// Routers
const v1 = require('./v1/');
// const v2 = require('./v2/');
//const local = require('./local/');
const router = express.Router();

router.use('/v1', v1);
// router.use('/v2', v2);
//router.use('/local', local);

module.exports = router;