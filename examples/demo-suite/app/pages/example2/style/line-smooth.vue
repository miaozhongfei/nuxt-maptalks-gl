<template>
  <Example2DemoShell
    description="smoothness: 0.5 曲线平滑处理，上红（原始）下深灰（平滑）对比（对应官网 5.19）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/style/line-smooth/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/style/line-smooth/ComposableImpl.vue';
import MixedImpl from '~/components/example2/style/line-smooth/MixedImpl.vue';
import EscapeImpl from '~/components/example2/style/line-smooth/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
