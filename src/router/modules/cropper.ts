import { RouteRecordRaw } from 'vue-router'
import { CROPPER } from './names'
/**
 * Кроппер фото
 */
const Cropper: RouteRecordRaw = {
  name: CROPPER,
  path: `/${ CROPPER }`,
  meta: { Title: 'Cropper' },
  component: () => import( "@/pages/cropper-page.vue" ),
}
export default Cropper