<template>
  <Example2DemoShell
    description="CanvasTileLayer 自定义瓦片绘制（不推荐，建议使用标准 TileLayer；对应官网 6.16）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/components/example2/layer/canvas-tile-layer/ComposableImpl.vue';
import MixedImpl from '~/components/example2/layer/canvas-tile-layer/MixedImpl.vue';
import EscapeImpl from '~/components/example2/layer/canvas-tile-layer/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
