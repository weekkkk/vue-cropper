/**
 * Слот для таблицы описания
 */
export default class Slot
{
  /**
   * * Название
   */
  Name: string = 'fill name!';
  /**
   * * Описание
   */
  Description: string = 'fill description!';
  constructor(obj?: Partial<Slot>) {
    if (obj) Object.assign(this, obj);
  }
}
