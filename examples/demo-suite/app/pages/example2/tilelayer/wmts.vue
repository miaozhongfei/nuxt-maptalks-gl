<template>
  <!-- 2.8 WMTS瓦片图层 -->
  <Example2DemoShell
    description="天地图影像 WMTS（EPSG:3857 Web 墨卡托），对应官网「瓦片图层与地理投影 - WMTS瓦片图层」。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/tilelayer/wmts/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/tilelayer/wmts/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/tilelayer/wmts/EscapeImpl.vue';
import MixedImpl from '~/components/example2/tilelayer/wmts/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
