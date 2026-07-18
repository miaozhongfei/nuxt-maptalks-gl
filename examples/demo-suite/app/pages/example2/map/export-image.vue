<template>
  <!-- 1.15 导出为图片 -->
  <Example2DemoShell
    description="把当前地图视图导出为 PNG（useMaptalksExport / 原生 toDataURL），对应官网「地图 - 导出为图片」"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/demos/example2/map/export-image/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/map/export-image/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/map/export-image/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
