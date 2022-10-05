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
  const MESSAGE_ID = msg.message_id;
  let request = `${REQUEST_URL}/bot${TOKEN}/sendSticker?chat_id=${CHAT_ID}&sticker=`;

  stickers.aggregate([{ $sample: { size: 1 } }])
    .then((sticker) => {

      let sendSticker;
      sendSticker = `${request}${sticker[0].file_id}`;

      axios.post(sendSticker, {})
      // eslint-disable-next-line no-unused-vars
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        });

      const deleteMessage = `${REQUEST_URL}/bot${TOKEN}/deleteMessage?chat_id=${CHAT_ID}&message_id=${MESSAGE_ID}`;
      axios.post(deleteMessage, {})
      // eslint-disable-next-line no-unused-vars
        .then((response) => {
        })
        .catch((error) => {
          console.log(error);
        });
    });
  
};