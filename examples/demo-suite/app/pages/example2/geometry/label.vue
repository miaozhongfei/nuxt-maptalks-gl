<template>
  <Example2DemoShell
    description="Label 文字标签（对应官网 3.10）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/geometry/label/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/geometry/label/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/geometry/label/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/geometry/label/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
