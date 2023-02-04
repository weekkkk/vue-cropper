import type { RouteRecordRaw } from 'vue-router';
import { CONTROL } from './names';
/**
 * * Поле для ввода
 */
const Control: RouteRecordRaw = {
  name: CONTROL,
  path: `/${CONTROL}`,
  meta: { Title: 'Control' },
  component: () => import('@/pages/control-page.vue'),
};
export default Control;
