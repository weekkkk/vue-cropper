<script lang="ts" setup>
import { ref } from 'vue';
import NDragGroup from '@/components/drag/n-drag-group.vue';
import { EMode, EType } from '@/components/drag/enums';

const ids = ref<number[]>([]);
for (let i = 0; i < 10; i++) {
  ids.value.push(i);
}

class test {
  Id: number = -1;
  Text: string = '';
  Image: string = '';
  constructor(obj?: Partial<test>) {
    if (obj) Object.assign(this, obj);
  }
}

const els = ref<test[]>([]);
for (let i = 0; i < 10; i++) {
  els.value.push(
    new test({
      Id: i,
      Text: `Element ${i}`,
      Image:
        'https://www.itprotoday.com/sites/itprotoday.com/files/styles/article_featured_retina/public/uploads/2014/08/clouds-595x335_1.jpg?itok=dy9WsmkJ',
    })
  );
}

function onDrop(
  fromId: number | undefined,
  toId: number | undefined,
  targetFrom: HTMLElement | undefined,
  targetTo: HTMLElement | undefined
) {
  console.log('onDrop', { fromId, toId, targetFrom, targetTo });
}
</script>

<template>
  <NDragGroup
    v-model:els="els"
    :mode="EMode.Record"
    :type="EType.Insert"
    @drop="onDrop"
    classes="group_el f fd-col ai-c rg-2 lh-no p-3"
    drag-class="group_drag-el"
    grabbing-class="group_grabbing-el"
    droppadle-class="group_droppadle-el"
  >
    <template #default="{ el }">
      <h1>{{ (el as test).Text }}</h1>
      <h4>{{ (el as test).Id }}</h4>
      <img :src="(el as test).Image" height="60" />
    </template>
  </NDragGroup>
</template>

<style lang="scss">
.group {
  &_el {
    background-color: lightgray;
    border-radius: 8px;
    box-shadow: 0 0 8px gray;
  }
  &_drag-el {
    opacity: 0.1;
  }
  &_grabbing-el {
    opacity: 0.5;
  }
  &_droppadle-el {
    &.n-drag-group_element {
      box-shadow: 0 0 8px blue;
    }
    &.separator.active {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      &::before {
        content: '';
        width: 4px;
        height: 80px;
        background-color: blue;
        box-shadow: 0 0 8px blue;
      }
    }
  }
}
</style>
