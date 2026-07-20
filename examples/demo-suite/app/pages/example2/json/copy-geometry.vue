<template>
  <Example2DemoShell description="Geometry.toJSON / fromJSON 复制几何（对应官网 11.7）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/components/example2/json/copy-geometry/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
