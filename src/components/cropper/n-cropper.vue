<script setup lang="ts">
import { useDrag } from "@/composables/drag";
import { reactive, ref, computed, onMounted, watch } from "vue";
const props = defineProps({
  aspect: { type: Number, default: 16 / 9 },
});

const $el = ref<HTMLElement>();
const $img = ref<HTMLImageElement>();
const $crop = ref<HTMLElement>();
const w = computed(() => ($el.value?.offsetWidth || 0) / 100);
const h = computed(() => ($el.value?.offsetHeight || 0) / 100);

const crop_drag = useDrag($crop);
const crop_pos = computed(() => {
  return {
    l: crop_drag.x.value,
    t: crop_drag.y.value,
  };
});
const crop_size = reactive({
  w: 0,
  h: 0,
});

const set_crop_size = (k: number) => {
  if (!$img.value) return;
  if (props.aspect < 1) {
    crop_size.h = h.value * (100 * k);
    crop_size.w = crop_size.h * props.aspect;
  } else {
    crop_size.w = w.value * (100 * k);
    crop_size.h = crop_size.w / props.aspect;
  }
};

const img_drag = useDrag($img);
const img_size = reactive({
  w: 0,
  h: 0,
});
const img_pos = computed(() => {
  return {
    l: img_drag.x.value,
    t: img_drag.y.value,
  };
});
const set_img_size = (k: number) => {
  if (!$img.value) return;
  const aspect = $img.value.naturalWidth / $img.value.naturalHeight;
  if (aspect < 1) {
    img_size.h = h.value * (100 * k);
    img_size.w = img_size.h * aspect;
  } else {
    img_size.w = w.value * (100 * k);
    img_size.h = img_size.w / aspect;
  }
};

const get_pos_style = (settings: { l: number; t: number }) => {
  return {
    left: `${settings.l / w.value}%`,
    top: `${settings.t / h.value}%`,
  };
};
const get_size_style = (settings: { w: number; h: number }) => {
  return {
    width: `${settings.w / w.value}%`,
    height: `${settings.h / h.value}%`,
  };
};
const get_default_pos = (size: { w: number; h: number }) => {
  const l = w.value * 50 - size.w / 2;
  const t = h.value * 50 - size.h / 2;
  return { l, t };
};
onMounted(() => {
  console.log("w", w.value);

  set_img_size(1);
  set_crop_size(0.5);
  const local_img_pos = get_default_pos(img_size);
  img_drag.setX(local_img_pos.l);
  img_drag.setY(local_img_pos.t);
  const local_crop_pos = get_default_pos(crop_size);
  crop_drag.setX(local_crop_pos.l);
  crop_drag.setY(local_crop_pos.t);
});
</script>

<template>
  <button>+</button>
  <button>-</button>
  <!-- {{ x }}:{{ y }} -->
  <div class="n-cropper" ref="$el">
    <img
      ref="$img"
      alt="SRC Image"
      :style="[get_size_style(img_size), get_pos_style(img_pos)]"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png"
    />
    <!-- src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbrvOZf5zaHg_9a8upGltfVtObFu_0QH1rcw&usqp=CAU" -->
    <div
      class="crop"
      ref="$crop"
      :style="[get_size_style(crop_size), get_pos_style(crop_pos)]"
    >
      <i class="left top" ref="$lt"></i>
      <i class="center top"></i>
      <i class="right top"></i>
      <i class="left middle"></i>
      <i class="right middle"></i>
      <i class="left bottom" ref="$lb"></i>
      <i class="center bottom"></i>
      <i class="right bottom"></i>
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

  height: 500px;
  width: 400px;

  img {
    position: absolute;
    display: inline-flex;
  }
  .crop {
    position: absolute;
    border-style: var(--n-cropper-border-style);
    border-width: var(--n-cropper-border-width);
    border-color: var(--n-cropper-border);

    box-shadow: 0 0 0 10000px rgba(0, 0, 0, var(--n-cropper-opacity));

    width: 200px;
    height: 100px;

    > i {
      z-index: 100;
      position: absolute;
      display: inline-block;
      width: var(--n-cropper-point-size);
      height: var(--n-cropper-point-size);
      &::before,
      &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        border-radius: var(--n-cropper-point-radius);
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
      &.left {
        left: $p;
      }
      &.center {
        left: calc(50% - var(--n-cropper-point-size) / 2);
      }
      &.right {
        right: $p;
      }
      &.top {
        top: $p;
      }
      &.middle {
        top: calc(50% - var(--n-cropper-point-size) / 2);
      }
      &.bottom {
        bottom: $p;
      }
    }
  }
}
</style>
