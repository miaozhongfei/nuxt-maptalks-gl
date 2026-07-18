<template>
  <!-- 2.8 WMTS瓦片图层 -->
  <Example2DemoShell
    description="以 WMTS RESTful 模板加载 USGS 瓦片矩阵集（GoogleMapsCompatible，对应官网 2.8；服务数据仅覆盖美国，中心点例外不设陆家嘴；该演示源在部分网络下不可达，可替换为任意同协议源）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/tilelayer/wmts/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/tilelayer/wmts/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/tilelayer/wmts/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/tilelayer/wmts/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
