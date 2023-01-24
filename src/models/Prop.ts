import type { IProp } from '@/interfaces';

/**
 * * Пропс для таблицы описания компонента
 */
export default class Prop implements IProp {
  /**
   * * Название
   */
  Name: string = 'fill name!';
  /**
   * * Тип
   */
  Type: string = 'fill type!';
  /**
   * * Значение по умолчанию
   */
  Default: string = 'fill default!';
  /**
   * * Описание
   */
  Description: string = 'fill description!';
  constructor(obj?: Partial<Prop>) {
    if (obj) Object.assign(this, obj);
  }
}
