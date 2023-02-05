import type { RouteRecordRaw } from 'vue-router';
import { CONTROL } from './names';
/**
 * * Поле для ввода
 */
const Input: RouteRecordRaw = {
  name: CONTROL,
  path: `/${CONTROL}`,
  meta: { Title: 'Input' },
  component: () => import('@/pages/input-page.vue'),
};
export default Input;
