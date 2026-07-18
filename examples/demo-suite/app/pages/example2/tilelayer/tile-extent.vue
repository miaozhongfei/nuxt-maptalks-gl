<template>
  <!-- 2.12 只显示指定范围内的瓦片 -->
  <Example2DemoShell
    description="用 mask 多边形裁剪瓦片显示范围（gl 版等效官网 2.12 的 extent 效果）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/demos/example2/tilelayer/tile-extent/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
