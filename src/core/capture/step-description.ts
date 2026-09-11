import { i18n } from '#imports';
import type { ElementMeta } from '@/core/guides/types';

function targetFor(meta: ElementMeta): string {
  return (
    meta.ariaLabel ||
    meta.placeholder ||
    meta.textContent?.slice(0, 80) ||
    meta.altText ||
    meta.name ||
    meta.role ||
    meta.tag
  );
}

function romanianFallback(action: string, meta: ElementMeta, target: string): string {
  if (action.startsWith('keydown:')) return `Apasă tasta ${action.split(':')[1]} în „${target}”.`;

  switch (action) {
    case 'click':
    case 'auxclick':
      if (meta.tag === 'input' && meta.inputType === 'checkbox') return `Bifează sau debifează „${target}”.`;
      if (meta.tag === 'input' && meta.inputType === 'radio') return `Selectează opțiunea „${target}”.`;
      if (meta.role === 'switch') return `Activează sau dezactivează comutatorul „${target}”.`;
      if (meta.role === 'checkbox') return `Bifează sau debifează „${target}”.`;
      if (meta.role === 'radio') return `Selectează opțiunea „${target}”.`;
      if (meta.href) return `Deschide linkul „${target}”.`;
      return `Apasă pe „${target}”.`;
    case 'input':
      return meta.inputType ? `Completează câmpul „${target}” (${meta.inputType}).` : `Completează câmpul „${target}”.`;
    case 'copy':
      return `Copiază conținutul din „${target}”.`;
    case 'paste':
      return `Lipește conținutul în „${target}”.`;
    case 'cut':
      return `Decupează conținutul din „${target}”.`;
    case 'drag':
      return `Trage elementul „${target}” în poziția dorită.`;
    case 'navigate':
      return 'Deschide pagina următoare.';
    default:
      return `Efectuează acțiunea „${action}” asupra elementului „${target}”.`;
  }
}

export function buildFallbackDescription(action: string, meta: ElementMeta, locale?: string): string {
  const target = targetFor(meta);
  if (locale?.toLowerCase().startsWith('ro')) return romanianFallback(action, meta, target);

  if (action.startsWith('keydown:')) return i18n.t('steps.pressKey', [action.split(':')[1], target]);

  switch (action) {
    case 'click':
    case 'auxclick':
      if (meta.tag === 'input' && meta.inputType === 'checkbox') return i18n.t('steps.toggleCheckbox', [target]);
      if (meta.tag === 'input' && meta.inputType === 'radio') return i18n.t('steps.selectRadio', [target]);
      if (meta.role === 'switch') return i18n.t('steps.toggleSwitch', [target]);
      if (meta.role === 'checkbox') return i18n.t('steps.toggleCheckbox', [target]);
      if (meta.role === 'radio') return i18n.t('steps.selectRadio', [target]);
      if (meta.href) return i18n.t('steps.clickLink', [target]);
      return i18n.t('steps.click', [target]);
    case 'input':
      if (meta.inputType) return i18n.t('steps.typeIntoField', [meta.inputType, target]);
      return i18n.t('steps.typeInto', [target]);
    case 'copy':
      return i18n.t('steps.copyFrom', [target]);
    case 'paste':
      return i18n.t('steps.pasteInto', [target]);
    case 'cut':
      return i18n.t('steps.cutFrom', [target]);
    case 'drag':
      return i18n.t('steps.drag', [target]);
    case 'navigate':
      return i18n.t('steps.navigate');
    default:
      return i18n.t('steps.defaultAction', [action, target]);
  }
}
