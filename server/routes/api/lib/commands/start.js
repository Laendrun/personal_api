const axios = require('axios').default;

// eslint-disable-next-line no-unused-vars
module.exports = (msg, args='no args') => {

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const REQUEST_URL = 'https://api.telegram.org';
  const CHAT_ID = msg.chat.id;
  const TEXT = 'Start command received';
  const request = `${REQUEST_URL}/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${TEXT}`;

  axios.post(request, {})
  // eslint-disable-next-line no-unused-vars
    .then((response) => {
      console.log(msg.from.username);
      console.log('command : start');
    })
    .catch((error) => {
      console.log(error);
    });
  
};