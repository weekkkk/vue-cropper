import type { RouteRecordRaw } from 'vue-router';
import { STYLE } from './names';
/**
 * * Стили
 */
const Style: RouteRecordRaw = {
  name: STYLE,
  path: STYLE,
  meta: { Title: 'Style' },
  component: () => import('@/pages/style-page.vue'),
};
export default Style;
