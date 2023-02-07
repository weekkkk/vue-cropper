import type { RouteRecordRaw } from 'vue-router';
import { SELECT } from './names';
/**
 * * Дропдаун
 */
const Select: RouteRecordRaw = {
  name: SELECT,
  path: `/${SELECT}`,
  meta: { Title: 'Select' },
  component: () => import('@/pages/select-page.vue'),
};
export default Select;
