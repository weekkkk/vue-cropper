import type { TScroll } from './types';

export function findParentWithScroll(
  el: HTMLElement,
  scrollType: TScroll
): HTMLElement {
  const sizeKeys: ('Height' | 'Width')[] = [];
  switch (scrollType) {
    case 'x':
      sizeKeys.push('Width');
      break;
    case 'y':
      sizeKeys.push('Height');
      break;
    case 'all':
      sizeKeys.push('Width');
      sizeKeys.push('Height');
      break;
  }

  const parent = el.parentElement;
  if (!parent) return el;

  if (parent == document.documentElement) {
    console.log({ parent });

    return parent;
  }

  console.log({ parent });

  const isNoValid = sizeKeys
    .map((key) => {
      const scrollbarHeight = parent[`offset${key}`] - parent[`client${key}`];
      console.log(
        key,
        parent[`scroll${key}`],
        parent[`offset${key}`] - scrollbarHeight
      );

      return parent[`scroll${key}`] <= parent[`offset${key}`] - scrollbarHeight;
    })
    .reduce((prev, current) => prev && current);

  if (isNoValid) return findParentWithScroll(parent, scrollType);

  return parent;
}
