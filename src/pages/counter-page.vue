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

import { ESize } from '@/components/enums';
import NCounter from '@/components/counter/n-counter.vue';
import { EType } from '@/components/input/enums';

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
    Name: 'modelValue',
    Type: 'number | undefined',
    Default: 'undefined',
    Description: 'Значение',
  }),
  new Prop({
    Name: 'placeholder',
    Type: 'string',
    Default: "''",
    Description: 'Заполнитель',
  }),
  new Prop({
    Name: 'min',
    Type: 'number',
    Default: 'undefined',
    Description: 'Минимум',
  }),
  new Prop({
    Name: 'max',
    Type: 'number',
    Default: 'undefined',
    Description: 'Максимум',
  }),
  new Prop({
    Name: 'step',
    Type: 'number',
    Default: '1',
    Description: 'Шаг',
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
    Name: 'success',
    Type: 'boolean',
    Default: 'false',
    Description: 'Успех',
  }),
  new Prop({
    Name: 'warn',
    Type: 'boolean',
    Default: 'false',
    Description: 'Предупеждение',
  }),
  new Prop({
    Name: 'danger',
    Type: 'boolean',
    Default: 'false',
    Description: 'Ошибка',
  }),
  new Prop({
    Name: 'disabled',
    Type: 'boolean',
    Default: 'false',
    Description: 'Неактивность',
  }),
  new Prop({
    Name: 'input',
    Type: 'boolean',
    Default: 'false',
    Description: 'Ввод значения вручную',
  }),
  new Prop({
    Name: 'readonly',
    Type: 'boolean',
    Default: 'false',
    Description: 'Поле только для чтения',
  }),
].sort(alphabet);
/**
 * * События
 */
const emits = [
  new Emit({
    Name: 'update:modelValue',
    Description: 'Обновление значения',
    Type: new Type({
      Name: 'Function',
      FullName: '(value: number | undefined): void',
    }),
  }),
  new Emit({
    Name: 'focus',
    Description: 'Фокус на инпут',
    Type: new Type({
      Name: 'Function',
      FullName: '(target: HTMLInputElement): void',
    }),
  }),
  new Emit({
    Name: 'blur',
    Description: 'Снятие фокуса с инпута',
    Type: new Type({
      Name: 'Function',
      FullName: '(target: HTMLInputElement): void',
    }),
  }),
  new Emit({
    Name: 'up',
    Description: 'Шаг выше',
    Type: new Type({
      Name: 'Function',
      FullName: '(newValue: number): void',
    }),
  }),
  new Emit({
    Name: 'down',
    Description: 'Шаг ниже',
    Type: new Type({
      Name: 'Function',
      FullName: '(newValue: number): void',
    }),
  }),
].sort(alphabet);
/**
 * * Слоты
 */
const slots = [
  new Slot({
    Name: 'down',
    Description: 'Шаг ниже',
  }),
  new Slot({
    Name: 'up',
    Description: 'Шаг выше',
  }),
];
/**
 * * Делится
 */
const exposings = [
  new Exposing({
    Name: 'up',
    Description: 'Шаг выше',
    Type: new Type({
      Name: 'Function',
      FullName: '() => void',
    }),
  }),
  new Exposing({
    Name: 'down',
    Description: 'Шаг ниже',
    Type: new Type({
      Name: 'Function',
      FullName: '() => void',
    }),
  }),
  new Exposing({
    Name: 'focus',
    Description: 'Фокус',
    Type: new Type({
      Name: 'Function',
      FullName: '() => void',
    }),
  }),
  new Exposing({
    Name: 'blur',
    Description: 'Снятие фокуса',
    Type: new Type({
      Name: 'Function',
      FullName: '() => void',
    }),
  }),
  new Exposing({
    Name: '$field',
    Description: 'Поле для ввода',
    Type: 'HTMLInputElement | HTMLTextAreaElement | undefined',
  }),
];

/**
 * * Значение
 */
const modelValue = ref<number | undefined>(0);
/**
 * * Логи
 */
const logs: string[] = reactive(['logs']);
/**
 * * При обновлении значения
 */
function onUpdateModelValue(value: number | undefined) {
  modelValue.value = value;
  console.log('update:model-value', value);
  logs.push(`update:model-value value: ${value}`);
}
/**
 * * При шаге выше
 */
function onUp(value: number) {
  console.log('up', value);
  logs.push(`up value: ${value}`);
}
/**
 * * При шаге ниже
 */
function onDown(value: number) {
  console.log('down', value);
  logs.push(`down value: ${value}`);
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

    <section class="bg-second-0 f fd-col p-3 rg-3">
      <NCounter
        :model-value="modelValue"
        @update:model-value="onUpdateModelValue"
        :step="2"
        :min="-2"
        :max="10"
        placeholder="Placeholder"
        input
        :size="ESize.Large"
        @up="onUp"
        @down="onDown"
        @focus="onFocus"
        @blur="onBlur"
      >
        <template #down>-</template>
        <template #up>+</template>
      </NCounter>

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
      <pre v-highlightjs><code class="html">&lt;NCounter
  :model-value=&quot;modelValue&quot;
  @update:model-value=&quot;onUpdateModelValue&quot;
  :step=&quot;2&quot;
  :min=&quot;-2&quot;
  :max=&quot;10&quot;
  placeholder=&quot;Placeholder&quot;
  input
  :size=&quot;ESize.Large&quot;
  @up=&quot;onUp&quot;
  @down=&quot;onDown&quot;
  @focus=&quot;onFocus&quot;
  @blur=&quot;onBlur&quot;
&gt;
  &lt;template #down&gt;-&lt;/template&gt;
  &lt;template #up&gt;+&lt;/template&gt;
&lt;/NCounter&gt;</code></pre>
    </div>
  </section>

  <section class="info f fd-col rg-2">
    <h4 class="c-brand">#script</h4>

    <div class="p-3 bg-second-0 fs-small-p">
      <pre v-highlightjs><code class="typescript">/**
 * * Значение
 */
const modelValue = ref&lt;number | undefined&gt;(0);
/**
 * * Логи
 */
const logs: string[] = reactive(['logs']);
/**
 * * При обновлении значения
 */
function onUpdateModelValue(value: number | undefined) {
  modelValue.value = value;
  console.log('update:model-value', value);
  logs.push(&#x60;update:model-value value: ${value}&#x60;);
}
/**
 * * При шаге выше
 */
function onUp(value: number) {
  console.log('up', value);
  logs.push(&#x60;up value: ${value}&#x60;);
}
/**
 * * При шаге ниже
 */
function onDown(value: number) {
  console.log('down', value);
  logs.push(&#x60;down value: ${value}&#x60;);
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
