<template>
  <Example2DemoShell
    description="创建地图并加载 carto light 底图（对应官网「地图 - 显示」）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/map/load/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/map/load/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/map/load/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/map/load/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
