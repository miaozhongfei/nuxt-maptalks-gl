<template>
  <!-- 1.17 自定义地图LOD -->
  <Example2DemoShell
    description="用自定义 spatialReference.resolutions 控制地图 LOD 级数，对应官网「地图 - 自定义地图LOD」。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/map/custom-lod/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/map/custom-lod/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/map/custom-lod/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/map/custom-lod/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
