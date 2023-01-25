/**
 * * Функция изменения массива
 */
export default interface IFunction<T = number> {
  /**
   * * Изменить массив
   * @param fromIndex - Откуда вставить
   * @param toIndex - Куда вставить
   * @param elements - Массив для изменения
   */
  (fromIndex: number, toIndex: number, elements: T[]): T[];
}
