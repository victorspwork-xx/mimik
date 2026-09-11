import { i18n } from '#imports';
import { localStorage } from '@/lib/browser-api';
import type { ElementMeta } from '@/core/guides/types';

export async function buildFallbackDescription(action: string, meta: ElementMeta): Promise<string> {
  const settings = await localStorage.get(['aiLanguage']);
  const locale = (settings.aiLanguage as string) || i18n.t('meta.locale');
  const target =
    meta.ariaLabel ||
    meta.placeholder ||
    meta.textContent?.slice(0, 80) ||
    meta.altText ||
    meta.name ||
    meta.role ||
    meta.tag;

  const tr = (key: string, substitutions: string[] = []) => i18n.t(key, substitutions, { locale });

  if (action.startsWith('keydown:')) {
    const key = action.split(':')[1];
    return tr('steps.pressKey', [key, target]);
  }

  switch (action) {
    case 'click':
    case 'auxclick':
      if (meta.tag === 'input' && meta.inputType === 'checkbox') return tr('steps.toggleCheckbox', [target]);
      if (meta.tag === 'input' && meta.inputType === 'radio') return tr('steps.selectRadio', [target]);
      if (meta.role === 'switch') return tr('steps.toggleSwitch', [target]);
      if (meta.role === 'checkbox') return tr('steps.toggleCheckbox', [target]);
      if (meta.role === 'radio') return tr('steps.selectRadio', [target]);
      if (meta.href) return tr('steps.clickLink', [target]);
      return tr('steps.click', [target]);
    case 'input':
      if (meta.inputType) return tr('steps.typeIntoField', [meta.inputType, target]);
      return tr('steps.typeInto', [target]);
    case 'copy':
      return tr('steps.copyFrom', [target]);
    case 'paste':
      return tr('steps.pasteInto', [target]);
    case 'cut':
      return tr('steps.cutFrom', [target]);
    case 'drag':
      return tr('steps.drag', [target]);
    case 'navigate':
      return tr('steps.navigate');
    default:
      return tr('steps.defaultAction', [action, target]);
  }
}
