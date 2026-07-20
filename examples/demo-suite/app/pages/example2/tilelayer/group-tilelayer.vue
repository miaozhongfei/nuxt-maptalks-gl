<template>
  <!-- 2.3 添加瓦片图层组：仅逃生舱可表达 GroupTileLayer（模块无直接封装） -->
  <Example2DemoShell
    description="GroupTileLayer 瓦片图层组：多个 TileLayer 合并渲染（对应官网 2.3）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/components/example2/tilelayer/group-tilelayer/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
