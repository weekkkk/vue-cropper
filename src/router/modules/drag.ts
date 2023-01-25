import type { RouteRecordRaw } from 'vue-router';
import { DRAG } from './names';
import { Info as Slot } from '@/models';
/**
 * * Слоты
 */
const slots = [
  new Slot({
    Name: 'default',
    Description: 'Контент элемента',
  }),
];

/**
 * * Элемент для перетаскивания
 */
const Drag: RouteRecordRaw = {
  name: DRAG,
  path: `/${DRAG}`,
  meta: { Title: 'Drag' },
  component: () => import('@/pages/drag-page.vue'),
};
export default Drag;
