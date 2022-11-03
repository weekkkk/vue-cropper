import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { DragAndDrop, Input } from "./modules";
const routes: Array<RouteRecordRaw> = [
  {
    name: "",
    path: "",
    component: () => import("@/layout/base-layout.vue"),
    redirect: DragAndDrop,
    children: [
      /**
       * Драг и дроп
       */
      DragAndDrop,
      /**
       * Инпут
       */
      Input,
    ],
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
export { routes };
export default router;
