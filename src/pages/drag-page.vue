<script lang="ts" setup>
// import NDragGroup from '@/components/drag/n-drag-group.vue';
// import { EMode, EType } from '@/components/drag/enums';
// import { ref } from 'vue';
import { Prop, Emit } from '@/models';

import NDrag from '@/components/drag/n-drag.vue';
import InfoTable from '@/components/info-table.vue';

function alphabet(a: { Name: string }, b: { Name: string }) {
  var nameA = a.Name.toLowerCase(),
    nameB = b.Name.toLowerCase();
  if (nameA < nameB)
    //сортируем строки по возрастанию
    return -1;
  if (nameA > nameB) return 1;
  return 0; // Никакой сортировки
}

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

const emits = [
  new Emit({
    Name: 'start',
    Description: 'Начало перетаскивания',
    Type: '(target: HTMLElement | undefined, id: number) => any',
  }),
].sort(alphabet);
</script>

<template>
  <section class="info f fd-col rg-3">
    <h4 class="c-brand">#props</h4>

    <InfoTable :rows="props" />
  </section>

  <section class="info f fd-col rg-3">
    <h4 class="c-brand">#emits</h4>

    <InfoTable :rows="emits" />
  </section>

  <NDrag @start='' @enter='' />
</template>

<style lang="scss">
section.info {
  overflow: auto;
}
</style>
