import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { Main, Drag } from './modules';
const routes: Array<RouteRecordRaw> = [
  {
    name: '',
    path: '',
    component: () => import('@/layout/base-layout.vue'),
    redirect: Main,
    children: [
      /**
       * * Главная страница
       */
      Main,
      /**
       * * Элемент для перетаскивания
       */
      Drag,
    ],
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export { routes };
export default router;
