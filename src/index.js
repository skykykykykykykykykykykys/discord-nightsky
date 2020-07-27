// require the discord.js module
const config = require("../config.json");

const {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
} = require("discord-akairo");

class BotClient extends AkairoClient {
  constructor() {
    super(
      {
        // Options for Akairo go here.
        ownerID: ["195954094282637312", "213603497910730762"],
      },
      {
        // Options for discord.js goes here.
        disableMentions: "everyone",
      }
    );

    this.commandHandler = new CommandHandler(this, {
      // Options for the command handler goes here.
      directory: "src/commands/",
      // eslint-disable-next-line no-inline-comments
      prefix: config.prefix, // or ['?', '!']
    });
    this.commandHandler.loadAll();
    this.listenerHandler = new ListenerHandler(this, {
      directory: "src/listeners/",
    });

    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
    });
  }
}

const client = new BotClient();
client.login(config.token);
