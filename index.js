require('dotenv').config();

const assert = require('assert');
const Telegraf = require('telegraf');
const { each } = require('lodash');
const commands = require('./commands');
const createZombie = require('./zombie');

const debug = require('debug')('telegram-bot-github');

const octokit = require('@octokit/rest')({
  debug: true,
});

const {
  TELEGRAM_BOT_TOKEN,
  NODE_ENV,
  GITHUB_TOKEN,
  TELEGRAM_TARGET_CHAT_ID,
} = process.env;

assert(TELEGRAM_BOT_TOKEN, 'TELEGRAM_BOT_TOKEN');

// GitHub app
octokit.authenticate({
  type: 'token',
  token: GITHUB_TOKEN,
});

const botUserId = TELEGRAM_BOT_TOKEN.split(/:/)[0];

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.telegram.getMe().then(botInfo => {
  bot.options.username = botInfo.username;
});

bot.use(createZombie());

const handleCommandError = (ctx, error) => {
  console.error(`Unhandled error when processing message`);
  console.error(ctx.message);
  console.error(error.stack);

  ctx.reply(`Something crashed and I'm not sure why. Sorry!`);

  if (NODE_ENV !== 'production') {
    ctx.reply(error.stack);
  }
};

const handleCommand = async (handler, ctx) => {
  const isPm = ctx.chat.id > 0;

  console.log({ chatId: ctx.chat.id });

  if (ctx.chat.id !== +TELEGRAM_TARGET_CHAT_ID) {
    return;
  }

  return handler({
    ctx,
    octokit,
    userId: ctx.from.id.toString(),
    botUserId,
    username: ctx.from.username,
    isPm,
  });
};

each(commands, (handler, name) => {
  debug(`Registering command, ${name}`);

  bot.command(name, ctx =>
    handleCommand(handler, ctx).catch(error => handleCommandError(ctx, error))
  );
});

bot.startPolling();
