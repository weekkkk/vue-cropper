<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useDrag } from "@/composables/drag";

const $el = ref<HTMLElement>();
const $image = ref<HTMLElement>();
const imageDrag = useDrag($image);
const imageStyle = computed(() => {
  if (!$el.value || !$crop.value) return;
  const { left, top } = checkImage();
  if (!imageDrag.isDrag.value) {
    imageDrag.setX(left);
    imageDrag.setY(top);
  }
  return {
    left: `${left}px`,
    top: `${top}px`,
  };
});
function checkImage() {
  let left = 0;
  let top = 0;
  if (!$el.value || !$crop.value || !$image.value) return { left, top };
  left = imageDrag.x.value;
  top = imageDrag.y.value;
  const el = $el.value.getBoundingClientRect();
  const image = $image.value.getBoundingClientRect();
  const crop = $crop.value.getBoundingClientRect();
  let minL =
    image.width < el.width ? $crop.value.offsetLeft + crop.width - image.width : 0;
  let maxL = image.width < el.width ? $crop.value.offsetLeft : 0;
  if (minL < 0) minL = 0;
  if (maxL > el.width - image.width) maxL = el.width - image.width;

  let minT =
    image.height < el.height ? $crop.value.offsetTop + crop.height - image.height : 0;
  let maxT = image.height < el.height ? $crop.value.offsetTop : 0;
  if (minT < 0) minT = 0;
  if (maxT > el.height - image.height) maxT = el.height - image.height;
  if (image.width < el.width) {
    if (imageDrag.x.value < minL) left = minL;
    if (imageDrag.x.value > maxL) left = maxL;
  } else {
    if (imageDrag.x.value > minL) left = minL;
    if (imageDrag.x.value < maxL) left = maxL;
  }
  if (image.height < el.height) {
    if (imageDrag.y.value < minT) top = minT;
    if (imageDrag.y.value > maxT) top = maxT;
  } else {
    if (imageDrag.y.value > minT) top = minT;
    if (imageDrag.y.value < maxT) top = maxT;
  }
  return { left, top };
}
function setDefaultImage() {
  if (!$el.value || !$image.value) return;
  const el = $el.value.getBoundingClientRect();
  const image = $image.value.getBoundingClientRect();
  imageDrag.setX(el.width / 2 - image.width / 2);
  imageDrag.setY(el.height / 2 - image.height / 2);
}
onMounted(setDefaultImage);

const $crop = ref<HTMLElement>();
const cropDrag = useDrag($crop);
const cropStyle = computed(() => {
  if (!$el.value || !$crop.value) return {};
  const { left, top } = checkCrop();
  if (!cropDrag.isDrag.value) {
    cropDrag.setX(left);
    cropDrag.setY(top);
  }
  return {
    left: `${left}px`,
    top: `${top}px`,
  };
});
function checkCrop() {
  let left = 0;
  let top = 0;
  if (!$el.value || !$crop.value || !$image.value) return { left, top };
  left = cropDrag.x.value;
  top = cropDrag.y.value;
  const el = $el.value.getBoundingClientRect();
  const image = $image.value.getBoundingClientRect();
  const crop = $crop.value.getBoundingClientRect();
  const minL = image.width < el.width ? $image.value.offsetLeft : 0;
  const minT = $image.value.offsetHeight < el.height ? $image.value.offsetTop : 0;
  const maxL =
    image.width < el.width
      ? $image.value.offsetLeft + image.width - crop.width
      : el.height - crop.width;
  const maxT =
    $image.value.offsetHeight < el.height
      ? $image.value.offsetTop + $image.value.offsetHeight - crop.height
      : el.height - crop.height;
  if (cropDrag.x.value < minL) left = minL;
  if (cropDrag.y.value < minT) top = minT;
  if (cropDrag.x.value > maxL) left = maxL;
  if (cropDrag.y.value > maxT) top = maxT;
  return { left, top };
}
function setDefaultCrop() {
  if (!$el.value || !$crop.value) return;
  const el = $el.value.getBoundingClientRect();
  const crop = $crop.value.getBoundingClientRect();
  cropDrag.setX(el.width / 2 - crop.width / 2);
  cropDrag.setY(el.height / 2 - crop.height / 2);
}
onMounted(setDefaultCrop);
</script>

<template>
  <button>+</button>
  <button>-</button>
  <div class="n-cropper" ref="$el">
    <img
      :style="imageStyle"
      ref="$image"
      alt="SRC Image"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png"
    />
    <div class="crop" ref="$crop" :style="cropStyle">
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background-image: url(./assets/image/bg.png);

  height: 500px;
  width: 500px;

  img {
    position: absolute;
    display: inline-flex;
    max-width: 100%;
    max-height: 100%;
    // width: 150%;
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
