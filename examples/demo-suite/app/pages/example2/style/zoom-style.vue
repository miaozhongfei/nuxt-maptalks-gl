<template>
  <Example2DemoShell
    description="根据地图 zoom 级别动态计算 Marker 大小（对应官网 5.26）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/components/example2/style/zoom-style/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/style/zoom-style/EscapeImpl.vue';
import MixedImpl from '~/components/example2/style/zoom-style/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
