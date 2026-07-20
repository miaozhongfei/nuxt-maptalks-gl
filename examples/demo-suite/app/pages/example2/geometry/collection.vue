<template>
  <!-- 3.4 GeometryCollection：仅逃生舱可表达（模块无直接封装） -->
  <Example2DemoShell
    description="GeometryCollection：多个几何组合为一个整体统一管理（对应官网 3.4）。"
    :tabs="tabs"
  >
    <template #explanation>
      GeometryCollection 将多个几何组合为一个整体（模块无封装，走逃生舱）
    </template>
  </Example2DemoShell>
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/components/example2/geometry/collection/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
