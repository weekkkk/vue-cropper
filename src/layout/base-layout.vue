<template>
  <div class="base-layout f jc-c bg-second-0">
    <div class="inner f cg-4 p-4">
      <sidebar-layout></sidebar-layout>
      <div class="container f fd-col px-3 pb-3 rg-3 bg-default">
        <h4 class="c-brand bb py-3">@{{ (route.meta?.Title as string).toLowerCase() }}</h4>
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
  .inner {
    width: 100%;
    max-width: 1024px;
  }
  .container {
    width: 100%;
  }
}
</style>
