import type { RouteRecordRaw } from 'vue-router';
import { POPOVER_V2 } from './names';
/**
 * * Поповер
 */
const PopoverV2: RouteRecordRaw = {
  name: POPOVER_V2,
  path: `/${POPOVER_V2}`,
  meta: { Title: 'Popover V2' },
  component: () => import('@/pages/popover-v2-page.vue'),
};
export default PopoverV2;
