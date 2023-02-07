import type { RouteRecordRaw } from 'vue-router';
import { BUTTON } from './names';
/**
 * * Кнопка
 */
const Button: RouteRecordRaw = {
  name: BUTTON,
  path: `/${BUTTON}`,
  meta: { Title: 'Button' },
  component: () => import('@/pages/button-page.vue'),
};
export default Button;
