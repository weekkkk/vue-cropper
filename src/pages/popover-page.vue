<script lang="ts" setup>
import { reactive } from 'vue';
import {
  Info as Prop,
  Info as Emit,
  Info as Slot,
  Info as Exposing,
  Info,
  Type,
} from '@/models';
import InfoTable from '@/components/info-table.vue';

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

/**
 * * Логи
 */
const logs: string[] = reactive(['logs']);
</script>

<template>
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
</template>

<style lang="scss" scoped></style>
