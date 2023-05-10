import type { TOffset } from './types';

export function getOffsetByParent(
  parent: HTMLElement,
  el: HTMLElement,
  type: TOffset
) {
  const parentRect = parent.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();

  let offset: number = 0;

  const isCalcByWindow = parent == document.documentElement;

  switch (type) {
    case 'top':
      if (isCalcByWindow) offset = elRect.top;
      offset = elRect.top - parentRect.top;
      break;
    case 'left':
      if (isCalcByWindow) offset = elRect.left;
      offset = elRect.left - parentRect.left;
      break;
    case 'bottom':
      if (isCalcByWindow) offset = window.innerHeight - elRect.bottom;
      offset =
        window.innerWidth -
        elRect.bottom -
        (window.innerWidth - parentRect.bottom);
      break;
    case 'right':
      if (isCalcByWindow) offset = window.innerWidth - elRect.right;
      offset =
        window.innerWidth -
        elRect.right -
        (window.innerWidth - parentRect.right);
      break;
  }

  return offset;
}
