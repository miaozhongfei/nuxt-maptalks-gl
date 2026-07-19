<template>
  <!-- 3.12 连接线：仅逃生舱可表达（ConnectorLine/ArcConnectorLine 模块无直接封装） -->
  <Example2DemoShell
    description="ConnectorLine / ArcConnectorLine 连接两个几何（对应官网 3.12）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/demos/example2/geometry/connector-line/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
