<template>
  <Example2DemoShell
    description="矢量标注加描边和填充的模式填充效果（对应官网 5.4）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/style/vector-pattern/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/style/vector-pattern/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/style/vector-pattern/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/style/vector-pattern/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
