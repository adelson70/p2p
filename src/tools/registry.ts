export type ToolCategory = 'transfer' | 'communication' | 'collaboration';

export type ToolStatus = 'live' | 'soon';

export interface ToolDefinition {
  id: string;
  slug: string;
  category: ToolCategory;
  i18nKey: string;
  status: ToolStatus;
  path?: string;
}

export const tools: ToolDefinition[] = [
  {
    id: 'privatedrop',
    slug: 'privatedrop',
    category: 'transfer',
    i18nKey: 'privatedrop',
    status: 'live',
    path: 'transfer',
  },
  {
    id: 'privatechat',
    slug: 'privatechat',
    category: 'communication',
    i18nKey: 'privatechat',
    status: 'live',
    path: 'communication/privatechat',
  },
  {
    id: 'privatecall',
    slug: 'privatecall',
    category: 'communication',
    i18nKey: 'privatecall',
    status: 'live',
    path: 'communication/privatecall',
  },
  {
    id: 'whiteboard',
    slug: 'whiteboard',
    category: 'collaboration',
    i18nKey: 'whiteboard',
    status: 'live',
    path: 'collaboration/whiteboard',
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((t) => t.slug === slug);
}

export function toolsByCategory(category: ToolCategory): ToolDefinition[] {
  return tools.filter((t) => t.category === category);
}
