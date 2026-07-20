<template>
  <!-- 2.17 D3投影（d3-projection） -->
  <Example2DemoShell
    description="d3-geo 投影包装为 maptalks 自定义投影（对应官网 2.17）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/components/example2/tilelayer/d3-projection/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
