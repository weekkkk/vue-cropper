<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Position } from '@/components/popover/enums';
import NPopover from '@/components/popover/n-popover.vue';

const pos = ref(Position.Bottom);
const positions = Object.values(Position).filter(
  (el) => Number(el) || el == '0'
);

const popover = ref<InstanceType<typeof NPopover>>();
onMounted(() =>
{
  console.log(popover.value);
  popover.value?.open();
});
// function onOpen(target: HTMLElement) {
//   console.log('open', target);
// }
// function onClose(target: HTMLElement) {
//   console.log('close', target);
// }
// function onFocus(target: HTMLElement) {
//   console.log('focus', target);
// }
// function onBlur(target: HTMLElement) {
//   console.log('blur', target);
// }
</script>

<template>
  <div class="f cg-3 positions" @click.stop>
    {{ pos }}
    <label class="f cg-1" v-for=" ps  in positions" :key="ps">
      <input type="radio" v-model="pos" :value="ps" />
      {{ ps }}
    </label>
  </div>
  <!-- @open="onOpen"
    @close="onClose"
    @focus="onFocus"
    @blur="onBlur" -->
  <img height="1000"/>

  <NPopover class='test' ref="popover" :position="pos">
    <h2>Element</h2>
  </NPopover>

  <img height="1000" />
</template>

<style lang="scss" scoped>
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
