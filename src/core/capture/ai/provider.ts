import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';
const OMNIROUTE_BASE_URL = 'http://localhost:20128/v1';

export function createModel(provider: string, model: string, apiKey: string) {
  if (provider === 'anthropic') return createAnthropic({ apiKey })(model);
  if (provider === 'deepseek') return createOpenAI({ apiKey, baseURL: DEEPSEEK_BASE_URL, name: 'deepseek' })(model);
  if (provider === 'omniroute') return createOpenAI({ apiKey: apiKey || 'omniroute-local', baseURL: OMNIROUTE_BASE_URL, name: 'omniroute' })(model);
  return createOpenAI({ apiKey })(model);
}
