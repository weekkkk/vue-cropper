<script setup lang="ts">
import { useDrag } from "./composables/drag";
import { reactive, ref, computed, onMounted, watch } from "vue";

const props = defineProps({
  /**
   * Значение
   */
  modelValue: { type: String, default: "" },
  /**
   * Отношение сторон кропа
   */
  aspect: { type: Number, default: 16 / 9 },
  /**
   * Размер изменения коэффициента зума
   */
  zdk: { type: Number, default: 0.4 },
  /**
   * Фото
   */
  src: { type: String, default: "" },
  /**
   * Мин размер
   */
  minSize: { type: Number, default: 100 },
});
/**
 * Начальная позация при ресайзе
 */
const start_resize_pos = reactive({ l: 0, t: 0 });
/**
 * Начальный размер при ресайзе
 */
const start_resize_size = reactive({ w: 0, h: 0 });
/**
 * Активная точка кропа
 */
const $p = ref<HTMLElement>();
/**
 * Перетаскивание активной точки
 */
const p_drag = useDrag($p);
/**
 * Слежение за тем началось ли перетаскивание точки
 */
watch(p_drag.isDrag, (): void => {
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
    setCrop();
  }
});
/**
 * Позация точки
 */
const p_pos = computed((): { l: number; t: number } => {
  return { l: p_drag.x.value, t: p_drag.y.value };
});
/**
 * Слежение за позицией точки
 */
watch(p_pos, () => {
  if (!p_drag.isDrag.value || !$p.value) return;
  let lw = start_resize_size.w,
    lh = start_resize_size.h,
    l = start_resize_pos.l,
    t = start_resize_pos.t;
  if (!props.aspect) {
    if (get_is_drag_p("", "top")) {
      lh = start_resize_size.h - p_drag.y.value;
      t = start_resize_pos.t + p_drag.y.value;
      if (t < crop_min.value.t) t = crop_min.value.t;
      if (t + lh > start_resize_pos.t + start_resize_size.h) {
        t = crop_min.value.t;
        lh = start_resize_pos.t + start_resize_size.h - crop_min.value.t;
      }
    } else if (get_is_drag_p("", "bottom")) {
      lh = start_resize_size.h + p_drag.y.value;
      if (start_resize_pos.t + lh > crop_max.value.t) {
        lh = crop_max.value.t - start_resize_pos.t;
      }
    }
    if (get_is_drag_p("left", "")) {
      lw = start_resize_size.w - p_drag.x.value;
      l = start_resize_pos.l + p_drag.x.value;
      if (l < crop_min.value.l) l = crop_min.value.l;
      if (l + lw > start_resize_pos.l + start_resize_size.w) {
        l = crop_min.value.l;
        lw = start_resize_pos.l + start_resize_size.w - crop_min.value.l;
      }
    } else if (get_is_drag_p("right", "")) {
      lw = start_resize_size.w + p_drag.x.value;
      if (start_resize_pos.l + lw > crop_max.value.l) {
        lw = crop_max.value.l - start_resize_pos.l;
      }
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
  }
  if (lw > crop_min_size.value.w) {
    crop_size.w = lw;
    crop_drag.setX(l);
  }
  if (lh > crop_min_size.value.h) {
    crop_size.h = lh;
    crop_drag.setY(t);
  }
});
/**
 * Установка точки
 * @param e
 */
const set_p = (e: MouseEvent | TouchEvent): void => {
  if (ignore.value) return;
  $p.value = e.target as HTMLElement;
  if (!$p.value) return;
  p_drag.start(e);
};
/**
 * Возвращает true если точка с данными классам перетаскиваниется
 * h - класс по горизонтали left, center, right
 * v - класс по вертикали top, middle, bottom
 * @param h
 * @param v
 */
const get_is_drag_p = (
  h: "left" | "center" | "right" | "",
  v: "top" | "middle" | "bottom" | ""
): boolean => {
  return !!(
    (!h || $p.value?.classList.contains(h)) &&
    (!v || $p.value?.classList.contains(v))
  );
};
/**
 * Элемент обертки
 */
const $el = ref<HTMLElement>();
/**
 * Фото
 */
const $img = ref<HTMLImageElement>();
/**
 * Кроп
 */
const $crop = ref<HTMLElement>();
/**
 * 1% от ширины обертки
 */
const w = computed(() => ($el.value?.offsetWidth || 0) / 100);
/**
 * 1% от высоты обертки
 */
const h = computed(() => ($el.value?.offsetHeight || 0) / 100);
/**
 * Возвращает стили позиции
 * @param settings
 */
const get_pos_style = (settings: {
  l: number;
  t: number;
}): { left: string; top: string } => {
  return {
    left: `${settings.l}px`,
    top: `${settings.t}px`,
  };
  // return {
  //   left: `${settings.l / w.value}%`,
  //   top: `${settings.t / h.value}%`,
  // };
};
/**
 * Возвращает стили размера
 * @param settings
 */
const get_size_style = (settings: {
  w: number;
  h: number;
}): { width: string; height: string } => {
  return {
    width: `${settings.w}px`,
    height: `${settings.h}px`,
  };
  // return {
  //   width: `${settings.w / w.value}%`,
  //   height: `${settings.h / h.value}%`,
  // };
};
/**
 * Перетаскивание кропа
 */
const crop_drag = useDrag($crop, p_drag.isDrag);
/**
 * Перетаскивание фото
 */
const img_drag = useDrag($img, p_drag.isDrag);
/**
 * Слежение за тем перетаскивается ли кроп
 */
watch(crop_drag.isDrag, () => {
  if (crop_drag.isDrag.value) return;
  crop_drag.setX(crop_pos.value.l);
  crop_drag.setY(crop_pos.value.t);
  setCrop();
});
/**
 * Слежение за тем перетаскивается ли фото
 */
watch(img_drag.isDrag, () => {
  if (img_drag.isDrag.value) return;
  img_drag.setX(img_pos.value.l);
  img_drag.setY(img_pos.value.t);
  setCrop();
});
/**
 * Размер кропа
 */
const crop_size = reactive({
  w: 0,
  h: 0,
});
/**
 * Размер фото
 */
const img_size = reactive({
  w: 0,
  h: 0,
});
/**
 * Позиция кропа
 */
const crop_pos = computed((): { l: number; t: number } => {
  let x = crop_drag.x.value;
  let y = crop_drag.y.value;
  if (ignore.value)
    return {
      l: x,
      t: y,
    };
  if (x < crop_min.value.l) x = crop_min.value.l;
  if (y < crop_min.value.t) y = crop_min.value.t;
  if (x + crop_size.w > crop_max.value.l) x = crop_max.value.l - crop_size.w;
  if (y + crop_size.h > crop_max.value.t) y = crop_max.value.t - crop_size.h;
  return {
    l: x,
    t: y,
  };
});
/**
 * Позиция фото
 */
const img_pos = computed((): { l: number; t: number } => {
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
/**
 * Минимальная позиция кропа
 */
const crop_min = computed((): { l: number; t: number } => {
  let l = 0;
  let t = 0;
  if (!img_pos.value) return { l, t };
  if (img_pos.value.l > 0) l = img_pos.value.l;
  if (img_pos.value.t > 0) t = img_pos.value.t;
  return { l, t };
});
/**
 * Минимальная позиция фото
 */
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
/**
 * Максимальная позиция кропа
 */
const crop_max = computed((): { l: number; t: number } => {
  let l = w.value * 100;
  let t = h.value * 100;
  if (!img_pos.value) return { l, t };
  if (img_pos.value.l + img_size.w < w.value * 100) l = img_pos.value.l + img_size.w;
  if (img_pos.value.t + img_size.h < h.value * 100) t = img_pos.value.t + img_size.h;
  return { l, t };
});
/**
 * Максимальная позиция фото
 */
const img_max = computed((): { l: number; t: number } => {
  let l = w.value * 100;
  let t = h.value * 100;
  if (!crop_pos.value) return { l, t };
  if (crop_pos.value.l + img_size.w < w.value * 100) l = crop_pos.value.l + img_size.w;
  if (crop_pos.value.t + img_size.h < h.value * 100) t = crop_pos.value.t + img_size.h;
  return { l, t };
});
/**
 * Установка размера кропа по коэффициенту
 * @param k
 */
const set_crop_size = (k: number) => {
  if (!$img.value) return;
  let lh = img_size.h / 2 || h.value * 100;
  let lw = img_size.w / 2 || w.value * 100;
  if ($img.value.naturalHeight < $img.value.naturalWidth) {
    if (lh * k < crop_min_size.value.h) crop_size.h = crop_min_size.value.h;
    else if (lh * k > img_size.h) crop_size.h = img_size.h;
    else crop_size.h = lh * k;
    crop_size.w = crop_size.h * (props.aspect || 1);
  } else {
    if (lw * k < crop_min_size.value.w) crop_size.w = crop_min_size.value.w;
    else if (lw * k > img_size.w) crop_size.w = img_size.w;
    else crop_size.w = lw * k;
    crop_size.h = crop_size.w / (props.aspect || 1);
  }
  return crop_size;
};
/**
 * Минимальный размер кропа
 */
const crop_min_size = computed(() => {
  let w = props.minSize;
  let h = props.minSize;
  if (img_size.w < w) w = img_size.w;
  if (img_size.h < h) h = img_size.h;
  if (!props.aspect || !$img.value) return { w, h };
  if ($img.value.naturalHeight > $img.value.naturalWidth) h = w / props.aspect;
  else w = h * props.aspect;
  return { w, h };
});
/**
 * Установка размера фото по коэффициенту
 * @param k
 */
const set_img_size = (k: number) => {
  if (!$img.value || !$el.value) return img_size;
  const el_aspect = $el.value.offsetWidth / $el.value.offsetHeight;
  const aspect = $img.value.naturalWidth / $img.value.naturalHeight;
  if (!aspect) return img_size;
  if (aspect <= 1 || el_aspect < 1) {
    img_size.h = h.value * (100 * k);
    img_size.w = img_size.h * aspect;
  } else {
    img_size.w = w.value * (100 * k);
    img_size.h = img_size.w / aspect;
  }
  return img_size;
};
/**
 * Коэффициент размера фото
 */
const img_size_k = ref(1);
/**
 * Функция зума фото
 * @param z
 */
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
/**
 * Позация по умолчания
 * @param size
 */
const get_default_pos = (size: { w: number; h: number }): { l: number; t: number } => {
  let l = w.value * 50;
  let t = h.value * 50;
  if (size.w) l -= size.w / 2;
  if (size.h) t -= size.h / 2;
  return { l, t };
};
/**
 * Игнорировать ограничения позиции фото
 */
const ignore = ref(false);
/**
 * Установка позиций и размеров по умолчанию для фото и кропа
 */
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
  if (props.src) {
    setTimeout(() => (ignore.value = false));
    setTimeout(setCrop);
  }
};
/**
 * Фото для кропа
 */
const src = computed((): string => props.src);
/**
 * Слежение за изменение фото для кропа
 */
watch(src, () => setTimeout(set_default));
/**
 * При загрузке dom
 */
onMounted(set_default);
/**
 * События
 */
const emit = defineEmits(["update:modelValue"]);
/**
 * Установить обрезанное изображение
 */
const setCrop = () => {
  if (!$img.value) return;
  const croppedImage = crop(
    $img.value,
    crop_pos.value.l - img_pos.value.l,
    crop_pos.value.t - img_pos.value.t,
    crop_size.w,
    crop_size.h
  );
  emit("update:modelValue", croppedImage);
};
/**
 * Обрезать изображение
 */
const crop = (
  image: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number
): string => {
  const cnvs = document.createElement("canvas");
  const wk = image.naturalWidth / image.width;
  const hk = image.naturalHeight / image.height;
  cnvs.width = dw * wk;
  cnvs.height = dh * hk;
  if (!cnvs) return "";
  const cntx = cnvs.getContext("2d");
  if (!cntx) return "";
  cntx.drawImage(image, dx * wk, dy * hk, dw * wk, dh * hk, 0, 0, dw * wk, dh * hk);
  return cnvs.toDataURL();
};
</script>

<template>
  <div class="n-cropper" ref="$el">
    <!-- Контролы зума -->
    <span class="zoom">
      <!-- Больше -->
      <span @click="zoom('+')">+</span>
      <!-- Меньше -->
      <span @click="zoom('-')">-</span>
    </span>
    <!-- Фото -->
    <img
      :class="{ 'is-drag': img_drag.isDrag.value }"
      ref="$img"
      alt="SRC Image"
      :style="[get_size_style(img_size), get_pos_style(img_pos)]"
      :src="src"
    />
    <!-- Кроп -->
    <div
      :class="{ 'is-drag': crop_drag.isDrag.value || p_drag.isDrag.value }"
      class="crop"
      ref="$crop"
      :style="[
        get_size_style(crop_size),
        get_pos_style(crop_pos),
        { minWidth: `${crop_min_size.w}px`, minHeight: `${crop_min_size.h}px` },
      ]"
    >
      <!-- Точки кропа -->
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
      <!-- Крестик в центре кропа -->
      <span></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Все перменные стилей в папке assets/style/n-components/cropper.scss
.n-cropper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-image: url(./assets/image/bg.png);
  user-select: none;
  height: 500px;
  width: 700px;
  // Зум
  .zoom {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 100;
  }
  // Фото
  img {
    position: absolute;
    display: inline-flex;
  }
  // Кроп
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
    // крестик
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
    // Точка
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
