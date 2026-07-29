<template>
  <Example2DemoShell
    description="批量添加文字 Marker + LineString + Polygon 到同一图层（对应官网 6.8）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/layer/batch-add/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/layer/batch-add/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/layer/batch-add/EscapeImpl.vue';
import MixedImpl from '~/components/example2/layer/batch-add/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
