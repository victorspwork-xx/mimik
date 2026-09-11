import type { VoiceProvider } from './transcribe';

export const VOICE_KEY_SETTINGS = ['voiceProvider', 'voiceApiKey', 'aiProvider', 'aiApiKey'] as const;

export interface VoiceKeySettings {
  voiceProvider?: unknown;
  voiceApiKey?: unknown;
  aiProvider?: unknown;
  aiApiKey?: unknown;
}

export type VoiceApiKeySource = 'voice' | 'ai' | 'none';

export interface ResolvedVoiceApiKey {
  provider: VoiceProvider;
  apiKey: string;
  source: VoiceApiKeySource;
}

function trimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeVoiceProvider(value: unknown): VoiceProvider {
  if (value === 'groq' || value === 'deepseek') return value;
  return 'openai';
}

export function resolveVoiceApiKey(settings: VoiceKeySettings): ResolvedVoiceApiKey {
  const provider = normalizeVoiceProvider(settings.voiceProvider);
  const own = trimmed(settings.voiceApiKey);
  if (own) return { provider, apiKey: own, source: 'voice' };

  const shared = trimmed(settings.aiApiKey);
  const aiProvider = trimmed(settings.aiProvider) || 'openai';
  if (provider === 'deepseek' && aiProvider === 'deepseek' && shared) return { provider, apiKey: shared, source: 'ai' };
  if (provider !== 'openai' || aiProvider !== 'openai' || !shared) {
    return { provider, apiKey: '', source: 'none' };
  }

  return { provider, apiKey: shared, source: 'ai' };
}

export function hasVoiceApiKey(settings: VoiceKeySettings): boolean {
  return resolveVoiceApiKey(settings).apiKey.length > 0;
}
