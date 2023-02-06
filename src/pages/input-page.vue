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
import NInput from '@/components/input/n-input.vue';
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
    Type: 'string | number | undefined',
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
    Name: 'rows',
    Type: 'number',
    Default: '3',
    Description: 'Кол-во строк в комметарии',
  }),
  new Prop({
    Name: 'type',
    Type: new Type({
      Name: 'EType',
      FullName: JSON.stringify(EType),
    }),
    Default: 'EType.Text',
    Description: 'Тип',
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
    Name: 'readonly',
    Type: 'boolean',
    Default: 'false',
    Description: 'Поле только для чтения',
  }),
  new Prop({
    Name: 'id',
    Type: 'string',
    Default: "''",
    Description: 'ID инпута',
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
      FullName: '(value: string | number | undefined): void',
    }),
  }),
  new Emit({
    Name: 'focus',
    Description: 'Фокус на инпут',
    Type: new Type({
      Name: 'Function',
      FullName: '(target: HTMLElement): void',
    }),
  }),
  new Emit({
    Name: 'blur',
    Description: 'Снятие фокуса с инпута',
    Type: new Type({
      Name: 'Function',
      FullName: '(target: HTMLElement): void',
    }),
  }),
].sort(alphabet);
/**
 * * Слоты
 */
const slots = [
  new Slot({
    Name: 'down',
    Description: 'Контент до инпута',
  }),
  new Slot({
    Name: 'after',
    Description: 'Контент после инпута',
  }),
];
/**
 * * Делится
 */
const exposings = [
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
const modelValue = ref<string>();
/**
 * * Логи
 */
const logs: string[] = reactive(['logs']);
/**
 * * При обновлении значения
 */
function onUpdateModelValue(value: string | number | undefined) {
  if (typeof value != 'number') modelValue.value = value;
  console.log('update:model-value', value);
  logs.push(`update:model-value value: ${value}`);
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
      <NInput
        :model-value="modelValue"
        @update:model-value="onUpdateModelValue"
        placeholder="Placeholder"
        :size="ESize.Large"
        :type="EType.Text"
        @focus="onFocus"
        @blur="onBlur"
      />

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
      <pre v-highlightjs><code class="html">&lt;NInput
  :model-value=&quot;modelValue&quot;
  @update:model-value=&quot;onUpdateModelValue&quot;
  placeholder=&quot;Placeholder&quot;
  :size=&quot;ESize.Large&quot;
  :type=&quot;EType.Text&quot;
  @focus=&quot;onFocus&quot;
  @blur=&quot;onBlur&quot;
/&gt;</code></pre>
    </div>
  </section>

  <section class="info f fd-col rg-2">
    <h4 class="c-brand">#script</h4>

    <div class="p-3 bg-second-0 fs-small-p">
      <pre v-highlightjs><code class="typescript">/**
 * * Значение
 */
const modelValue = ref&lt;string&gt;();
/**
 * * Логи
 */
const logs: string[] = reactive(['logs']);
/**
 * * При обновлении значения
 */
function onUpdateModelValue(value: string | number | undefined) {
  if (typeof value != 'number') modelValue.value = value;
  console.log('update:model-value', value);
  logs.push(&#x60;update:model-value value: ${value}&#x60;);
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
