<template>
  <Example2DemoShell
    description="原生 ui.UIMarker 锚定 HTML 内容到地图坐标（对应官网 5.29）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/components/example2/style/html-marker/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
