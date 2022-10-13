import { ref, onMounted, onUnmounted } from "vue";
/**
 * Отслеживание курсора
 */
export function useMouse() {
  /**
   * Горизонталь
   */
  const x = ref( 0 );
  /**
   * Вертикаль
   */
  const y = ref( 0 );
  /**
   * Обновление значений
   * @param event
   */
  function update( event: MouseEvent ) {
    x.value = event.pageX;
    y.value = event.pageY;
  }
  /**
   * При загрузке компонента
   */
  onMounted( () => window.addEventListener( "mousemove", update ) );
  /**
   * При разрушении компонента
   */
  onUnmounted( () => window.addEventListener( "mousemove", update ) );
  /**
   * Вернуть позицию курсора
   */
  return { x, y }
}
