const axios = require('axios').default;

// eslint-disable-next-line no-unused-vars
module.exports = (msg, args='no args') => {

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const REQUEST_URL = 'https://api.telegram.org';
  const LAENDRUN_API_URL = 'https://api.laendrun.ch/api/v1/8boules/get';
  const CHAT_ID = msg.chat.id;
  const TEXT = 'getphrases command received';
  let text = '';
  // const request = `${REQUEST_URL}/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}`;
  const request = `${REQUEST_URL}/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${TEXT}`;

  axios.get(LAENDRUN_API_URL, {
    headers: {
      'Authorization': `Bearer ${process.env.TELEGRAM_APP_TOKEN}`
    }
  }).then((response) => {
    const bullshits = response.data.bullshits;

    bullshits.forEach((bullshit) => {
      text = `${text}\n${bullshit.bullshit}`;
    });

  }).catch((error) => {
    console.log(error);
  });

  axios.post(request, {})
    .then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    })
  // eslint-disable-next-line no-unused-vars
    .then((response) => {
      console.log(msg.from.username);
      console.log('command : getphrases');
    })
    .catch((error) => {
      console.log(error);
    });
  
};