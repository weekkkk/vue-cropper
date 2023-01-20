import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { Main } from './modules';
import Popover from './modules/popover';
const routes: Array<RouteRecordRaw> = [
  {
    name: '',
    path: '',
    component: () => import('@/layout/base-layout.vue'),
    redirect: Main,
    children: [
      /**
       * * Главная
       */
      Main,
      /**
       * * Поповер
       */
      Popover,
    ],
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
export { routes };
export default router;
