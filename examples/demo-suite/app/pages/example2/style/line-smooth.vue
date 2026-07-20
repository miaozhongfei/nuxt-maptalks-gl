<template>
  <Example2DemoShell
    description="smoothness: 'high' 曲线平滑处理（对应官网 5.19；平滑是构造选项，组件不支持）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/components/example2/style/line-smooth/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/style/line-smooth/EscapeImpl.vue';
import MixedImpl from '~/components/example2/style/line-smooth/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
