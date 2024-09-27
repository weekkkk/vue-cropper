import type Type from './Type';

/**
 * * Основная информация о свойстве
 */
export default class Info {
  /**
   * * Название
   */
  Name!: string;
  /**
   * * Описание
   */
  Description!: string;
  /**
   * * Значение по умолчанию
   */
  Default?: string;
  /**
   * * Тип
   */
  Type?: string | Type;
  constructor(obj?: Partial<Info>) {
    if (obj) Object.assign(this, obj);
  }
}
