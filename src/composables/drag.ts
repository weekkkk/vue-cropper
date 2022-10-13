import { ref, onMounted, onUnmounted, Ref } from "vue";
/**
 * Отслеживание курсора
 */
export function useDrag( $element: Ref<HTMLElement | undefined> ) {
  /**
   * Горизонталь
   */
  const sx = ref( 0 );
  /**
   * Вертикаль
   */
  const sy = ref( 0 );
  /**
   * Изменение по горизонтали
   */
  const x = ref( 0 );
  /**
   * Изменение по вертикали
   */
  const y = ref( 0 );
  /**
   * Происходит ли перетаскивание
   */
  const isDrag = ref( false );
  /**
   * Начало перетаскивания
   */
  function start( event: MouseEvent | TouchEvent ) {
    if ( isDrag.value ) return;
    event.preventDefault();
    isDrag.value = !isDrag.value;
    let data: MouseEvent | Touch;
    if ( event instanceof TouchEvent ) data = event.changedTouches[ 0 ];
    else data = event as MouseEvent;
    sx.value = data.pageX;
    sy.value = data.pageY;
  }
  /**
   * Перетаскивание
   */
  function drag( event: MouseEvent | TouchEvent ) {
    if ( !isDrag.value ) return;
    let data: MouseEvent | Touch;
    if ( event instanceof TouchEvent ) data = event.changedTouches[ 0 ];
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
    if ( !isDrag.value ) return;
    isDrag.value = !isDrag.value;
  }
  /**
   * Установить x
   */
  function setX( value: number ) {
    x.value = value;
  }
  /**
   * Установить y
   */
  function setY( value: number ) {
    y.value = value;
  }
  /**
   * При загрузке компонента
   */
  onMounted( () => {
    if ( !$element.value ) return;
    $element.value.addEventListener( "mousedown", start );
    window.addEventListener( "mousemove", drag );
    window.addEventListener( "mouseup", stop );
  } );
  /**
   * При разрушении компонента
   */
  onUnmounted( () => {
    if ( !$element.value ) return;
    $element.value.addEventListener( "mousedown", start );
    window.addEventListener( "mousemove", drag );
    window.addEventListener( "mouseup", stop );
  } );
  return { x, y, setX, setY, isDrag };
}
