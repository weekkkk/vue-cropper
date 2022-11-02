import { ref, onMounted, onUnmounted, Ref } from "vue";
/**
 * Отслеживание курсора
 */
export function useDrag($element: Ref<HTMLElement | undefined>, isPaused?: Ref<boolean>) {
  /**
   * Горизонталь
   */
  const sx = ref(0);
  /**
   * Вертикаль
   */
  const sy = ref(0);
  /**
   * Изменение по горизонтали
   */
  const x = ref(0);
  /**
   * Изменение по вертикали
   */
  const y = ref(0);
  /**
   * Происходит ли перетаскивание
   */
  const isDrag = ref(false);
  /**
   * Начало перетаскивания
   */
  function start(event: MouseEvent | TouchEvent) {
    if (isDrag.value || (isPaused && isPaused.value)) return;
    isDrag.value = !isDrag.value;
    let data: MouseEvent | Touch;
    if (event instanceof TouchEvent) data = event.changedTouches[0];
    else {
      event.preventDefault();
      data = event as MouseEvent;
    }
    sx.value = data.pageX;
    sy.value = data.pageY;
  }
  /**
   * Перетаскивание
   */
  function drag(event: MouseEvent | TouchEvent) {
    if (!isDrag.value) return;
    let data: MouseEvent | Touch;
    if (event instanceof TouchEvent) data = event.changedTouches[0];
    else data = event as MouseEvent;
    x.value += data.pageX - sx.value;
    y.value += data.pageY - sy.value;
    sx.value = data.pageX;
    sy.value = data.pageY;
  }
  /**
   * Конец перетаскивания
   */
  function stop() {
    if (!isDrag.value) return;
    isDrag.value = !isDrag.value;
  }
  /**
   * Установить x
   */
  function setX(value: number) {
    x.value = value;
  }
  /**
   * Установить y
   */
  function setY(value: number) {
    y.value = value;
  }
  /**
   * При загрузке компонента
   */
  onMounted(() => {
    window.addEventListener("mousemove", drag);
    window.addEventListener("touchmove", drag);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);
    if (!$element.value) return;
    $element.value.addEventListener("mousedown", start);
    $element.value.addEventListener("touchstart", start, { passive: true });
  });
  /**
   * При разрушении компонента
   */
  onUnmounted(() => {
    window.removeEventListener("mousemove", drag);
    window.removeEventListener("touchmove", drag);
    window.removeEventListener("mouseup", stop);
    window.removeEventListener("touchend", stop);
    if (!$element.value) return;
    $element.value.removeEventListener("mousedown", start);
    $element.value.removeEventListener("touchstart", start);
  });
  return { x, y, setX, setY, isDrag, start };
}
