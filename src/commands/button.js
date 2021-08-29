const { MessageButton } = require('discord-buttons');

module.exports = {
    name: 'buttons',
    execute(message, args, client)  {
        let button = new MessageButton()
          .setStyle('red') //default: blurple
          .setLabel('My First Button!') //default: NO_LABEL_PROVIDED
          .setID('click_to_function') //note: if you use the style "url" you must provide url using .setURL('https://example.com')
          .setDisabled(); //disables the button | default: false

        message.channel.send('This is discord buttons, these will not be used as much', button);
    }
}