import type { RouteRecordRaw } from 'vue-router';
import { DRAG } from './names';
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
