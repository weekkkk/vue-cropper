/**
 * * Тип свойства
 */
export default class Type {
  /**
   * * Краткое название
   */
  Name!: string;
  /**
   * * Полное название
   */
  FullName?: string;
  constructor(obj?: Partial<Type>) {
    if (obj) Object.assign(this, obj);
  }
}
