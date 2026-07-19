<template>
  <Example2DemoShell
    description="MultiPoint 多点几何：一个对象承载多个点（对应官网 3.5）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/geometry/multipoint/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/geometry/multipoint/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/geometry/multipoint/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/geometry/multipoint/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
