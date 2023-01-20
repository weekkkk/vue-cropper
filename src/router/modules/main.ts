import { RouteRecordRaw } from 'vue-router'
import { MAIN } from './names'
/**
 * * Главная
 */
const Main: RouteRecordRaw = {
  name: MAIN,
  path: `/${ MAIN }`,
  meta: { Title: 'Main' },
  component: () => import( "@/pages/main-page.vue" ),
}
export default Main