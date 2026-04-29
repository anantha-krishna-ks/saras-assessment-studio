export const SECTION_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const ITEM_TYPES = [
  "Short Answer",
  "Multiple Choice",
  "True / False",
  "Matching",
  "Fill in the Blank",
  "Assertion Reasoning",
] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

export interface SectionItem {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  score: number;
  type: ItemType;
  subQuestionStyle?: "alpha" | "roman";
  subItems?: SectionItem[];
  orItem?: SectionItem;
}

export interface Section {
  id: string;
  label: string;
  description: string;
  items: SectionItem[];
}

export const deepUpdateItem = (
  items: SectionItem[],
  id: string,
  updates: Partial<SectionItem>
): SectionItem[] =>
  items.map((item) => {
    if (item.id === id) return { ...item, ...updates };
    const next = { ...item };
    if (next.subItems) next.subItems = deepUpdateItem(next.subItems, id, updates);
    if (next.orItem && next.orItem.id === id) next.orItem = { ...next.orItem, ...updates };
    else if (next.orItem?.subItems) {
      next.orItem = { ...next.orItem, subItems: deepUpdateItem(next.orItem.subItems, id, updates) };
    }
    return next;
  });

export const deepRemoveItem = (items: SectionItem[], id: string): SectionItem[] =>
  items
    .filter((item) => item.id !== id)
    .map((item) => {
      const next = { ...item };
      if (next.subItems) next.subItems = deepRemoveItem(next.subItems, id);
      if (next.orItem) {
        if (next.orItem.id === id) {
          next.orItem = undefined;
        } else if (next.orItem.subItems) {
          next.orItem = { ...next.orItem, subItems: deepRemoveItem(next.orItem.subItems, id) };
        }
      }
      return next;
    });

export const addSubItem = (items: SectionItem[], parentId: string, type: ItemType): SectionItem[] =>
  items.map((item) => {
    if (item.id === parentId) {
      const sub = createSectionItem(type);
      return { ...item, subItems: [...(item.subItems ?? []), sub] };
    }
    const next = { ...item };
    if (next.subItems) next.subItems = addSubItem(next.subItems, parentId, type);
    if (next.orItem) {
      if (next.orItem.id === parentId) {
        const sub = createSectionItem(type);
        next.orItem = { ...next.orItem, subItems: [...(next.orItem.subItems ?? []), sub] };
      } else if (next.orItem.subItems) {
        next.orItem = { ...next.orItem, subItems: addSubItem(next.orItem.subItems, parentId, type) };
      }
    }
    return next;
  });

export const addOrItem = (items: SectionItem[], targetId: string, type: ItemType): SectionItem[] =>
  items.map((item) => {
    if (item.id === targetId) {
      if (item.orItem) return item;
      return { ...item, orItem: createSectionItem(type) };
    }
    const next = { ...item };
    if (next.subItems) next.subItems = addOrItem(next.subItems, targetId, type);
    if (next.orItem?.subItems) {
      next.orItem = { ...next.orItem, subItems: addOrItem(next.orItem.subItems, targetId, type) };
    }
    return next;
  });

export const countAllItems = (items: SectionItem[]): number => {
  let count = 0;
  for (const item of items) {
    count++;
    if (item.subItems) count += countAllItems(item.subItems);
    if (item.orItem) {
      count++;
      if (item.orItem.subItems) count += countAllItems(item.orItem.subItems);
    }
  }
  return count;
};

const findTopLevelItem = (items: SectionItem[], id: string): SectionItem | null =>
  items.find((it) => it.id === id) ?? null;

export const linkAsOr = (items: SectionItem[], primaryId: string, secondaryId: string): SectionItem[] => {
  const secondary = findTopLevelItem(items, secondaryId);
  if (!secondary) return items;
  const filtered = items.filter((it) => it.id !== secondaryId);
  return filtered.map((item) => {
    if (item.id === primaryId) {
      if (item.orItem) return item;
      return { ...item, orItem: { ...secondary } };
    }
    return item;
  });
};

export const makeSubItemsOf = (items: SectionItem[], childIds: string[], parentId: string): SectionItem[] => {
  const children = items.filter((it) => childIds.includes(it.id));
  if (children.length === 0) return items;
  const filtered = items.filter((it) => !childIds.includes(it.id));
  return filtered.map((item) => {
    if (item.id === parentId) {
      return { ...item, subItems: [...(item.subItems ?? []), ...children] };
    }
    return item;
  });
};

export const createParentWithSubItems = (
  items: SectionItem[],
  childIds: string[],
  parentQuestion: string
): SectionItem[] => {
  const children = items.filter((it) => childIds.includes(it.id));
  if (children.length === 0) return items;

  const firstChildIndex = items.findIndex((it) => childIds.includes(it.id));
  const parent: SectionItem = {
    ...createSectionItem("Short Answer"),
    question: parentQuestion,
    score: children.reduce((sum, child) => sum + child.score, 0),
    subQuestionStyle: "alpha",
    subItems: children,
  };

  const remaining = items.filter((it) => !childIds.includes(it.id));
  const insertAt = firstChildIndex < 0 ? remaining.length : firstChildIndex;
  return [...remaining.slice(0, insertAt), parent, ...remaining.slice(insertAt)];
};

export const createSection = (label: string): Section => ({
  id: crypto.randomUUID(),
  label,
  description: "",
  items: [],
});

export const createSectionItem = (type: ItemType): SectionItem => ({
  id: crypto.randomUUID(),
  question: "",
  score: 1,
  type,
});
