import { h, render } from 'vue';
import PopoverV2 from './popover-v2.vue';

export const popover = {
  mounted: (el: HTMLElement) => {
    console.log(el);
    const vnode = h(PopoverV2);


    const elRect = el.getBoundingClientRect()

    render(vnode, el);
  },
};
