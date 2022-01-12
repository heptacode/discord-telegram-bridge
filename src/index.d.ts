export interface Config {
  discord: {
    token: string;
    channelId: string;
  };
  telegram: {
    token: string;
    chatId: number;
  };
  webhook: {
    token: string;
    id: string;
  };
}
