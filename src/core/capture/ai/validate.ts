import { logger } from '@/lib/logger';

export type KeyValidation =
  | { valid: true; message: string }
  | { valid: false; reason: 'rejected' | 'network'; message: string };

const REQUEST_TIMEOUT_MS = 10_000;

const ENDPOINTS: Record<string, { url: string; headers: (key: string) => Record<string, string> }> = {
  openai: {
    url: 'https://api.openai.com/v1/models',
    headers: (key) => ({ Authorization: `Bearer ${key}` }),
  },
  anthropic: {
    url: 'https://api.anthropic.com/v1/models',
    headers: (key) => ({
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    }),
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/models',
    headers: (key) => ({ Authorization: `Bearer ${key}` }),
  },
  deepseek: {
    url: 'https://api.deepseek.com/models',
    headers: (key) => ({ Authorization: `Bearer ${key}` }),
  },
  omniroute: {
    url: 'http://localhost:20128/v1/models',
    headers: (key): Record<string, string> => (key ? { Authorization: `Bearer ${key}` } : {}),
  },
};

export async function validateApiKey(provider: string, apiKey: string): Promise<KeyValidation> {
  const endpoint = ENDPOINTS[provider];
  if (!endpoint) {
    logger.error('No API key validation endpoint for provider', provider);
    return { valid: false, reason: 'network', message: 'Provider necunoscut.' };
  }
  try {
    const res = await fetch(endpoint.url, {
      headers: endpoint.headers(apiKey),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (res.ok) return { valid: true, message: 'Conexiunea cu furnizorul AI funcționează.' };
    if (res.status === 401 || res.status === 403) return { valid: false, reason: 'rejected', message: 'Furnizorul a respins cheia API.' };
    return { valid: false, reason: 'network', message: `Furnizorul a răspuns cu codul ${res.status}.` };
  } catch (err) {
    logger.error('API key validation request failed', err);
    return { valid: false, reason: 'network', message: 'Furnizorul AI nu poate fi contactat.' };
  }
}
