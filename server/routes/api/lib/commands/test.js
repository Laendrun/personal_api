const axios = require('axios').default;

// eslint-disable-next-line no-unused-vars
module.exports = (msg, args='no args') => {

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const REQUEST_URL = 'https://api.telegram.org';
  const CHAT_ID = msg.chat.id;
  let text = encodeURI('https://radio.slyinc.ch/public/paillarde\nhttps://radio.slyinc.ch/public/onlyhans\n');
  const request = `${REQUEST_URL}/bot${TOKEN}/sendSticker?chat_id=${CHAT_ID}&sticker=${text}`;

  axios.post(request, {})
  // eslint-disable-next-line no-unused-vars
    .then((response) => {
    })
    .catch((error) => {
      console.log(error);
    });
};

// https://api.telegram.org/bot5239309236:AAGmmYjmvlrQuvZRDB51mqsAujbaQZfn4ZI/sendMessage?chat_id=-1001528275013&text=test