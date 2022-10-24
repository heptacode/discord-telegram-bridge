import { Client, Message } from 'discord.js';
import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { log } from './modules/logger.js';
import { Config } from './typings.js';

const config: Config = {
  discord: {
    token: process.env.DISCORD_TOKEN,
    channelId: process.env.DISCORD_CHANNEL_ID,
  },
  webhook: {
    token: process.env.DISCORD_WEBHOOK_TOKEN,
    id: process.env.DISCORD_WEBHOOK_ID,
  },
  telegram: {
    token: process.env.TELEGRAM_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
  },
};

const client: Client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_WEBHOOKS'] });

const telegramBot = new TelegramBot(config.telegram.token, { polling: true });

client.login(config.discord.token);

client.once('ready', async () => {
  try {
    if (client.user) {
      await client.user.setPresence({
        status: 'online',
        activities: [{ type: 'WATCHING', name: 'Logcat' }],
      });

      log.i('Discord Ready');
    } else {
      throw new Error('client.user is null');
    }
  } catch (error) {
    log.e(`Discord onReady Error > ${error}`);
  }
});

client.on('messageCreate', async (message: Message) => {
  try {
    if (message.channel.id === config.discord.channelId && message.author.bot === false) {
      const mentioned_usernames = [];
      for (const mention of message.mentions.users) {
        mentioned_usernames.push('@' + mention[1].username);
      }
      const attachmentUrls = [];
      for (const attachment of message.attachments) {
        attachmentUrls.push(attachment[1].url);
      }
      const finalMessageContent = message.content.replace(/<@.*>/gi, '');
      await telegramBot.sendMessage(
        config.telegram.chatId,
        `${message.author.username}: ${finalMessageContent}${attachmentUrls.join(
          ' '
        )}${mentioned_usernames.join(' ')}`
      );
    }
  } catch (error) {
    log.e(`Discord onMessageCreate Error > ${error}`);
  }
});

telegramBot.on('message', async message => {
  try {
    if (/*message.chat.id === config.telegram.chatId &&*/ message.from.is_bot == false) {
      const webhook = await client.fetchWebhook(config.webhook.id, config.webhook.token);

      const userProfilePhotos: TelegramBot.UserProfilePhotos =
        await telegramBot.getUserProfilePhotos(message.from.id);

      let profileURL = 'https://telegram.org/img/t_logo.png';
      if (userProfilePhotos?.total_count > 0) {
        const file = await telegramBot.getFile(userProfilePhotos.photos[0][0].file_id);
        profileURL = `https://api.telegram.org/file/bot${config.telegram.token}/${file.file_path}`;
      }

      if (message.document || message.photo || message.sticker) {
        if (message.document) {
          const document: TelegramBot.File = await telegramBot.getFile(message.document.file_id);
          const documentUrl = `https://api.telegram.org/file/bot${config.telegram.token}/${document.file_path}`;
          await webhook.send({
            username: message.from.first_name,
            avatarURL: profileURL,
            files: [documentUrl],
            content: message.caption,
          });
        }
        if (message.sticker) {
          const sticker: TelegramBot.File = await telegramBot.getFile(message.sticker.file_id);
          const stickerUrl = `https://api.telegram.org/file/bot${config.telegram.token}/${sticker.file_path}`;
          await webhook.send({
            username: message.from.first_name,
            avatarURL: profileURL,
            files: [stickerUrl],
            content: message.caption,
          });
        }
        if (message.photo) {
          const photo = await telegramBot.getFile(message.photo[message.photo.length - 1].file_id);
          const photoUrl = `https://api.telegram.org/file/bot${config.telegram.token}/${photo.file_path}`;
          await webhook.send({
            username: message.from.first_name,
            avatarURL: profileURL,
            files: [photoUrl],
            content: message.caption,
          });
        }
      } else {
        await webhook.send({
          username: message.from.first_name,
          avatarURL: profileURL,
          content: message.text,
        });
      }
    }
  } catch (error) {
    log.e(`Telegram onMessage Error > ${error}`);
  }
});

telegramBot.on('error', error => {
  log.e(`Telegram Error > ${error}`);
});
