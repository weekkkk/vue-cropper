<script setup lang="ts">
import { useDrag } from "./composables/drag";
import { reactive, ref, computed, onMounted, watch } from "vue";

const props = defineProps({
  /**
   * Отношение сторон кропа
   */
  aspect: { type: Number, default: 1 },
  /**
   * 
   */
  zdk: { type: Number, default: 0.4 },
});

const start_resize_pos = reactive({ l: 0, t: 0 });
const start_resize_size = reactive({ w: 0, h: 0 });
const $p = ref<HTMLElement>();
const p_drag = useDrag($p);
watch(p_drag.isDrag, () => {
  if (p_drag.isDrag.value) {
    start_resize_pos.l = crop_pos.value.l;
    start_resize_pos.t = crop_pos.value.t;
    start_resize_size.w = crop_size.w;
    start_resize_size.h = crop_size.h;
  } else {
    start_resize_pos.l = 0;
    start_resize_pos.t = 0;
    start_resize_size.w = 0;
    start_resize_size.h = 0;
    p_drag.setX(0);
    p_drag.setY(0);
    $p.value = undefined;
  }
});
const p_pos = computed(() => {
  return { l: p_drag.x.value, t: p_drag.y.value };
});
watch(p_pos, () => {
  if (!p_drag.isDrag.value || !$p.value) return;
  let lw = 0,
    lh = 0,
    l = 0,
    t = 0;
  if (!props.aspect) {
    if (get_is_drag_p("", "top")) {
      lh = start_resize_size.h - p_drag.y.value;
      t = start_resize_pos.t + p_drag.y.value;
      if (t < crop_min.value.t) t = crop_min.value.t;
      if (t + lh > start_resize_pos.t + start_resize_size.h) {
        t = crop_min.value.t;
        lh = start_resize_pos.t + start_resize_size.h - crop_min.value.t;
      }
      crop_drag.setY(t);
      crop_size.h = lh;
    } else if (get_is_drag_p("", "bottom")) {
      lh = start_resize_size.h + p_drag.y.value;
      if (start_resize_pos.t + lh > crop_max.value.t) {
        lh = crop_max.value.t - start_resize_pos.t;
      }
      crop_drag.setY(start_resize_pos.t);
      crop_size.h = lh;
    }
    if (get_is_drag_p("left", "")) {
      lw = start_resize_size.w - p_drag.x.value;
      l = start_resize_pos.l + p_drag.x.value;
      if (l < crop_min.value.l) l = crop_min.value.l;
      if (l + lw > start_resize_pos.l + start_resize_size.w) {
        l = crop_min.value.l;
        lw = start_resize_pos.l + start_resize_size.w - crop_min.value.l;
      }
      crop_drag.setX(l);
      crop_size.w = lw;
    } else if (get_is_drag_p("right", "")) {
      lw = start_resize_size.w + p_drag.x.value;
      if (start_resize_pos.l + lw > crop_max.value.l) {
        lw = crop_max.value.l - start_resize_pos.l;
      }
      crop_drag.setX(start_resize_pos.l);
      crop_size.w = lw;
    }
  } else {
    l = start_resize_pos.l;
    t = start_resize_pos.t;
    if (get_is_drag_p("left", "")) {
      lw = start_resize_size.w - p_drag.x.value;
      l = crop_pos.value.l - (lw - crop_size.w);
    } else if (get_is_drag_p("right", "")) {
      lw = start_resize_size.w + p_drag.x.value;
    }
    lh = lw / props.aspect;
    if (get_is_drag_p("center", "top")) {
      lh = start_resize_size.h - p_drag.y.value;
      lw = lh * props.aspect;
    }
    if (get_is_drag_p("center", "bottom")) {
      lh = start_resize_size.h + p_drag.y.value;
      lw = lh * props.aspect;
    }
    if (get_is_drag_p("", "top")) {
      t = crop_pos.value.t - (lh - crop_size.h);
    }
    if (get_is_drag_p("center", "")) {
      l = crop_pos.value.l + (crop_size.w - lw) / 2;
    }
    if (get_is_drag_p("", "middle")) {
      t = crop_pos.value.t + (crop_size.h - lh) / 2;
    }

    if (lh > crop_max.value.t - crop_min.value.t) {
      lh = crop_max.value.t - crop_min.value.t;
      lw = lh * props.aspect;
      l = crop_pos.value.l;
    }
    if (lw > crop_max.value.l - crop_min.value.l) {
      lw = crop_max.value.l - crop_min.value.l;
      lh = lw / props.aspect;
      t = crop_pos.value.t;
    }
    if (l < crop_min.value.l) l = crop_min.value.l;
    if (l + lw > crop_max.value.l) l = crop_max.value.l - lw;
    if (t < crop_min.value.t) t = crop_min.value.t;
    if (t + lh > crop_max.value.t) t = crop_max.value.t - lh;
    crop_drag.setX(l);
    crop_drag.setY(t);
    crop_size.w = lw;
    crop_size.h = lh;
  }
});

const set_p = (e: MouseEvent | TouchEvent) => {
  $p.value = e.target as HTMLElement;
  if (!$p.value) return;
  p_drag.start(e);
};
const get_is_drag_p = (h: string, v: string) => {
  return (
    (!h || $p.value?.classList.contains(h)) && (!v || $p.value?.classList.contains(v))
  );
};

const $el = ref<HTMLElement>();
const $img = ref<HTMLImageElement>();
const $crop = ref<HTMLElement>();
const w = computed(() => ($el.value?.offsetWidth || 0) / 100);
const h = computed(() => ($el.value?.offsetHeight || 0) / 100);

const get_pos_style = (settings: { l: number; t: number }) => {
  return {
    left: `${settings.l}px`,
    top: `${settings.t}px`,
  };
  // return {
  //   left: `${settings.l / w.value}%`,
  //   top: `${settings.t / h.value}%`,
  // };
};
const get_size_style = (settings: { w: number; h: number }) => {
  return {
    width: `${settings.w}px`,
    height: `${settings.h}px`,
  };
  // return {
  //   width: `${settings.w / w.value}%`,
  //   height: `${settings.h / h.value}%`,
  // };
};

const crop_drag = useDrag($crop, p_drag.isDrag);
const img_drag = useDrag($img, p_drag.isDrag);

watch(crop_drag.isDrag, () => {
  if (crop_drag.isDrag.value) return;
  crop_drag.setX(crop_pos.value.l);
  crop_drag.setY(crop_pos.value.t);
});
watch(img_drag.isDrag, () => {
  if (img_drag.isDrag.value) return;
  img_drag.setX(img_pos.value.l);
  img_drag.setY(img_pos.value.t);
});

const crop_size = reactive({
  w: 0,
  h: 0,
});
const img_size = reactive({
  w: 0,
  h: 0,
});

const crop_pos = computed(() => {
  let x = crop_drag.x.value;
  let y = crop_drag.y.value;
  if (x < crop_min.value.l) x = crop_min.value.l;
  if (y < crop_min.value.t) y = crop_min.value.t;
  if (x + crop_size.w > crop_max.value.l) x = crop_max.value.l - crop_size.w;
  if (y + crop_size.h > crop_max.value.t) y = crop_max.value.t - crop_size.h;
  return {
    l: x,
    t: y,
  };
});
const img_pos = computed(() => {
  let x = img_drag.x.value;
  let y = img_drag.y.value;
  if (ignore.value)
    return {
      l: x,
      t: y,
    };
  if (img_size.w < w.value * 100) {
    if (x < img_min.value.l) x = img_min.value.l;
    else if (x + img_size.w > img_max.value.l) x = img_max.value.l - img_size.w;
  } else {
    if (x > img_min.value.l) x = img_min.value.l;
    else if (x + img_size.w < img_max.value.l) x = img_max.value.l - img_size.w;
  }
  if (img_size.h < h.value * 100) {
    if (y < img_min.value.t) y = img_min.value.t;
    else if (y + img_size.h > img_max.value.t) y = img_max.value.t - img_size.h;
  } else {
    if (y > img_min.value.t) y = img_min.value.t;
    else if (y + img_size.h < img_max.value.t) y = img_max.value.t - img_size.h;
  }
  return {
    l: x,
    t: y,
  };
});

const crop_min = computed(() => {
  let l = 0;
  let t = 0;
  if (!img_pos.value) return { l, t };
  if (img_pos.value.l > 0) l = img_pos.value.l;
  if (img_pos.value.t > 0) t = img_pos.value.t;
  return { l, t };
});
const img_min = computed(() => {
  let l = 0;
  let t = 0;
  if (!crop_pos.value) return { l, t };
  if (crop_pos.value.l + crop_size.w - img_size.w > 0)
    l = crop_pos.value.l + crop_size.w - img_size.w;
  if (crop_pos.value.t + crop_size.h - img_size.h > 0)
    t = crop_pos.value.t + crop_size.h - img_size.h;
  return { l, t };
});

const crop_max = computed(() => {
  let l = w.value * 100;
  let t = h.value * 100;
  if (!img_pos.value) return { l, t };
  if (img_pos.value.l + img_size.w < w.value * 100) l = img_pos.value.l + img_size.w;
  if (img_pos.value.t + img_size.h < h.value * 100) t = img_pos.value.t + img_size.h;
  return { l, t };
});
const img_max = computed(() => {
  let l = w.value * 100;
  let t = h.value * 100;
  if (!crop_pos.value) return { l, t };
  if (crop_pos.value.l + img_size.w < w.value * 100) l = crop_pos.value.l + img_size.w;
  if (crop_pos.value.t + img_size.h < h.value * 100) t = crop_pos.value.t + img_size.h;
  return { l, t };
});

const set_crop_size = (k: number) => {
  if (props.aspect < 1) {
    crop_size.h = img_size.h * k;
    crop_size.w = crop_size.h * props.aspect;
  } else {
    crop_size.w = img_size.w * k;
    crop_size.h = crop_size.w / props.aspect;
  }
  return crop_size;
};
const set_img_size = (k: number) => {
  if (!$img.value || !$el.value) return img_size;
  const el_aspect = $el.value.offsetWidth / $el.value.offsetHeight;
  const aspect = $img.value.naturalWidth / $img.value.naturalHeight;
  if (aspect < 1 || el_aspect > 1) {
    img_size.h = h.value * (100 * k);
    img_size.w = img_size.h * aspect;
  } else {
    img_size.w = w.value * (100 * k);
    img_size.h = img_size.w / aspect;
  }
  return img_size;
};

const img_size_k = ref(1);
const zoom = (z: "+" | "-") => {
  const l = crop_pos.value.l + crop_size.w / 2 - img_pos.value.l;
  const t = crop_pos.value.t + crop_size.h / 2 - img_pos.value.t;
  const kl = l / img_size.w;
  const kt = t / img_size.h;
  const old_size = Object.assign({}, img_size);
  const old_pos = Object.assign({}, img_pos.value);
  if (z == "+") img_size_k.value += props.zdk;
  else img_size_k.value -= props.zdk;
  if (img_size_k.value < 1) {
    img_size_k.value = 1;
  }
  set_img_size(img_size_k.value);
  const dx = Math.abs(img_size.w - old_size.w) * kl;
  const dy = Math.abs(img_size.h - old_size.h) * kt;
  let x = old_pos.l,
    y = old_pos.t;
  if (z == "+") {
    x -= dx;
    y -= dy;
  } else {
    x += dx;
    y += dy;
  }
  img_drag.setX(x);
  img_drag.setY(y);
};

const get_default_pos = (size: { w: number; h: number }) => {
  const l = w.value * 50 - size.w / 2;
  const t = h.value * 50 - size.h / 2;
  return { l, t };
};

const ignore = ref(false);

const set_default = () => {
  ignore.value = true;
  set_img_size(img_size_k.value);
  set_crop_size(0.5);
  const local_img_pos = get_default_pos(img_size);
  img_drag.setX(local_img_pos.l);
  img_drag.setY(local_img_pos.t);
  const local_crop_pos = get_default_pos(crop_size);
  crop_drag.setX(local_crop_pos.l);
  crop_drag.setY(local_crop_pos.t);
  setTimeout(() => {
    ignore.value = false;
  });
};

onMounted(set_default);
</script>

<template>
  <div class="n-cropper" ref="$el">
    <span class="zoom">
      <span @click="zoom('+')">+</span>
      <span @click="zoom('-')">-</span>
    </span>
    <img
      :class="{ 'is-drag': img_drag.isDrag.value }"
      ref="$img"
      alt="SRC Image"
      :style="[get_size_style(img_size), get_pos_style(img_pos)]"
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbrvOZf5zaHg_9a8upGltfVtObFu_0QH1rcw&usqp=CAU"
    />
    <div
      :class="{ 'is-drag': crop_drag.isDrag.value || p_drag.isDrag.value }"
      class="crop"
      ref="$crop"
      :style="[get_size_style(crop_size), get_pos_style(crop_pos)]"
    >
      <i
        :class="{ 'is-drag': get_is_drag_p('left', 'top') }"
        class="left top"
        ref="$lt"
        @mousedown="set_p"
        @touchstart.passive="set_p"
      />
      <i
        :class="{ 'is-drag': get_is_drag_p('center', 'top') }"
        class="center top"
        @mousedown="set_p"
        @touchstart.passive="set_p"
      />
      <i
        :class="{ 'is-drag': get_is_drag_p('right', 'top') }"
        class="right top"
        @mousedown="set_p"
        @touchstart.passive="set_p"
      />
      <i
        :class="{ 'is-drag': get_is_drag_p('left', 'middle') }"
        class="left middle"
        @mousedown="set_p"
        @touchstart.passive="set_p"
      />
      <i
        :class="{ 'is-drag': get_is_drag_p('right', 'middle') }"
        class="right middle"
        @mousedown="set_p"
        @touchstart.passive="set_p"
      />
      <i
        :class="{ 'is-drag': get_is_drag_p('left', 'bottom') }"
        class="left bottom"
        @mousedown="set_p"
        @touchstart.passive="set_p"
      />
      <i
        :class="{ 'is-drag': get_is_drag_p('center', 'bottom') }"
        class="center bottom"
        @mousedown="set_p"
        @touchstart.passive="set_p"
      />
      <i
        :class="{ 'is-drag': get_is_drag_p('right', 'bottom') }"
        class="right bottom"
        @mousedown="set_p"
        @touchstart.passive="set_p"
      />
      <span></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.n-cropper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-image: url(./assets/image/bg.png);
  user-select: none;
  height: 500px;
  width: 100%;
  .zoom {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 100;
    > span {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition-duration: var(--n-cropper-transition-duration);
      transition-timing-function: var(--n-cropper-transition-timing-function);
      font-size: var(--n-cropper-point-size);
      line-height: var(--n-cropper-point-size);
      width: var(--n-cropper-point-size);
      height: var(--n-cropper-point-size);
      color: var(--n-cropper-point-border);
      &:hover {
        font-size: var(--n-cropper-point-hover-size);
        line-height: var(--n-cropper-point-hover-size);
        width: var(--n-cropper-point-hover-size);
        height: var(--n-cropper-point-hover-size);
        height: var(--n-cropper-point-hover-size);
        color: var(--n-cropper-point-hover-border);
      }
      &.is-drag {
        font-size: var(--n-cropper-point-hover-size);
        line-height: var(--n-cropper-point-hover-size);
        width: var(--n-cropper-point-active-size);
        height: var(--n-cropper-point-active-size);
        height: var(--n-cropper-point-active-size);
        color: var(--n-cropper-point-active-border);
      }
    }
  }

  img {
    position: absolute;
    display: inline-flex;
  }
  .crop {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    border-style: var(--n-cropper-border-style);
    border-width: var(--n-cropper-border-width);
    border-color: var(--n-cropper-border);
    transition-duration: var(--n-cropper-transition-duration);
    transition-timing-function: var(--n-cropper-transition-timing-function);
    transition-property: border;
    box-shadow: 0 0 0 10000px rgba(0, 0, 0, var(--n-cropper-opacity));
    &.is-drag {
      border-color: var(--n-cropper-active-border);
      border-style: var(--n-cropper-active-border-style);
    }
    > span {
      display: flex;
      align-items: center;
      justify-content: center;
      &::before,
      &::after {
        content: "";
        position: absolute;
        background-color: var(--n-cropper-border);
      }
      &::before {
        width: var(--n-cropper-border-width);
        height: var(--n-cropper-point-size);
      }
      &::after {
        height: var(--n-cropper-border-width);
        width: var(--n-cropper-point-size);
      }
    }
    > i {
      z-index: 100;
      position: absolute;
      display: inline-block;
      width: var(--n-cropper-point-size);
      height: var(--n-cropper-point-size);
      transition-duration: var(--n-cropper-transition-duration);
      transition-timing-function: var(--n-cropper-transition-timing-function);
      &::before,
      &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        border-radius: var(--n-cropper-point-radius);
        transition-duration: inherit;
        transition-timing-function: inherit;
      }
      &::before {
        background: var(--n-cropper-point-background);
        opacity: var(--n-cropper-point-opacity);
      }
      &::after {
        border-style: var(--n-cropper-point-border-style);
        border-width: var(--n-cropper-point-border-width);
        border-color: var(--n-cropper-point-border);
      }
      $p: calc(var(--n-cropper-point-size) / -2);
      $p_active: calc(var(--n-cropper-point-active-size) / -2);
      &.is-drag {
        width: var(--n-cropper-point-active-size);
        height: var(--n-cropper-point-active-size);
        &::before,
        &::after {
          border-radius: var(--n-cropper-point-active-radius);
        }
        &::before {
          background: var(--n-cropper-point-active-background);
          opacity: var(--n-cropper-point-active-opacity);
        }
        &::after {
          border-style: var(--n-cropper-point-active-border-style);
          border-color: var(--n-cropper-point-active-border);
        }
      }
      &.left {
        left: $p;
        &.is-drag {
          left: $p_active;
        }
        &.top {
          cursor: nwse-resize;
        }
        &.bottom {
          cursor: nesw-resize;
        }
      }
      &.center {
        cursor: ns-resize;
        left: calc(50% - var(--n-cropper-point-size) / 2);
        &.is-drag {
          left: calc(50% - var(--n-cropper-point-active-size) / 2);
        }
      }
      &.right {
        right: $p;
        &.is-drag {
          right: $p_active;
        }
        &.top {
          cursor: nesw-resize;
        }
        &.bottom {
          cursor: nwse-resize;
        }
      }
      &.top {
        top: $p;
        &.is-drag {
          top: $p_active;
        }
      }
      &.middle {
        cursor: ew-resize;
        top: calc(50% - var(--n-cropper-point-size) / 2);
        &.is-drag {
          top: calc(50% - var(--n-cropper-point-active-size) / 2);
        }
      }
      &.bottom {
        bottom: $p;
        &.is-drag {
          bottom: $p_active;
        }
      }
    }
  }

  img,
  .crop {
    cursor: grab;
    &.is-drag {
      cursor: grabbing;
    }
  }
}
</style>
