<template>
  <!-- 2.3 添加瓦片图层组 -->
  <Example2DemoShell
    description="GroupTileLayer 瓦片图层组：多个 TileLayer 合并渲染（对应官网 2.3）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/components/example2/tilelayer/group-tilelayer/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/tilelayer/group-tilelayer/EscapeImpl.vue';
import MixedImpl from '~/components/example2/tilelayer/group-tilelayer/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
