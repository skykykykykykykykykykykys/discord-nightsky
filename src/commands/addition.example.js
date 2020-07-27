const {Command} = require('discord-akairo');

class AddCommand extends Command {
  constructor() {
    super('add', {
      aliases : [ 'add' ],
    });
  }

  * args() {
    // Notice: no `id` necessary!
    // Also notice: `yield` must be used.
    const x = yield {type : 'number'};
    const y = yield {
      type : 'number',
    };

    // When finished.
    return {x, y};
  }

  exec(message) {
    let sum = 0
    const slicedArr = (message.toString()).split(' ').slice(1)
    console.log(slicedArr)
    for (const item in slicedArr) {
      console.log('Argumen ke ', [ item ], ' -- ', slicedArr[item])
      sum += parseInt(slicedArr[item])
      console.log(sum)
    }

    return message.reply(`The sum is ${sum}!`);
  }
}

module.exports = AddCommand;