<template>
  <Example2DemoShell
    description="arrowStyle: 'classic' 带箭头的线（对应官网 5.16；箭头是 LineString 构造选项，组件不支持）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/components/example2/style/line-arrow/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/style/line-arrow/EscapeImpl.vue';
import MixedImpl from '~/components/example2/style/line-arrow/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
