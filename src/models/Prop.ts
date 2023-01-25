import InfoRow from './InfoRow';
/**
 * * Пропс для таблицы описания компонента
 */
export default class Prop extends InfoRow {
  /**
   * * Тип
   */
  Type: string = 'fill type!';
  /**
   * * Значение по умолчанию
   */
  Default: string = 'fill default!';
  constructor(obj?: Partial<Prop>) {
    super();
    if (obj) Object.assign(this, obj);
  }
}
