<template>
  <div class="base-layout f j-c">
    <div class="inner f cg-4 p-4">
      <sidebar-layout></sidebar-layout>
      <div class="container f d-c px-3 pb-3 rg-3">
        <h4 class="c-main bb py-3">@{{ (route.meta?.Title as string).toLowerCase() }}</h4>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import SidebarLayout from "./sidebar-layout.vue";
/**
 * Роут
 */
const route = useRoute();
</script>

<style lang="scss" scoped>
.base-layout {
  min-height: 100vh;
  background-color: var(--n-background-disabled);
  .inner {
    width: 100%;
    max-width: 1024px;
  }
  .container {
    width: 100%;
    background-color: var(--n-background);
  }
}
</style>
