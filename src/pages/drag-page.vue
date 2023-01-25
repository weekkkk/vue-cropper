<script lang="ts" setup>
// import NDragGroup from '@/components/drag/n-drag-group.vue';
// import { EMode, EType } from '@/components/drag/enums';
import { reactive, ref } from 'vue';
import {
  Info as Prop,
  Info as Slot,
  Info as Emit,
  Info as Exposing,
  Info,
  Type,
} from '@/models';

import NDrag from '@/components/drag/n-drag.vue';
import InfoTable from '@/components/info-table.vue';
import NPopover from '@/components/popover/n-popover.vue';

function alphabet(a: Info, b: Info) {
  var nameA = a.Name.toLowerCase(),
    nameB = b.Name.toLowerCase();
  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
}
const format = (rows: Info[]) =>
  rows.map((row) => {
    row.Name = row.Name.replace(
      /[A-Z]/g,
      (letter) => `-${letter.toLowerCase()}`
    );
    return row;
  });

/**
 * * Свойства
 */
const props = [
  new Prop({
    Name: 'id',
    Type: 'number',
    Default: '-1',
    Description: 'ID элемента',
  }),
  new Prop({
    Name: 'classes',
    Type: 'string',
    Default: "''",
    Description: 'Классы элемента и его копии',
  }),
  new Prop({
    Name: 'dragClass',
    Type: 'string',
    Default: "''",
    Description: 'Класс элемента, при перетаскивании его копии',
  }),
  new Prop({
    Name: 'grabbingClass',
    Type: 'string',
    Default: "''",
    Description: 'Класс клона, который перетаскиваем',
  }),
  new Prop({
    Name: 'droppableClass',
    Type: 'string',
    Default: "''",
    Description: 'Класс элемента на который дропают текщий',
  }),
  new Prop({
    Name: 'droppableClasses',
    Type: 'string[]',
    Default: "['droppable']",
    Description: 'Классы элементов на которые может дропаться текщий',
  }),
].sort(alphabet);
/**
 * * События
 */
const emits = [
  new Emit({
    Name: 'start',
    Description: 'Начало перетаскивания',
    Type: new Type({
      Name: 'Function',
      FullName: '(target: HTMLElement | undefined, id: number) => void',
    }),
  }),
  new Emit({
    Name: 'stop',
    Description: 'Конец перетаскивания',
    Type: new Type({
      Name: 'Function',
      FullName: '(target: HTMLElement | undefined, id: number) => void',
    }),
  }),
  new Emit({
    Name: 'enter',
    Description:
      'Во время перетаскивания зашел на элемент с классом из массива / droppableClasses /',
    Type: new Type({
      Name: 'Function',
      FullName: '(target: HTMLElement | undefined, id: number) => void',
    }),
  }),
  new Emit({
    Name: 'leave',
    Description:
      'Во время перетаскивания покинул элемент с классом из массива / droppableClasses /',
    Type: new Type({
      Name: 'Function',
      FullName: '(target: HTMLElement | undefined, id: number) => void',
    }),
  }),
].sort(alphabet);
/**
 * * Слоты
 */
const slots = [
  new Slot({
    Name: 'default',
    Description: 'Контент элемента',
  }),
];
/**
 * * Делится
 */
const exposings = [
  new Exposing({
    Name: 'stop',
    Description: 'Остановить перетаскивание',
    Type: new Type({
      Name: 'Function',
      FullName: '() => void',
    }),
  }),
];

const logs: string[] = reactive([]);

const drag = ref<InstanceType<typeof NDrag>>();

function onEnter(target: HTMLElement | undefined, id: number) {
  logs.push(`enter ${target} ${id}}`);
  console.log('enter', target, id);
  if (id == 3 && drag.value) {
    drag.value.stop();
  }
}
function onLeave(target: HTMLElement | undefined, id: number) {
  logs.push(`leave ${target} ${id}}`);
  console.log('leave', target, id);
}
function onStart(target: HTMLElement | undefined, id: number) {
  logs.push(`start ${target} ${id}}`);
  console.log('start', target, id);
}
function onStop(target: HTMLElement | undefined, id: number) {
  logs.push(`stop ${target} ${id}}`);
  console.log('stop', target, id);
}
</script>

<template>
  <RouterView name="slots" />
  <section class="info f fd-col rg-2">
    <h4 class="c-brand">#props</h4>

    <InfoTable :rows="format(props)" />
  </section>

  <section class="info f fd-col rg-2">
    <h4 class="c-brand">#emits</h4>

    <InfoTable :rows="format(emits)" />
  </section>

  <section class="info f fd-col rg-2">
    <h4 class="c-brand">#slots</h4>

    <InfoTable :rows="format(slots)" />
  </section>

  <section class="info f fd-col rg-2">
    <h4 class="c-brand">#exposings</h4>

    <InfoTable :rows="format(exposings)" />
  </section>

  <section class="f fd-col rg-2">
    <h4 class="c-brand">#example</h4>

    <section class="f">
      <aside
        class="w-100 bg-second-0 p-3 f fd-col ai-fs rg-3"
        style="overflow: auto"
      >
        <NDrag
          ref="drag"
          classes="bg-brand c-default p-3"
          @enter="onEnter"
          @leave="onLeave"
          @start="onStart"
          @stop="onStop"
          :id="1"
          :droppable-classes="['droppable-example']"
          drag-class="n-drag-example drag"
          grabbing-class="n-drag-example grabbing"
          droppable-class="n-drag-example-droppable"
        >
          <h1>Drag Element</h1>
        </NDrag>

        <div class="droppable-example p-5 bg-second-20 c-second-40" id="2">
          <h1><i>Drop Zone</i></h1>
        </div>

        <div class="droppable-example p-5 bg-danger c-default" id="3">
          <h1><i>Stop Zone</i></h1>
        </div>
      </aside>

      <textarea
        style="min-width: 200px"
        :value="logs.toString().replaceAll(',', '\n')"
        class="h-100 w-100 bg-second-100 p-3 c-default"
        readonly
      />
    </section>
  </section>
</template>

<style lang="scss">
section.info {
  overflow: auto;
}

.n-drag-example {
  &.drag {
    opacity: 0.2;
  }
  &.grabbing {
    opacity: 0.4;
  }
  &.droppable-el {
    box-shadow: 0 0 16px var(--n-brand);
  }
  &-droppable {
    box-shadow: 0 0 16px var(--n-brand);
  }
}
</style>
