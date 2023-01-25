/**
 * * Доступные свойства элемента для таблицы описания
 */
export default class Exposed {
  /**
   * * Название
   */
  Name: string = 'fill name!';
  /**
   * * Описание
   */
  Description: string = 'fill description!';
  /**
   * * Краткий тип
   */
  Type: string = 'fill type!';
  /**
   * * Полный тип
   */
  FullType: string = 'fill type!';
  constructor(obj?: Partial<Exposed>) {
    if (obj) Object.assign(this, obj);
  }
}
