import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { Control, Main, Popover } from './modules';

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
      /**
       * * Поле для ввода
       */
      Control,
    ],
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export { routes };
export default router;

router.beforeEach(async (to, from, next) => {
  const { Title } = to.meta;
  const brand = '@n-';
  document.title = `${brand}${(Title as string)
    .replace(' ', '-')
    .toLowerCase()}`;
  next();
});
