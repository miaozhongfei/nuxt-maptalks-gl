<template>
  <Example2DemoShell description="ClusterLayer maptalks.markercluster 点聚合（对应官网 12.3）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/demos/example2/plugin/cluster-layer/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
