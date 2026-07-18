<template>
  <!-- 2.7 ArcGIS瓦片图层 -->
  <Example2DemoShell
    description="直接以 REST tile 模板加载 ArcGIS Online 瓦片服务（对应官网 2.7）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/tilelayer/arcgis/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/tilelayer/arcgis/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/tilelayer/arcgis/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/tilelayer/arcgis/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
