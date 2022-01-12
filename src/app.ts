import { Client, Message, WebhookClient } from "discord.js";
import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
import { log } from "./modules/logger";
import { Config } from "./";

const config: Config = require("../env.json");

const client: Client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_WEBHOOKS"] });

const webhookClient = new WebhookClient({ id: config.webhook.id, token: config.webhook.token });
const telegramBot = new TelegramBot(config.telegram.token, { polling: true });

client.once("ready", async () => {
  await client.user.setPresence({ status: "online", activities: [{ type: "WATCHING", name: "Logcat" }] });

  log.i("Discord Ready");
});

client.login(config.discord.token);

client.on("messageCreate", async (message: Message) => {
  try {
    if (message.channel.id === config.discord.channelId && message.author.bot === false) {
      const mentioned_usernames = [];
      for (const mention of message.mentions.users) {
        mentioned_usernames.push("@" + mention[1].username);
      }
      const attachmentUrls = [];
      for (const attachment of message.attachments) {
        attachmentUrls.push(attachment[1].url);
      }
      const finalMessageContent = message.content.replace(/<@.*>/gi, "");
      await telegramBot.sendMessage(config.telegram.chatId, `${message.author.username}: ${finalMessageContent}${attachmentUrls.join(" ")}${mentioned_usernames.join(" ")}`);
    }
  } catch (error) {
    log.e(error);
  }
});

telegramBot.on("message", async (message) => {
  try {
    if (/*message.chat.id === config.telegram.chatId &&*/ message.from.is_bot == false) {
      const userProfilePhotos: TelegramBot.UserProfilePhotos = await telegramBot.getUserProfilePhotos(message.from.id);

      let profileURL: string = "";
      if (userProfilePhotos.total_count > 0) {
        const file = await telegramBot.getFile(userProfilePhotos.photos[0][0].file_id);
        profileURL = `https://api.telegram.org/file/bot${config.telegram.token}/${file.file_path}`;
      } else profileURL = "https://telegram.org/img/t_logo.png";

      if (message.document || message.photo || message.sticker) {
        if (message.document) {
          const document: TelegramBot.File = await telegramBot.getFile(message.document.file_id);
          const documentUrl: string = `https://api.telegram.org/file/bot${config.telegram.token}/${document.file_path}`;
          await webhookClient.send({
            username: message.from.first_name,
            avatarURL: profileURL,
            files: [documentUrl],
            content: message.caption,
          });
        }
        if (message.sticker) {
          const sticker: TelegramBot.File = await telegramBot.getFile(message.sticker.file_id);
          const stickerUrl: string = `https://api.telegram.org/file/bot${config.telegram.token}/${sticker.file_path}`;
          await webhookClient.send({
            username: message.from.first_name,
            avatarURL: profileURL,
            files: [stickerUrl],
            content: message.caption,
          });
        }
        if (message.photo) {
          const photo = await telegramBot.getFile(message.photo[0].file_id);
          const photoUrl = `https://api.telegram.org/file/bot${config.telegram.token}/${photo.file_path}`;
          await webhookClient.send({
            username: message.from.first_name,
            avatarURL: profileURL,
            files: [photoUrl],
            content: message.caption,
          });
        }
      } else {
        await webhookClient.send({
          username: message.from.first_name,
          avatarURL: profileURL,
          content: message.text,
        });
      }
    }
  } catch (error) {
    log.e(error);
  }
});

telegramBot.on("error", (error) => {
  log.e(error);
});
