<template>
  <div class="n-cropper" ref="$el">
    <n-drag :limit="[$el]">
      <template #default="{ style }">
        <img
          :style="[sizeStyle, style]"
          ref="$image"
          alt="SRC Image"
          src="https://img.freepik.com/premium-photo/astronaut-outer-open-space-planet-earth-stars-provide-background-erforming-space-planet-earth-sunrise-sunset-our-home-iss-elements-this-image-furnished-by-nasa_150455-16829.jpg?w=2000"
        />
      </template>
    </n-drag>
    <!-- src="https://komandirovka.ru/upload/iblock/b94/b940db82c961b142255daa1df9327d62.jpg" -->
    <n-drag :limit="[$image]">
      <template #default="{ style }">
        <div class="crop" ref="$crop" :style="style">
          <i class="left top"></i>
          <i class="center top"></i>
          <i class="right top"></i>
          <i class="left middle"></i>
          <i class="right middle"></i>
          <i class="left bottom"></i>
          <i class="center bottom"></i>
          <i class="right bottom"></i>
        </div>
      </template>
    </n-drag>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import NDrag from "../drag/n-drag.vue";

const $el = ref<HTMLElement>();
const $image = ref<HTMLImageElement>();
const $crop = ref<HTMLImageElement>();

const kImage = computed(() => {
  if (!$image.value) return 0;
  const k = $image.value?.naturalWidth / $image.value?.naturalHeight;
  return k || 0;
});
const kWrap = computed(() => {
  if (!$el.value) return 0;
  const k = $el.value?.offsetWidth / $el.value?.offsetHeight;
  return k || 0;
});
const sizeStyle = computed(() => {
  console.log(kImage.value, kWrap.value);

  if (kImage.value > kWrap.value)
    return {
      width: "100%",
    };
  return {
    height: "100%",
  };
});
console.log(sizeStyle.value);
</script>

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
