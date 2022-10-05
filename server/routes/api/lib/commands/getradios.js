const axios = require('axios').default;

// eslint-disable-next-line no-unused-vars
module.exports = (msg, args='no args') => {

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const REQUEST_URL = 'https://api.telegram.org';
  const CHAT_ID = msg.chat.id;
  let text = encodeURI('https://radio.slyinc.ch/public/paillarde\n\nhttps://radio.slyinc.ch/public/onlyhans\n&disable_web_page_preview=true');
  const request = `${REQUEST_URL}/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${text}`;

  axios.post(request, {})
  // eslint-disable-next-line no-unused-vars
    .then((response) => {
    })
    .catch((error) => {
      console.log(error);
    });
};