<script lang="ts" setup>
import { reactive, ref } from 'vue';
import {
  Info as Prop,
  Info as Slot,
  Info as Emit,
  Info as Exposing,
  Info,
  Type,
} from '@/models';

import NDragGroup from '@/components/drag-group/n-drag-group.vue';
import InfoTable from '@/components/info-table.vue';
import { EMode, EType } from '@/components/drag-group/enums';

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
    Name: 'mode',
    Type: new Type({
      Name: 'EMode',
      FullName: JSON.stringify(EMode),
    }),
    Default: 'EMode.Record',
    Description: 'Тип перетаскивания',
  }),
  new Prop({
    Name: 'type',
    Type: new Type({
      Name: 'EType',
      FullName: JSON.stringify(EType),
    }),
    Default: 'EType.Swap',
    Description: 'Тип изменения',
  }),
  new Prop({
    Name: 'els',
    Type: '{ Id: number }[]',
    Default: '[]',
    Description: 'Значения',
  }),
  new Prop({
    Name: 'columns',
    Type: 'number',
    Default: '3',
    Description: 'Кол-во колонок',
  }),
  new Prop({
    Name: 'classes',
    Type: 'string',
    Default: "''",
    Description: 'Классы элементов группы',
  }),
  new Prop({
    Name: 'dragClass',
    Type: 'string',
    Default: "''",
    Description: 'Классы элемента, при перетаскивании его копии',
  }),
  new Prop({
    Name: 'grabbingClass',
    Type: 'string',
    Default: "''",
    Description: 'Классы клона, который перетаскиваем',
  }),
  new Prop({
    Name: 'droppableClass',
    Type: 'string',
    Default: "''",
    Description: 'Классы элемента на который дропают текщий',
  }),
].sort(alphabet);
/**
 * * События
 */
const emits = [
  new Emit({
    Name: 'update:els',
    Description: 'Обновление значений (сортировка)',
    Type: new Type({
      Name: 'Function',
      FullName: '(els: { Id: number }[]) => void',
    }),
  }),
  new Emit({
    Name: 'drop',
    Description: 'При окончании перетаскивания и дропе на элемент',
    Type: new Type({
      Name: 'Function',
      FullName:
        '(fromId: number | undefined, toId: number | undefined, targetFrom: HTMLElement | undefined, targetTo: HTMLElement | undefined) => void',
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
    Name: 'insert',
    Description: 'Вставить элемент',
    Type: new Type({
      Name: 'IFunction<number>',
      FullName: '(fromIndex: number, toIndex: number, elements: T[]): T[]',
    }),
  }),
  new Exposing({
    Name: 'swap',
    Description: 'Поменять элементы местами',
    Type: new Type({
      Name: 'IFunction<number>',
      FullName: '(fromIndex: number, toIndex: number, elements: T[]): T[]',
    }),
  }),
];

/**
 * * Тестовая модель элемента
 */
class El {
  Id!: number;
  Name!: string;
  constructor(obj?: Partial<El>) {
    if (obj) Object.assign(this, obj);
  }
}
/**
 * * Элементы группы
 */
const els = ref<El[]>([]);
for (let i = 0; i < 10; i++)
  els.value.push(
    new El({
      Id: i,
      Name: `Element ${i}`,
    })
  );
/**
 * * Логи
 */
const logs: string[] = reactive(['logs']);
/**
 * * При дропе на элемент
 */
function onDrop(
  fromId: number | undefined,
  toId: number | undefined,
  targetFrom: HTMLElement | undefined,
  targetTo: HTMLElement | undefined
) {
  logs.push(
    `drop fromId: ${fromId} toId: ${toId} targetFrom: ${targetFrom} targetTo: ${targetTo}`
  );
  console.log('drop', { fromId, toId, targetFrom, targetTo });
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

    <section class="f fw-wrap g-3 ai-c p-3 bg-second-0">
      <NDragGroup
        v-model:els="els"
        :mode="EMode.Record"
        :type="EType.Insert"
        @drop="onDrop"
        style="
          --n-drag-group-px: 0;
          --n-drag-group-py: 0;
          --n-drag-group-cg: 16px;
          --n-drag-group-rg: 16px;
        "
        classes="n-drag-group-example element f fd-col ai-c bg-brand c-default p-3"
        drag-class="n-drag-group-example drag"
        grabbing-class="n-drag-group-example grabbing"
        droppable-class="n-drag-group-example-droppable"
      >
        <template #default="{ el }">
          <h2>{{ (el as El).Name }}</h2>
        </template>
      </NDragGroup>

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
      <pre v-highlightjs><code class="html">&lt;NDragGroup
  v-model:els=&quot;els&quot;
  :mode=&quot;EMode.Record&quot;
  :type=&quot;EType.Insert&quot;
  @drop=&quot;onDrop&quot;
  style=&quot;
    --n-drag-group-px: 0;
    --n-drag-group-py: 0;
    --n-drag-group-cg: 16px;
    --n-drag-group-rg: 16px;
  &quot;
  classes=&quot;n-drag-group-example element f fd-col ai-c bg-brand c-default p-3&quot;
  drag-class=&quot;n-drag-group-example drag&quot;
  grabbing-class=&quot;n-drag-group-example grabbing&quot;
  droppable-class=&quot;n-drag-group-example-droppable&quot;
&gt;
  &lt;template #default=&quot;{ el }&quot;&gt;
    &lt;h2&gt;{ { (el as El).Name } }&lt;/h2&gt;
  &lt;/template&gt;
&lt;/NDragGroup&gt;</code></pre>
    </div>
  </section>

  <section class="info f fd-col rg-2">
    <h4 class="c-brand">#script</h4>

    <div class="p-3 bg-second-0 fs-small-p">
      <pre v-highlightjs><code class="typescript">/**
 * * Тестовая модель элемента
 */
class El {
  Id!: number;
  Name!: string;
  constructor(obj?: Partial&lt;El&gt;) {
    if (obj) Object.assign(this, obj);
  }
}
/**
 * * Элементы группы
 */
const els = ref&lt;El[]&gt;([]);
for (let i = 0; i &lt; 10; i++)
  els.value.push(
    new El({
      Id: i,
      Name: &#x60;Element ${i}&#x60;,
    })
  );
/**
 * * Логи
 */
const logs: string[] = reactive(['logs']);
/**
 * * При дропе на элемент
 */
function onDrop(
  fromId: number | undefined,
  toId: number | undefined,
  targetFrom: HTMLElement | undefined,
  targetTo: HTMLElement | undefined
) {
  logs.push(
    &#x60;drop fromId: ${fromId} toId: ${toId} targetFrom: ${targetFrom} targetTo: ${targetTo}&#x60;
  );
  console.log('drop', { fromId, toId, targetFrom, targetTo });
}</code></pre>
    </div>
  </section>
</template>

<style lang="scss">
.n-drag-group-example {
  &.drag {
    opacity: 0.5;
  }
  &.grabbing {
    opacity: 0.5;
  }
  &-droppable {
    &.element {
      box-shadow: 0 0 32px var(--n-warn);
    }
    &.separator.active {
      display: flex;
      justify-content: center;
      align-items: center;
      &::before {
        content: '';
        width: 4px;
        height: 40px;
        border-radius: 2px;
        background-color: var(--n-brand);
        box-shadow: 0 0 16px var(--n-warn);
      }
    }
  }
}
</style>
