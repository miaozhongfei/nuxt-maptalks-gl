<template>
  <Example2DemoShell
    description="filter（按属性筛选）过滤及显示特定几何（对应官网 6.10）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/layer/filter/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/layer/filter/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/layer/filter/EscapeImpl.vue';
import MixedImpl from '~/components/example2/layer/filter/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
