const router = require('express').Router();
const monk = require('monk');
// const { isLoggedIn } = require('../../middlewares');

const url = process.env.DB_URL;
const db = monk(url);
const texts = db.get('texts');


router.get('/text_ids/', (req, res) => {
  //texts.find({}, 'text_id')
  texts.aggregate([
    {
      $project: {
        text_id: 1
      }
    },
    {
      $group: {
        _id: '$text_id'
      }
    }
  ])
    .then((text_ids) => {
      res.json({
        text_ids: text_ids
      });
    });
});

router.get('/langs/', (req, res) => {
  texts.aggregate([
    {
      $project: {
        lang: 1
      }
    },
    {
      $group: {
        _id: '$lang'
      }
    }
  ])
    .then((langs) => {
      res.json({
        langs: langs
      });
    });
});

router.get('/:lang/:page', (req, res) => {

  const lang = req.params.lang || 'fr';
  const page = req.params.page || 'home';

  // Request DB for all texts in the specified lang for the specified page

  const query = { lang: lang, page: page };

  texts.find(query)
    .then((texts) => {
      res.json({
        texts
      });
    }).catch((err) => {
      res.json(err);
    }).then(() => db.close());
});

router.get('/:lang/', (req, res) => {

  const lang = req.params.lang;
  
  // Request DB for all texts in the specified lang for the specified page

  const query = { lang: lang};

  texts.find(query)
    .then((texts) => {
      res.json({
        texts
      });
    }).catch((err) => {
      res.json(err);
    }).then(() => db.close());
});

router.post('/', /*isLoggedIn,*/ (req, res) => {

  texts.insert(req.body)
    .then((text) => {
      res.json(text);
    }).catch((err) => {
      res.json(err);
    }).then(() => db.close());
});

module.exports = router;