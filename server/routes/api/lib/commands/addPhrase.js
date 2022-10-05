const axios = require('axios').default;
const monk = require('monk');

//eslint-disable-next-line no-unused-vars
module.exports = (msg, args='no args') => {

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_API_URL = 'https://api.telegram.org';
  const LAENDRUN_API_URL = 'https://api.laendrun.ch/api/v1/8boules/add';
  const CHAT_ID = msg.chat.id;
  // const MESSAGE_ID = msg.message_id;
  const url = process.env.DB_URL;
  const db = monk(url);
  const ok_users = db.get('authorized_telegram_users');

  // compare msg.from.username to usernames in db
  ok_users.findOne({ username: msg.from.username}).then((doc) => {
    // if user is authorized
    if (doc) {
      // -> make request to my api to add the phrase

      let bullshit = '';
      // console.log(Object.entries(args));
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(args)) {
        bullshit = `${bullshit} ${value}`;
      }

      bullshit = bullshit.substring(1);
      
      if (bullshit != '') {
        axios.post(LAENDRUN_API_URL, {'bullshit':`${bullshit}`}, {
          headers: {
            'Authorization': `Bearer ${process.env.TELEGRAM_APP_TOKEN}`
          }
        }).then((response) => {
          // send a message back to tell the user the phrase was added to the db
  
          const TEXT = encodeURI(`${response.data.bullshit} added to the db`);
          const request = `${TELEGRAM_API_URL}/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${TEXT}`;

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
      }else{
        const TEXT = encodeURI('The message was empty, I didn\'t add anything to the db');
        const request = `${TELEGRAM_API_URL}/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${TEXT}`;

        axios.post(request, {})
        // eslint-disable-next-line no-unused-vars
          .then((response) => {
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      // if user is unauthorized -> you're not authorized to use this command, contact the bot creator

      const TEXT = `You're not an authorized user, please contact the bot creator with your username (${msg.from.username})`;
      const request = `${TELEGRAM_API_URL}/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${TEXT}`;

      axios.post(request, {})
      // eslint-disable-next-line no-unused-vars
        .then((response) => {
          console.log(`unauthorized user : ${msg.from.username}`);
        })
        .catch((error) => {
          console.log(error);
        });

    }


  }).then(() => db.close());  

};