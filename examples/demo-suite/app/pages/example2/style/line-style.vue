<template>
  <Example2DemoShell
    description="LineString 基础线样式：颜色/线宽/虚线/端点/连接点（对应官网 5.12）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/style/line-style/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/style/line-style/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/style/line-style/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/style/line-style/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
