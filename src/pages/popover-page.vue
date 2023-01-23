<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Color } from '@/components/enums';
import { Position } from '@/components/popover/enums';
import NPopover from '@/components/popover/n-popover.vue';

const pos = ref(Position.Right);
const positions = Object.values(Position);

const popover = ref<InstanceType<typeof NPopover>>();
onMounted(() =>
{
  console.log(NPopover);
  console.log(popover.value);
  console.log('onMounted');
  // popover.value?.open();
});
function onOpen(target: HTMLElement) {
  console.log('open', target);
}
function onClose(target: HTMLElement) {
  console.log('close', target);
}
function onFocus(target: HTMLElement) {
  console.log('focus', target);
}
function onBlur(target: HTMLElement) {
  console.log('blur', target);
}

function fp() {
  window.scroll(0, window.scrollY + 1);
}
function fm() {
  window.scroll(0, window.scrollY - 1);
}
</script>

<template>
  <div class="f cg-3 positions" @click.stop>
    {{ pos }}
    <label class="f cg-1" v-for="ps in positions" :key="ps">
      <input type="radio" v-model="pos" :value="ps" />
      {{ ps }}
    </label>
  </div>

  <div class="tt f cg-3">
    <button @click="fp">+</button>
    <button @click="fm">-</button>
  </div>

  <!-- width="200px" -->
  <NPopover
    ref="popover"
    class="test"
    classes="c-warn"
    @open="onOpen"
    @close="onClose"
    @focus="onFocus"
    @blur="onBlur"
    :color="Color.Brand"
    :position="pos"
  >
    <h2>Element</h2>
    <template #content>
      <h1>Bold</h1>
    </template>
  </NPopover>

  <img height="1000" />
</template>

<style lang="scss" scoped>
.tt {
  position: fixed;
  top: 0;
  left: 0;
}

.positions {
  position: fixed;
  top: 0;
  right: 0;
}

.test {
  position: relative;
  left: 0;
}
</style>
