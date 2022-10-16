<script setup lang="ts">
import { useDrag } from "@/composables/drag";
import { reactive, ref, computed, onMounted } from "vue";
const props = defineProps({
  /**
   * Мин ширина
   */
  minW: { type: Number, default: 100 },
  /**
   * Мин высота
   */
  minH: { type: Number, default: 100 },
  /**
   * Отношение сторон
   */
  aspect: { type: Number, default: 16 / 9 },
});
/**
 * Элемент
 */
const $el = ref<HTMLElement>();
/**
 * Кроп
 */
const $crop = ref<HTMLElement>();
const crop_drag = useDrag($crop);
const crop_pos = computed(() => {
  if (!$el.value) return {};
  const w = $el.value.offsetWidth / 100;
  const h = $el.value.offsetHeight / 100;
  return {
    l: crop_drag.x.value / w,
    t: crop_drag.y.value / h,
  };
});
const crop_size = reactive({
  w: 50,
  h: 50,
});
const crop = computed(() => {
  return {
    left: `${crop_pos.value.l}%`,
    top: `${crop_pos.value.t}%`,
    width: `${crop_size.w}%`,
    height: `${crop_size.h}%`,
  };
});
const setDefaultCropSize = () => {
  if (!$el.value) return;
  const w = $el.value.offsetWidth / 100;
  const h = $el.value.offsetHeight / 100;
  crop_size.w = 50;
  crop_size.h = 50;
  if (props.aspect) crop_size.h = (w * 50) / props.aspect / h;
};
onMounted(setDefaultCropSize);
const setDefaultCropPos = () => {
  if (!$el.value) return;
  const w = $el.value.offsetWidth / 100;
  const h = $el.value.offsetHeight / 100;
  const x = w * 50 - (crop_size.w * w) / 2;
  const y = h * 50 - (crop_size.h * h) / 2;
  crop_drag.setY(y);
  crop_drag.setX(x);
};
onMounted(setDefaultCropPos);
/**
 * Фото
 */
const $img = ref<HTMLImageElement>();
const img_drag = useDrag($img);
const img_pos = computed(() => {
  if (!$el.value) return {};
  const w = $el.value.offsetWidth / 100;
  const h = $el.value.offsetHeight / 100;
  return {
    l: img_drag.x.value / w,
    t: img_drag.y.value / h,
  };
});
const img_size = reactive({
  w: 0,
  h: 0,
});
const img = computed(() => {
  return {
    left: `${img_pos.value.l}%`,
    top: `${img_pos.value.t}%`,
    width: img_size.w ? `${img_size.w}%` : "auto",
    height: img_size.h ? `${img_size.h}%` : "auto",
  };
});
const setDefaultImgSize = () => {
  if (!$img.value) return;
  const k_img = $img.value.naturalWidth / $img.value.naturalHeight;
  if (k_img > 1) img_size.w = 100;
  else img_size.h = 100;
};
onMounted(setDefaultImgSize);
const setDefaultImgPos = () => {
  if (!$img.value || !$el.value) return;
  const k_img = $img.value.naturalWidth / $img.value.naturalHeight;
  let y = 0;
  let x = 0;
  if (img_size.h) x = $el.value.offsetWidth / 2 - ($el.value.offsetHeight * k_img) / 2;
  if (img_size.w) y = $el.value.offsetHeight / 2 - $el.value.offsetWidth / k_img / 2;
  img_drag.setY(y);
  img_drag.setX(x);
};
onMounted(setDefaultImgPos);
</script>

<template>
  <button>+</button>
  <button>-</button>
  <div class="n-cropper" ref="$el">
    <img
      ref="$img"
      :style="img"
      alt="SRC Image"
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbrvOZf5zaHg_9a8upGltfVtObFu_0QH1rcw&usqp=CAU"
    />
    <!-- src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png" -->
    <div class="crop" ref="$crop" :style="crop">
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
