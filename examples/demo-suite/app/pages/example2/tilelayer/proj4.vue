<template>
  <!-- 2.16 Proj4js自定义投影底图 -->
  <Example2DemoShell
    description="proj4 定义 UTM 投影对象接入 spatialReference（对应官网 2.16）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/components/example2/tilelayer/proj4/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
