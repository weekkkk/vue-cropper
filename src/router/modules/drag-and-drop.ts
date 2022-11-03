import { RouteRecordRaw } from "vue-router";
import { DRAG_AND_DROP } from "./names";
/**
 * Драг и дроп
 */
const DragAndDrop: RouteRecordRaw = {
  name: DRAG_AND_DROP,
  path: `/${DRAG_AND_DROP}`,
  meta: { Title: "Drag and Drop" },
  component: () => import("@/pages/drag-and-drop-page.vue"),
};
export default DragAndDrop;
