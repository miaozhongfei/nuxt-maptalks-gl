<template>
  <Example2DemoShell
    description="MultiLineString 多线几何（对应官网 3.6）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/geometry/multilinestring/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/geometry/multilinestring/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/geometry/multilinestring/EscapeImpl.vue';
import MixedImpl from '~/components/example2/geometry/multilinestring/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
