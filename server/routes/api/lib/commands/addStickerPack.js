const axios = require('axios').default;
const monk = require('monk');

// eslint-disable-next-line no-unused-vars
module.exports = (msg, args='no args') => {

  const url = process.env.DB_URL;
  const db = monk(url);
  const stickers = db.get('telegram_stickers');

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const REQUEST_URL = 'https://api.telegram.org';
  const CHAT_ID = msg.chat.id;
  //const sticker_file_id = 'CAACAgQAAxUAAWL73b8AAYpKw9JOs-al_C_-7C5iPgACswsAAiZJuVP4WE_Rh1F4FykE';
  //const test_chat_id = -1001747607932;
  const STICKER_SET_ID = Object.entries(args)[0] === undefined ? 'No sticker pack sent' : Object.entries(args)[0][1];

  // ( condition ? true : false )

  const getStickerSet = `${REQUEST_URL}/bot${TOKEN}/getStickerSet?name=${STICKER_SET_ID}`;
  //let sendSticker = `${REQUEST_URL}/bot${TOKEN}/sendSticker?chat_id=${CHAT_ID}&sticker=`;

  if (msg.from.username == 'Laendrun') {
    axios.get(getStickerSet, {})
    // eslint-disable-next-line no-unused-vars
      .then((response) => {
        let sticker_set_name = response.data.result.title;
        response.data.result.stickers.forEach((sticker) => {
          let sticker_file_id = sticker.file_id;
          // sticker.file_id
          stickers.findOne({file_id: sticker_file_id})
            .then((sticker) => {
              if (sticker === null) {
                stickers.insert({
                  sticker_set: STICKER_SET_ID,
                  sticker_set_name: sticker_set_name,
                  file_id: sticker_file_id
                  // eslint-disable-next-line no-unused-vars
                }).then((sticker) => {})
                  .catch((error) => {
                    console.log(error);
                  });
              }
            }).catch((error) => {
              console.log(error);
            });
        });
        let text = encodeURI(`Sticker pack added, ${STICKER_SET_ID}`);
        axios.post(`${REQUEST_URL}/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${text}`, {})
          // eslint-disable-next-line no-unused-vars
          .then((response) => {})
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
        let text = encodeURI(`Sticker pack not found, ${STICKER_SET_ID}`);
        axios.post(`${REQUEST_URL}/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${text}`, {})
        // eslint-disable-next-line no-unused-vars  
          .then((response) => {})
          .catch((error) => {
            console.log(error);
          });
      });
  } else {
    let text = encodeURI(`User not allowed, ${msg.from.username}`);
    axios.post(`${REQUEST_URL}/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${text}`, {})
    // eslint-disable-next-line no-unused-vars  
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  }

};