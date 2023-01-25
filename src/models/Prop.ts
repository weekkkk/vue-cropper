/**
 * * Пропс для таблицы описания компонента
 */
export default class Prop {
  /**
   * * Название
   */
  Name: string = 'fill name!';
  /**
   * * Описание
   */
  Description: string = 'fill description!';
  /**
   * * Тип
   */
  Type: string = 'fill type!';
  /**
   * * Значение по умолчанию
   */
  Default: string = 'fill default!';
  constructor(obj?: Partial<Prop>) {
    if (obj) Object.assign(this, obj);
  }
}
