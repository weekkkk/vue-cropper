<template>
  <div class="burder bg-second-0 p-1" @click.stop="onOpen">
    <span></span>
  </div>
  <transition name="scale_sidebar">
    <div class="sidebar-layout f fd-col px-3 pb-3 rg-2 bg-default" v-show="isOpen">
      <h3 class="c-brand py-3 bb">@n-components</h3>
      <div
        class="link py-2"
        :class="{
          'c-brand': route.name == link.name,
          'c-base': route.name != link.name,
        }"
        v-for="link in links"
        :key="link.name"
        @click="router.push(link)"
      >
        {{ link.meta?.Title }}
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { routes } from '@/router';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
/**
 * Ссылки
 */
const links = computed(() => routes[0].children);
/**
 * Роутер
 */
const router = useRouter();
/**
 * Роут
 */
const route = useRoute();
/**
 * Открыта ли панель
 */
const isOpen = ref(false);
/**
 * При смене видимости
 */
const onOpen = () => {
  if (window.innerWidth <= 1124) {
    isOpen.value = !isOpen.value;
  } else if (isOpen.value) isOpen.value = false;
};
/**
 * При смене видимости
 */
const onClose = () => {
  isOpen.value = false;
};
/**
 * Слушатель кликов
 */
window.addEventListener('click', onClose);
</script>

<style lang="scss" scoped>
.sidebar-layout {
  min-width: 240px;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
  .link {
    cursor: pointer;
    &:not(.c-brand) {
      &:hover {
        filter: brightness(110%);
      }
      &:active {
        filter: brightness(90%);
      }
    }
  }
  @media (min-width: 1125px) {
    display: flex !important;
  }
  @media (max-width: 1124px) {
    position: fixed;
    // top: 24px;
    // bottom: 24px;
    box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.5);
  }
}
.burder {
  position: fixed;
  cursor: pointer;
  top: 0;
  left: 0;
  display: none;
  flex-direction: column;
  height: 24px;
  width: 24px;
  justify-content: space-between;
  &::before,
  &::after,
  span {
    content: '';
    display: inline-block;
    height: 2px;
    width: 100%;
    background-color: var(--n-second-100);
  }
  @media (max-width: 1124px) {
    display: flex;
  }
}
.scale_sidebar-enter-active,
.scale_sidebar-leave-active {
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;
  transition-property: opacity transform;
}
.scale_sidebar-enter-from,
.scale_sidebar-leave-to {
  transform: translateX(-100%);
  transform-origin: left;
  opacity: 0;
}
</style>
