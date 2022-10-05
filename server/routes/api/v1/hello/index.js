const router = require('express').Router();

router.get('/', (req, res) =>{
  res.json({
    message: 'Hello'
  });
});

router.get('/:name', (req, res) => {
  const hello = 'Hello ' + req.params.name;
  res.json({
    message: hello
  });
});

module.exports = router;