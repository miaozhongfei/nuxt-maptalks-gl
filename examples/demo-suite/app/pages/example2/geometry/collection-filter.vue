<template>
  <!-- 3.16 GeometryCollection 条件查询：仅逃生舱可表达（filter + 表达式查询 模块无直接封装） -->
  <Example2DemoShell
    description="GeometryCollection.filter() 表达式条件查询子几何（对应官网 3.16）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/demos/example2/geometry/collection-filter/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
