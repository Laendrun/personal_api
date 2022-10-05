const express = require('express');
const monk = require('monk');
const Joi = require('joi');
const { isLoggedIn } = require('../../middlewares');

const url = process.env.DB_URL;
const db = monk(url);
const bullshit = db.get('bullshit');

const idSchema = Joi.object({
  id: Joi.string()
    .alphanum()
    .min(24)
    .max(24)
    .required()
});

const router = express.Router();

router.get('/', (req, res) => {

  bullshit.aggregate([{ $sample: { size: 1 } }])
    .then((answer) => {
      res.json({
        answer: answer[0].bullshit
      });
    });
});

router.post('/add', isLoggedIn, (req, res) => {
  bullshit.insert(req.body)
    .then((bullshit) => {
      res.json(bullshit);
    }).catch((err) => {
      res.json(err);
    }).then(() => db.close());
});

router.get('/get', isLoggedIn, (req, res) => {
  bullshit.find()
    .then((bullshits) => {
      res.json({
        bullshits: bullshits
      });
    });
});

router.delete('/:id', isLoggedIn, (req, res) => {
  const { error } = idSchema.validate({id : req.params.id});

  if(error === undefined) {
    bullshit.remove({_id: req.params.id})
      .then(() => {
        res.json({
          message: 'Record successfully deleted'
        });
      }).then(() => db.close());
  }else{
    res.json({
      error: 'check the ID\'s format'
    });
  }
});

module.exports = router;