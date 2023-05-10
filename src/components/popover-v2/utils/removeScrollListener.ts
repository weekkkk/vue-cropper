export function removeScrollListener(
  scrollEl: HTMLElement,
  callback: () => void
) {
  if (scrollEl == document.documentElement) {
    window.removeEventListener('scroll', callback);
    return;
  }
  scrollEl.removeEventListener('scroll', callback);
}
