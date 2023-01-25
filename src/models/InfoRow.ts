export default class InfoRow {
  /**
   * * Название
   */
  Name: string = 'fill name!';
  /**
   * * Описание
   */
  Description: string = 'fill description!';
  constructor(obj?: Partial<InfoRow>) {
    if (obj) Object.assign(this, obj);
  }
}
