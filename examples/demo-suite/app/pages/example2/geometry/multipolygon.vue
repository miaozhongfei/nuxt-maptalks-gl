<template>
  <Example2DemoShell
    description="MultiPolygon 多面几何（对应官网 3.7）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/geometry/multipolygon/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/geometry/multipolygon/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/geometry/multipolygon/EscapeImpl.vue';
import MixedImpl from '~/components/example2/geometry/multipolygon/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
