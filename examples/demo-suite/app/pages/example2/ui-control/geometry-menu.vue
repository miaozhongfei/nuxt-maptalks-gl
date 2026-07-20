<template>
  <Example2DemoShell description="Marker 的 contextmenu 事件响应（对应官网 10.2）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/components/example2/ui-control/geometry-menu/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
