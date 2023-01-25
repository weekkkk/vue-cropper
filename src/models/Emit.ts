/**
 * * Событие для таблицы описания компонента
 */
export default class Emit {
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
  constructor(obj?: Partial<Emit>) {
    if (obj) Object.assign(this, obj);
  }
}
