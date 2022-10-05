/* eslint-disable no-prototype-builtins */
const express = require('express');

const eightball = require('../../lib/commands/eightBall.js');
const start = require('../../lib/commands/start.js');
const addphrase = require('../../lib/commands/addPhrase.js');
const sticker = require('../../lib/commands/sticker.js');
const addStickerPack = require('../../lib/commands/addStickerPack.js');
const getStickerPacks = require('../../lib/commands/getStickerPacks.js');
const getradios = require('../../lib/commands/getradios.js');

const router = express.Router();

router.post('/fix', (req, res) => {
  res.status(200);
  res.send();
}) ;

router.post('/', (req, res) => {

  let MESSAGE;
  
  if (req.body.hasOwnProperty('message')) {
    MESSAGE = req.body.message;
    //console.log(MESSAGE.chat.id);

    if (req.body.message.hasOwnProperty('text')) {	
      const commands = {
        eightball: eightball,
        addphrase: addphrase,
        start: start,
        sticker: sticker,
        addstickerpack: addStickerPack,
        getstickerpacks: getStickerPacks,
        getradios: getradios,
      };

      let text;
      let tokens;
      let command;
    
      text = req.body.message.text;
      tokens = text.split(' ');
      command = tokens.shift();
      
      if (command.charAt(0) === '/'){
        // Message is a command
        if (command.includes('@')) {
  
          command = command.split('@');
          command = command[0].substring(1);
  
          console.log('Command : ' + command);
        } else {
          command = command.substring(1);
        }
  
        if (command == 'addphrase' && tokens == ''){
          if (req.body.message.hasOwnProperty('reply_to_message')){
            if ( req.body.message.reply_to_message.hasOwnProperty('text')){
              tokens = req.body.message.reply_to_message.text.split(' ');
            }
          }
        }
  
        if (commands.hasOwnProperty(command)) {
          commands[command](MESSAGE, tokens);
        } else {
          console.log('unknown command : ' + command);
        }
        
        // valid command
        res.status(200);
        res.send();
      }else{
        // message is not a command
        res.status(200);
        res.send();
      }
    }else{
      res.status(200);
      res.send();
    }
  }else{
    res.status(200);
    res.send();
  }
 
});


module.exports = router;