<script lang="ts" setup>
// import NDragGroup from '@/components/drag/n-drag-group.vue';
// import { EMode, EType } from '@/components/drag/enums';
import { onMounted } from 'vue';
import { Prop, Emit, Slot, Exposing } from '@/models';

import NDrag from '@/components/drag/n-drag.vue';
import InfoTable from '@/components/info-table.vue';
import NPopover from '@/components/popover/n-popover.vue';

function alphabet(a: { Name: string }, b: { Name: string }) {
  var nameA = a.Name.toLowerCase(),
    nameB = b.Name.toLowerCase();
  if (nameA < nameB)
    return -1;
  if (nameA > nameB) return 1;
  return 0;
}

const format = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

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
]
  .sort(alphabet)
  .map((el) => {
    el.Name = format(el.Name);
    return el;
  });

/**
 * * События
 */
const emits = [
  new Emit({
    Name: 'start',
    Description: 'Начало перетаскивания',
    Type: 'Function',
    FullType: '(target: HTMLElement | undefined, id: number) => void',
  }),
  new Emit({
    Name: 'stop',
    Description: 'Конец перетаскивания',
    Type: 'Function',
    FullType: '(target: HTMLElement | undefined, id: number) => void',
  }),
  new Emit({
    Name: 'enter',
    Description:
      'Во время перетаскивания зашел на элемент с классом из массива / droppableClasses /',
    Type: 'Function',
    FullType: '(target: HTMLElement | undefined, id: number) => void',
  }),
  new Emit({
    Name: 'leave',
    Description:
      'Во время перетаскивания покинул элемент с классом из массива / droppableClasses /',
    Type: 'Function',
    FullType: '(target: HTMLElement | undefined, id: number) => void',
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
    Type: 'Function',
    FullType: '() => void',
  }),
];
</script>

<template>
  <section class="info f fd-col rg-2">
    <h4 class="c-brand">#props</h4>

    <InfoTable :rows="props" :customize="['Type']">
      <template #default="{ value }">
        <mark class="bg-second-0 c-second-100">{{ value }}</mark>
      </template>
    </InfoTable>
  </section>

  <section class="info f fd-col rg-2">
    <h4 class="c-brand">#emits</h4>

    <InfoTable :rows="emits" :exclude="['FullType']" :customize="['Type']">
      <template #default="{ row, value }">
        <NPopover width="max-content">
          <template #content>
            <div class="p-2">
              <mark class="fs-small-p bg-second-0 c-second-100 px-1">
                {{ (row as Emit).FullType }}
              </mark>
            </div>
          </template>
          <mark class="fs-p bg-second-0 c-second-100">{{ value }}*</mark>
        </NPopover>
      </template>
    </InfoTable>
  </section>

  <section class="info f fd-col rg-2">
    <h4 class="c-brand">#slots</h4>

    <InfoTable :rows="slots" />
  </section>

  <section class="info f fd-col rg-2">
    <h4 class="c-brand">#exposings</h4>

    <InfoTable :rows="exposings" :exclude="['FullType']" :customize="['Type']">
      <template #default="{ row, value }">
        <NPopover width="max-content">
          <template #content>
            <div class="p-2">
              <mark class="fs-small-p bg-second-0 c-second-100 px-1">
                {{ (row as Emit).FullType }}
              </mark>
            </div>
          </template>
          <mark class="fs-p bg-second-0 c-second-100">{{ value }}*</mark>
        </NPopover>
      </template>
    </InfoTable>
  </section>

  <NDrag @enter="" />
</template>

<style lang="scss">
section.info {
  overflow: auto;
}
</style>
