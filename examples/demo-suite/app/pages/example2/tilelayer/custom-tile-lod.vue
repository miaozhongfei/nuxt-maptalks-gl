<template>
  <!-- 2.9 LOD和自定义瓦片图层 -->
  <Example2DemoShell
    description="TileLayer 携带独立 spatialReference/LOD，与地图 LOD 解耦（对应官网 2.9）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/tilelayer/custom-tile-lod/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/tilelayer/custom-tile-lod/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/tilelayer/custom-tile-lod/EscapeImpl.vue';
import MixedImpl from '~/components/example2/tilelayer/custom-tile-lod/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
