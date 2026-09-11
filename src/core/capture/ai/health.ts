import { generateText } from 'ai';
import { createModel } from './provider';

export type AIGenerationHealth =
  | { ok: true; message: string }
  | { ok: false; message: string };

/**
 * Tests the exact text-generation path used by guide descriptions. A models-list
 * request alone cannot prove that the configured model can generate text.
 */
export async function testAIGeneration(provider: string, model: string, apiKey: string): Promise<AIGenerationHealth> {
  try {
    const { text } = await generateText({
      model: createModel(provider, model, apiKey),
      prompt: 'Răspunde exact cu: OK',
      maxOutputTokens: 16,
    });
    if (!text.trim()) return { ok: false, message: 'Furnizorul AI nu a returnat niciun text.' };
    return { ok: true, message: `Generarea AI funcționează (${text.trim().slice(0, 40)}).` };
  } catch (error) {
    const detail = error instanceof Error ? error.message.replace(/Bearer\s+\S+/gi, 'Bearer [redacted]').slice(0, 180) : '';
    return {
      ok: false,
      message: detail ? `Generarea AI a eșuat: ${detail}` : 'Generarea AI a eșuat. Verifică furnizorul, modelul și cheia API.',
    };
  }
}
