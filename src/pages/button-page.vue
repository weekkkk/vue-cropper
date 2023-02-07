<script lang="ts" setup>
import { reactive, ref } from 'vue';
import {
  Info as Prop,
  Info as Emit,
  Info as Slot,
  Info as Exposing,
  Info,
  Type,
} from '@/models';
import InfoTable from '@/components/info-table.vue';

import { EColor, ESize } from '@/components/enums';
import NButton from '@/components/button/n-button.vue';

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
    Name: 'color',
    Type: new Type({
      Name: 'EColor',
      FullName: JSON.stringify(EColor),
    }),
    Default: 'EColor.Default',
    Description: 'Цвет',
  }),
  new Prop({
    Name: 'size',
    Type: new Type({
      Name: 'ESize',
      FullName: JSON.stringify(ESize),
    }),
    Default: 'ESize.Default',
    Description: 'Размер',
  }),
  new Prop({
    Name: 'noFill',
    Type: 'boolean',
    Default: 'false',
    Description: 'Убрать заливку',
  }),
  new Prop({
    Name: 'square',
    Type: 'boolean',
    Default: 'false',
    Description: 'Убрать заливку',
  }),
  new Prop({
    Name: 'beforeIcon',
    Type: 'string',
    Default: 'undefined',
    Description: 'Иконка перед слотом',
  }),
  new Prop({
    Name: 'afterIcon',
    Type: 'string',
    Default: 'undefined',
    Description: 'Иконка после слота',
  }),
].sort(alphabet);
/**
 * * Слоты
 */
const slots = [
  new Slot({
    Name: 'default',
    Description: 'Контент',
  }),
];
</script>

<template>
  <section class="info f fd-col rg-2">
    <h4 class="c-brand">#props</h4>

    <InfoTable :rows="format(props)" />
  </section>

  <section class="info f fd-col rg-2">
    <h4 class="c-brand">#slots</h4>

    <InfoTable :rows="format(slots)" />
  </section>

  <section class="f fd-col rg-2">
    <h4 class="c-brand">#example</h4>

    <section class="bg-second-0 f fd-col ai-fs p-3 rg-3">
      <NButton :color="EColor.Brand" :size="ESize.Large"> Test Button </NButton>
    </section>
  </section>

  <section class="f fd-col rg-2">
    <h4 class="c-brand">#template</h4>

    <div class="p-3 bg-second-0 fs-small-p">
      <pre
        v-highlightjs
      ><code class="html">&lt;NButton :color=&quot;EColor.Brand&quot; :size=&quot;ESize.Large&quot;&gt; 
  Test Button 
&lt;/NButton&gt;</code></pre>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
