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
    Type: 'boolean',
    Default: 'false',
    Description: 'Режим тултипа',
  }),
  new Prop({
    Name: 'disabled',
    Type: 'boolean',
    Default: 'false',
    Description: 'Неактивность',
  }),
  new Prop({
    Name: 'noTeleport',
    Type: 'boolean',
    Default: 'false',
    Description: 'Неактивность телепорта',
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
/**
 * * При окрытии поповера
 */
function onOpen(target: HTMLElement) {
  console.log('open', target);
  logs.push(`open target: ${target}`);
}
/**
 * * При закрытии поповера
 */
function onClose(target: HTMLElement) {
  console.log('close', target);
  logs.push(`close target: ${target}`);
}
/**
 * * При фокусе на элемент поповера
 */
function onFocus(target: HTMLElement) {
  console.log('focus', target);
  logs.push(`focus target: ${target}`);
}
/**
 * * При потере фокуса элементом поповера
 */
function onBlur(target: HTMLElement) {
  console.log('blur', target);
  logs.push(`blur target: ${target}`);
}
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

    <section class="info bg-second-0 f fd-col p-3 rg-3">
      <NPopover
        class="p-3 bg-brand c-default"
        classes="p-3"
        :position="EPosition.Bottom"
        :color="EColor.Second"
        @focus="onFocus"
        @blur="onBlur"
        @open="onOpen"
        @close="onClose"
      >
        <template #content>
          <h1>Popover Content</h1>
        </template>

        <h1>Popover Element</h1>
      </NPopover>

      <textarea
        style="min-height: 264px; resize: none"
        :value="logs.toString().replaceAll(',', '\n\n')"
        class="w-100 bg-second-100 p-3 c-default"
        readonly
      />
    </section>
  </section>

  <section class="f fd-col rg-2">
    <h4 class="c-brand">#template</h4>

    <div class="p-3 bg-second-0 fs-small-p">
      <pre v-highlightjs><code class="html">&lt;NPopover
  class=&quot;p-3 bg-brand c-default&quot;
  classes=&quot;p-3&quot;
  :position=&quot;EPosition.Bottom&quot;
  :color=&quot;EColor.Second&quot;
  @focus=&quot;onFocus&quot;
  @blur=&quot;onBlur&quot;
  @open=&quot;onOpen&quot;
  @close=&quot;onClose&quot;
&gt;
  &lt;template #content&gt;
    &lt;h1&gt;Popover Content&lt;/h1&gt;
  &lt;/template&gt;

  &lt;h1&gt;Popover Element&lt;/h1&gt;
&lt;/NPopover&gt;</code></pre>
    </div>
  </section>

  <section class="info f fd-col rg-2">
    <h4 class="c-brand">#script</h4>

    <div class="p-3 bg-second-0 fs-small-p">
      <pre v-highlightjs><code class="typescript">/**
 * * Логи
 */
const logs: string[] = reactive(['logs']);
/**
 * * При окрытии поповера
 */
function onOpen(target: HTMLElement) {
  console.log('open', target);
  logs.push(&#x60;open target: ${target}&#x60;);
}
/**
 * * При закрытии поповера
 */
function onClose(target: HTMLElement) {
  console.log('close', target);
  logs.push(&#x60;close target: ${target}&#x60;);
}
/**
 * * При фокусе на элемент поповера
 */
function onFocus(target: HTMLElement) {
  console.log('focus', target);
  logs.push(&#x60;focus target: ${target}&#x60;);
}
/**
 * * При потере фокуса элементом поповера
 */
function onBlur(target: HTMLElement) {
  console.log('blur', target);
  logs.push(&#x60;blur target: ${target}&#x60;);
}</code></pre>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
