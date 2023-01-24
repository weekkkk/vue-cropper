<script lang="ts" setup>
// import NDragGroup from '@/components/drag/n-drag-group.vue';
// import { EMode, EType } from '@/components/drag/enums';
// import { ref } from 'vue';
import { Prop } from '@/models';

import NDrag from '@/components/drag/n-drag.vue';

const props = [
  new Prop({
    Name: 'id',
    Type: 'string',
    Default: 'undefined',
    Description: 'id элемента',
  }),
  new Prop({
    Name: 'id',
    Type: 'string',
    Default: 'undefined',
    Description: 'id элемента',
  }),
];
</script>

<template>
  <section class="f fd-col">
    <h4 class="c-brand">#props</h4>

    <table class="ta-l fw-medium">
      <tr class="c-second-100">
        <th>name</th>
        <th>type</th>
        <th>default</th>
        <th>description</th>
      </tr>

      <tr v-for="prop in props" :key="prop.Name">
        <td>{{ prop.Name }}</td>
        <td class="c-danger">{{ prop.Type }}</td>
        <td class="c-brand">{{ prop.Default }}</td>
        <td>{{ prop.Description }}</td>
      </tr>
    </table>
  </section>

  <NDrag />
</template>

<style lang="scss"></style>
