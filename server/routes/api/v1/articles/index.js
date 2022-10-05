const router = require('express').Router();

const request = require('request');
const cheerio = require('cheerio');

async function main(req, res, art, lngId) {
  let text = '';

  request(`https://www.dabag.ch/?q=${art}&srv=search&lngId=${lngId}`, function (error, response, body) {
    if (error) {
      console.log(error);
    }
    else if (body) {
      const $ = cheerio.load(body);
      text = `${$('.stufe13-title').text()} - ${$('.stufe13-artNr').text()}`;
      res.json({
        art_desc: text
      });
    }
    else {
      console.log('No body');
    }
  });
}

async function car(req, res, art, data_id){
  let url = `https://www.dabag.ch/?srv=search&pg=det&artId=${data_id}&markId=${art}`;
  //console.log(url);

  request(url, function (error, response, body) {
    if (error) {
      console.log(error);
    } else if (body) {
      const $ = cheerio.load(body);

      let div = $(`[data-filter-1=${art}]`);

      let three = div.data('filter-9') == null ? false : true;
      let a = null, b = null, c = null, z1 = null, z2 = null, z3 = null;

      if (three) {
        a = div.data('filter-4');
        b = div.data('filter-5');
        c = div.data('filter-6');
        z1 = div.data('filter-7');
        z2 = div.data('filter-8');
        z3 = div.data('filter-9');
      } else {
        a = div.data('filter-4');
        b = div.data('filter-5');
        z1 = div.data('filter-6');
        z2 = div.data('filter-7');
      }
      res.json({
        a,
        b,
        c,
        z1,
        z2,
        z3
      });
    } else {
      console.log('No body');
    }
  });

}

async function caract(req, res, art) {

  request(`https://www.dabag.ch/?q=${art}&srv=search&lngId=2`, function (error, response, body) {
    if (error) {
      console.log('Error' + error);
    }
    else if (body) {
      const $ = cheerio.load(body);
      let data_id = $('.stufe13-text-box').data('id').split('&')[0];
      car(req, res, art, data_id);
    }
    else {
      console.log('No body');
    }
  });
}

router.get('/designation/:art_num/:lngId', (req, res) =>{
  main(req, res, req.params.art_num, req.params.lngId);
});

router.get('/designation/:art_num/', (req, res) => {
  main(req, res, req.params.art_num, 2);
});

router.get('/caract/:art_num', (req, res) => {
  caract(req, res, req.params.art_num);
});

module.exports = router;