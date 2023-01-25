import type { RouteRecordRaw } from 'vue-router';
import { DRAG_GROUP } from './names';
/**
 * * Группа элементов для перетаскивания
 */
const DragGroup: RouteRecordRaw = {
  name: DRAG_GROUP,
  path: `/${DRAG_GROUP}`,
  meta: { Title: 'Drag Group' },
  component: () => import('@/pages/drag-group-page.vue'),
};
export default DragGroup;
