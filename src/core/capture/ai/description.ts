import { generateText } from 'ai';
import { localStorage } from '@/lib/browser-api';
import { logger } from '@/lib/logger';
import type { DOMContext } from '../dom/context';
import { serializeDOMContext } from '../dom/context';
import { getLanguageSuffix, STEP_DESCRIPTION_PROMPT } from './prompts';
import { createModel } from './provider';

export async function getAIDescription(
  domContext: DOMContext,
  provider: string,
  model: string,
  apiKey: string,
): Promise<string | null> {
  try {
    const settings = await localStorage.get(['aiLanguage']);
    const locale = (settings.aiLanguage as string) || 'en';
    const languageInstruction = locale.startsWith('ro')
      ? '\nIMPORTANT — LIMBA OBLIGATORIE: Scrie exclusiv în limba română. Folosește diacriticele românești ă, â, î, ș și ț. Nu răspunde în engleză, chiar dacă textul interfeței sau exemplele sunt în engleză.'
      : getLanguageSuffix(locale);
    const { text } = await generateText({
      model: createModel(provider, model, apiKey),
      prompt:
        STEP_DESCRIPTION_PROMPT.replace('{{context}}', serializeDOMContext(domContext)) + languageInstruction,
      maxOutputTokens: 100,
    });
    return text.trim().replace(/^"|"$/g, '') || null;
  } catch (err) {
    logger.error('AI description failed, using fallback', err);
    return null;
  }
}
