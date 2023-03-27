export interface IConfig {
  openai_api_key: string;
  model: string;
  chatPrivateTiggerKeyword: string;
  chatTiggerRule: string;
  disableGroupMessage: boolean;
  prompt: string;
  blockedNames: string[];
  max_tokens: number;
}
