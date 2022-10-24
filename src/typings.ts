export interface Config {
  discord: {
    token: string;
    channelId: string;
  };
  telegram: {
    token: string;
    chatId: string;
  };
  webhook: {
    token: string;
    id: string;
  };
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DISCORD_TOKEN: string;
      readonly DISCORD_CHANNEL_ID: string;
      readonly DISCORD_WEBHOOK_TOKEN: string;
      readonly DISCORD_WEBHOOK_ID: string;
      readonly TELEGRAM_TOKEN: string;
      readonly TELEGRAM_CHAT_ID: string;
    }
  }
}
