export function setScrollListener(scrollEl: HTMLElement, callback: () => void) {
  if (scrollEl == document.documentElement) {
    window.addEventListener('scroll', callback);
    return;
  }
  scrollEl.addEventListener('scroll', callback);
}
