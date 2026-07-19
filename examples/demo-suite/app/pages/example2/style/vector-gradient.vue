<template>
  <Example2DemoShell
    description="矢量标注用渐变填充（对应官网 5.5；gl 版可能降级为纯色）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/style/vector-gradient/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/style/vector-gradient/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/style/vector-gradient/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/style/vector-gradient/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
