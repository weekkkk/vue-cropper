import type { RouteRecordRaw } from 'vue-router';
import { COUNTER } from './names';
/**
 * * Счетчик
 */
const Counter: RouteRecordRaw = {
  name: COUNTER,
  path: `/${COUNTER}`,
  meta: { Title: 'Counter' },
  component: () => import('@/pages/counter-page.vue'),
};
export default Counter;
