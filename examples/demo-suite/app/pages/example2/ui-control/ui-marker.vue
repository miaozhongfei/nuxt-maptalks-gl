<template>
  <Example2DemoShell description="UIMarker 的 dx/dy 偏移对齐（对应官网 10.8）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/components/example2/ui-control/ui-marker/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
