<template>
  <Example2DemoShell
    description="批量添加 5 个 Marker 到同一图层（对应官网 6.8）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/layer/batch-add/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/layer/batch-add/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/layer/batch-add/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/layer/batch-add/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
