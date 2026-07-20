<template>
  <!-- 2.2 添加多个瓦片图层 -->
  <Example2DemoShell
    description="同一地图叠加多个瓦片图层：底图 + 独立标注层（对应官网 2.2）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/tilelayer/multi-tilelayers/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/tilelayer/multi-tilelayers/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/tilelayer/multi-tilelayers/EscapeImpl.vue';
import MixedImpl from '~/components/example2/tilelayer/multi-tilelayers/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
