import { RouteRecordRaw } from 'vue-router'
import { INPUT } from './names'
/**
 * Инпут
 */
const Input: RouteRecordRaw = {
  name: INPUT,
  path: `/${ INPUT }`,
  meta: { Title: 'Input' },
  component: () => import( "@/pages/input-page.vue" ),
}
export default Input