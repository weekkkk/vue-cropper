import { RouteRecordRaw } from 'vue-router'
import { POPOVER } from './names'
/**
 * * Поповер
 */
const Popover: RouteRecordRaw = {
  name: POPOVER,
  path: `/${ POPOVER }`,
  meta: { Title: 'Popover' },
  component: () => import( "@/pages/popover-page.vue" ),
}
export default Popover