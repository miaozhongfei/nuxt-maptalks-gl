<template>
  <!-- 2.4 WMS瓦片图层 -->
  <Example2DemoShell
    description="WMS GetMap 叠加图层（ahocevar GeoServer topp:states，对应官网 2.4；服务数据仅覆盖美国，中心点例外不设陆家嘴）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/components/example2/tilelayer/wms/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/tilelayer/wms/EscapeImpl.vue';
import MixedImpl from '~/components/example2/tilelayer/wms/MixedImpl.vue';

// 模块无 WMS 组件，仅 Composable / 组合 / 逃生舱 三 tab
const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
