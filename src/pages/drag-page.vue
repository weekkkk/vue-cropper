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

import NDrag from '@/components/drag/n-drag.vue';
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
/**
 * * Драг элемент
 */
const drag = ref<InstanceType<typeof NDrag>>();
/**
 * * Во время перетаскивания зашел на элемент с классом из массива / droppableClasses /
 * @param target - Элемент на который зашли
 * @param id  - ID элемент на который зашли
 */
function onEnter(target: HTMLElement | undefined, id: number) {
  logs.push(`e: enter | target: ${target} | id: ${id}}`);
  console.log('enter', target, id);
  if (id == 3 && drag.value) {
    drag.value.stop();
  }
}
/**
 * * Во время перетаскивания покинул элемент с классом из массива / droppableClasses /
 * @param target - Элемент, на который ушли
 * @param id  - ID элемент, на который ушли
 */
function onLeave(target: HTMLElement | undefined, id: number) {
  logs.push(`e: leave | target: ${target} | id: ${id}}`);
  console.log('leave', target, id);
}
/**
 * * Начало перетаскивания
 * @param target - Элемент, который начали перетаскивать
 * @param id - ID элемента, который начали перетаскивать
 */
function onStart(target: HTMLElement | undefined, id: number) {
  logs.push(`e: start | target: ${target} | id: ${id}}`);
  console.log('start', target, id);
}
/**
 * * Конец перетаскивания
 * @param target - Элемент, на который заходили до этого
 * @param id - ID элемента, на который заходили до этого
 */
function onStop(target: HTMLElement | undefined, id: number) {
  logs.push(`e: stop | target: ${target} | id: ${id}}`);
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

    <section class="f fw-wrap g-3 ai-c p-3 bg-second-0">
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
      <pre v-highlightjs><code class="html">&lt;div
  class=&quot;w-100 bg-second-0 p-3 f fd-col ai-fs rg-3&quot;
  style=&quot;overflow: auto&quot;
&gt;
  &lt;NDrag
    ref=&quot;drag&quot;
    classes=&quot;bg-brand c-default p-3&quot;
    @enter=&quot;onEnter&quot;
    @leave=&quot;onLeave&quot;
    @start=&quot;onStart&quot;
    @stop=&quot;onStop&quot;
    :id=&quot;1&quot;
    :droppable-classes=&quot;['droppable-example']&quot;
    drag-class=&quot;n-drag-example drag&quot;
    grabbing-class=&quot;n-drag-example grabbing&quot;
    droppable-class=&quot;n-drag-example-droppable&quot;
  &gt;
    &lt;h1&gt;Drag Element&lt;/h1&gt;
  &lt;/NDrag&gt;

  &lt;div class=&quot;droppable-example p-5 bg-second-20 c-second-40&quot; id=&quot;2&quot;&gt;
    &lt;h1&gt;&lt;i&gt;Drop Zone&lt;/i&gt;&lt;/h1&gt;
  &lt;/div&gt;

  &lt;div class=&quot;droppable-example p-5 bg-danger c-default&quot; id=&quot;3&quot;&gt;
    &lt;h1&gt;&lt;i&gt;Stop Zone&lt;/i&gt;&lt;/h1&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
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
 * * Драг элемент
 */
const drag = ref&lt;InstanceType&lt;typeof NDrag&gt;&gt;();
/**
 * * Во время перетаскивания зашел на элемент с классом из массива / droppableClasses /
 * @param target - Элемент на который зашли
 * @param id  - ID элемент на который зашли
 */
function onEnter(target: HTMLElement | undefined, id: number) {
  logs.push(&#x60;e: enter | target: ${target} | id: ${id}}&#x60;);
  console.log('enter', target, id);
  if (id == 3 &amp;&amp; drag.value) {
    drag.value.stop();
  }
}
/**
 * * Во время перетаскивания покинул элемент с классом из массива / droppableClasses /
 * @param target - Элемент, на который ушли
 * @param id  - ID элемент, на который ушли
 */
function onLeave(target: HTMLElement | undefined, id: number) {
  logs.push(&#x60;e: leave | target: ${target} | id: ${id}}&#x60;);
  console.log('leave', target, id);
}
/**
 * * Начало перетаскивания
 * @param target - Элемент, который начали перетаскивать
 * @param id - ID элемента, который начали перетаскивать
 */
function onStart(target: HTMLElement | undefined, id: number) {
  logs.push(&#x60;e: start | target: ${target} | id: ${id}}&#x60;);
  console.log('start', target, id);
}
/**
 * * Конец перетаскивания
 * @param target - Элемент, на который заходили до этого
 * @param id - ID элемента, на который заходили до этого 
 */
function onStop(target: HTMLElement | undefined, id: number) {
  logs.push(&#x60;e: stop | target: ${target} | id: ${id}}&#x60;);
  console.log('stop', target, id);
}</code></pre>
    </div>
  </section>
</template>

<style lang="scss">
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
