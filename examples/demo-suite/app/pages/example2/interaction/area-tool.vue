<template>
  <Example2DemoShell
    description="AreaTool 测面工具（对应官网 8.4）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/interaction/area-tool/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/interaction/area-tool/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/interaction/area-tool/EscapeImpl.vue';
import MixedImpl from '~/components/example2/interaction/area-tool/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
