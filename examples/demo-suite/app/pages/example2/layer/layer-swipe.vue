<template>
  <Example2DemoShell
    description="两张同步地图并排对比不同底图样式（对应官网 6.17 图层卷帘效果）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/layer/layer-swipe/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/layer/layer-swipe/ComposableImpl.vue';
import MixedImpl from '~/components/example2/layer/layer-swipe/MixedImpl.vue';
import EscapeImpl from '~/components/example2/layer/layer-swipe/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
