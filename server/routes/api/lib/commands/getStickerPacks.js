const axios = require('axios').default;
const monk = require('monk');

const url = process.env.DB_URL;
const db = monk(url);
const stickers = db.get('telegram_stickers');

// eslint-disable-next-line no-unused-vars
module.exports = (msg, args='no args') => {

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const REQUEST_URL = 'https://api.telegram.org';
  const CHAT_ID = msg.chat.id;
  //const STICKER_ID = 'CAACAgQAAxUAAWL73b8AAYpKw9JOs-al_C_-7C5iPgACswsAAiZJuVP4WE_Rh1F4FykE';
  //const TEXT = encodeURI('Sticker packs saved in the db : sticker packs list');
  let request = `${REQUEST_URL}/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=`;

  stickers.aggregate([
    {
      $group: { _id: '$sticker_set_name' }
    }
  ]).then((packs) => {
    let text='';
    packs.forEach((pack) => {
      console.log(pack._id);
      text = `${text}${pack._id}\n`;
    });
    text = encodeURI(text);

    request = `${request}${text}`;
    axios.post(request, {})
    // eslint-disable-next-line no-unused-vars
      .then((response) => {
      })
      .catch((error) => {
        console.log(error);
      });

  }).catch((error) => {
    console.log(error);
  });
};