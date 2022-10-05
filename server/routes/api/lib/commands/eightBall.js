const axios = require('axios').default;

// eslint-disable-next-line no-unused-vars
module.exports = (msg, args='no args') => {


  // use axios to call my own API to get an 8boules response
  // then send the response with a message to the telegram API

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_API_URL = 'https://api.telegram.org';
  const LAENDRUN_API_URL = 'https://api.laendrun.ch/api/v1/8boules';
  const CHAT_ID = msg.chat.id;
  const MESSAGE_ID = msg.message_id;
  const laendrunRequest = `${LAENDRUN_API_URL}`;

  axios.get(laendrunRequest)
    .then((response) => {

      const TEXT = encodeURI(response.data.answer);
      const sendMessage = `${TELEGRAM_API_URL}/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${TEXT}`;

      axios.post(sendMessage, {})
      // eslint-disable-next-line no-unused-vars
        .then((response) => {
        })
        .catch((error) => {
          console.log(error);
        });

      const deleteMessage = `${TELEGRAM_API_URL}/bot${TOKEN}/deleteMessage?chat_id=${CHAT_ID}&message_id=${MESSAGE_ID}`;
      axios.post(deleteMessage, {})
        // eslint-disable-next-line no-unused-vars
        .then((response) => {
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
  
};