<template>
  <Example2DemoShell description="Attribution 版权控件（对应官网 10.17）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/demos/example2/ui-control/attribution-control/ComponentImpl.vue'
import ComposableImpl from '~/demos/example2/ui-control/attribution-control/ComposableImpl.vue'
import MixedImpl from '~/demos/example2/ui-control/attribution-control/MixedImpl.vue'
import EscapeImpl from '~/demos/example2/ui-control/attribution-control/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
