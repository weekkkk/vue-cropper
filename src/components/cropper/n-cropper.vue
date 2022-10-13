<script setup lang="ts">
import { computed, ref } from "vue";
import NDrag from "../drag/n-drag.vue";

const $el = ref<HTMLElement>();
const $image = ref<HTMLImageElement>();
const $crop = ref<HTMLImageElement>();

const kImage = computed(() => {
  if (!$image.value) return 0;
  const k = $image.value?.naturalWidth / $image.value?.naturalHeight;
  return k || 0;
});
const kEl = computed(() => {
  if (!$el.value) return 0;
  const k = $el.value?.offsetWidth / $el.value?.offsetHeight;
  return k || 0;
});
const sizeStyle = computed(() => {
  if (!$el.value) return {};
  if (kImage.value > kEl.value)
    return {
      width: `${$el.value.offsetWidth}px`,
      height: `auto`,
    };
  return {
    height: `${$el.value.offsetHeight}px`,
    width: `auto`,
  };
});
</script>

<template>
  <div class="n-cropper" ref="$el">
    <span class="image-wrap">
      <img
        :style="[sizeStyle]"
        ref="$image"
        alt="SRC Image"
        src="https://images.unsplash.com/photo-1566895291281-ea63efd4bdbc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8OSUzQTE2fGVufDB8fDB8fA%3D%3D&w=1000&q=80"
      />
      <!-- src="https://img.freepik.com/premium-photo/astronaut-outer-open-space-planet-earth-stars-provide-background-erforming-space-planet-earth-sunrise-sunset-our-home-iss-elements-this-image-furnished-by-nasa_150455-16829.jpg?w=2000" -->
      <n-drag>
        <div class="crop" ref="$crop">
          <i class="left top"></i>
          <i class="center top"></i>
          <i class="right top"></i>
          <i class="left middle"></i>
          <i class="right middle"></i>
          <i class="left bottom"></i>
          <i class="center bottom"></i>
          <i class="right bottom"></i>
        </div>
      </n-drag>
    </span>
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

  .image-wrap {
    position: absolute;
    display: inline-flex;
    max-width: 100%;
    max-height: 100%;
  }
  .crop {
    // position: absolute;
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
