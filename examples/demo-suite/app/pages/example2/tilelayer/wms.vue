<template>
  <!-- 2.4 WMS瓦片图层 -->
  <Example2DemoShell
    description="EPSG:4326 + terrestris OSM-WMS 全球服务（WMS 作为底图），对应官网「瓦片图层与地理投影 - WMS瓦片图层」。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/components/example2/tilelayer/wms/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/tilelayer/wms/EscapeImpl.vue';
import MixedImpl from '~/components/example2/tilelayer/wms/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
