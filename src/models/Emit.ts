import InfoRow from './InfoRow';
/**
 * * Пропс для таблицы описания компонента
 */
export default class Emit extends InfoRow {
  /**
   * * Какие значения возвращает
   */
  Type: string = 'fill type!';
  constructor(obj?: Partial<Emit>) {
    super();
    if (obj) Object.assign(this, obj);
  }
}
