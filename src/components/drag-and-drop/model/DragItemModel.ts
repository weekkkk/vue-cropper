import { IDragItem } from "../interface";
/**
 * Эмент для перетаскивания
 */
export default class DragItemModel implements IDragItem {
  /**
   * Уникальный ключ элемента
   */
  Id!: number;
  /**
   * Неактивность
   */
  IsDisabled = false;
  constructor(obj?: Partial<DragItemModel>) {
    if (obj) Object.assign(this, obj);
  }
}
