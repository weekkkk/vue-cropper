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

import NPopover from '@/components/popover/n-popover.vue';
import { EPosition } from '@/components/popover/enums';
import { EColor } from '@/components/enums';

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
    Name: 'position',
    Type: new Type({ Name: 'EPosition', FullName: JSON.stringify(EPosition) }),
    Default: 'EPosition.Bottom',
    Description: 'Позиция',
  }),
  new Prop({
    Name: 'color',
    Type: new Type({ Name: 'EColor', FullName: JSON.stringify(EColor) }),
    Default: 'EColor.Default',
    Description: 'Цвет',
  }),
  new Prop({
    Name: 'width',
    Type: 'string',
    Default: "'auto'",
    Description: 'Ширина',
  }),
  new Prop({
    Name: 'classes',
    Type: 'string',
    Default: "''",
    Description: 'Классы контента',
  }),
  new Prop({
    Name: 'tooltip',
    Type: 'string',
    Default: "''",
    Description: 'Режим тултипа',
  }),
  new Prop({
    Name: 'droppableClasses',
    Type: 'boolean',
    Default: 'false',
    Description: 'Режим тултипа',
  }),
].sort(alphabet);
/**
 * * События
 */
const emits = [
  new Emit({
    Name: 'open',
    Description: 'Стал виден контент',
    Type: new Type({
      Name: 'Function',
      FullName: '(target: HTMLElement): void',
    }),
  }),
  new Emit({
    Name: 'close',
    Description: 'Контент стал невиден',
    Type: new Type({
      Name: 'Function',
      FullName: '(target: HTMLElement): void',
    }),
  }),
  new Emit({
    Name: 'focus',
    Description: 'Фокус на элемент поповера',
    Type: new Type({
      Name: 'Function',
      FullName: '(target: HTMLElement) => void',
    }),
  }),
  new Emit({
    Name: 'blur',
    Description: 'Снятие фокуса с элемента поповера',
    Type: new Type({
      Name: 'Function',
      FullName: '(target: HTMLElement) => void',
    }),
  }),
].sort(alphabet);
/**
 * * Слоты
 */
const slots = [
  new Slot({
    Name: 'default',
    Description: 'Элемент поповера',
  }),
  new Slot({
    Name: 'content',
    Description: 'Контент поповера',
  }),
];
/**
 * * Делится
 */
const exposings = [
  new Exposing({
    Name: 'open',
    Description: 'Показать контент',
    Type: new Type({
      Name: 'Function',
      FullName: '() => Promise<void>',
    }),
  }),
  new Exposing({
    Name: 'close',
    Description: 'Скрыть контент',
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

  <section class="f fd-col rg-2">
    <h4 class="c-brand">#example</h4>

    <section class="bg-second-0 f fd-col p-3 rg-3">
      <NPopover class="p-3 bg-brand c-default" classes="p-3">
        <template #content>
          <h1>Popover Content</h1>
        </template>

        <h1>Popover Element</h1>
      </NPopover>
    </section>
  </section>
</template>

<style lang="scss" scoped></style>
